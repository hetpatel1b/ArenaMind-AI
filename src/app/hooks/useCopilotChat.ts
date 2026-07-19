import { useState, useCallback, useRef } from 'react';
import { StructuredAIResponse } from '@/lib/enterprise/ai/types';

export type CopilotMessageRole = 'user' | 'assistant';

export interface CopilotMessage {
  id: string;
  role: CopilotMessageRole;
  content: string; // for user
  response?: StructuredAIResponse; // for assistant
  isLoading?: boolean;
  progress?: string;
  error?: string;
}

export interface UseCopilotChatOptions {
  moduleFeature: string;
  matchId?: string;
  contextData?: SafeAny;
}

export function useCopilotChat({ moduleFeature, matchId, contextData }: UseCopilotChatOptions) {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMessageId = Date.now().toString();
      const assistantMessageId = (Date.now() + 1).toString();

      setMessages((prev) => [
        ...prev,
        { id: userMessageId, role: 'user', content: text },
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          isLoading: true,
          progress: 'Connecting...',
        },
      ]);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch('/api/v1/ai/copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            moduleFeature,
            matchId,
            contextData,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        if (!reader) throw new Error('No reader available');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          let currentEvent = '';
          let currentData = '';

          for (const line of lines) {
            if (line.startsWith('event: ')) {
              currentEvent = line.substring(7).trim();
            } else if (line.startsWith('data: ')) {
              currentData = line.substring(6).trim();
            } else if (line === '') {
              if (currentEvent && currentData) {
                const parsed = JSON.parse(currentData);
                if (currentEvent === 'progress') {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessageId ? { ...m, progress: parsed.step } : m
                    )
                  );
                } else if (currentEvent === 'complete') {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessageId
                        ? { ...m, isLoading: false, progress: undefined, response: parsed.result }
                        : m
                    )
                  );
                } else if (currentEvent === 'error') {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessageId
                        ? { ...m, isLoading: false, progress: undefined, error: parsed.message }
                        : m
                    )
                  );
                }
                currentEvent = '';
                currentData = '';
              }
            }
          }
        }
      } catch (error: SafeAny) {
        if (error.name === 'AbortError') {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId
                ? { ...m, isLoading: false, progress: undefined, error: 'Request cancelled.' }
                : m
            )
          );
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId
                ? {
                    ...m,
                    isLoading: false,
                    progress: undefined,
                    error: error.message || 'Failed to connect.',
                  }
                : m
            )
          );
        }
      } finally {
        abortControllerRef.current = null;
      }
    },
    [moduleFeature, matchId, contextData]
  );

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    stopGeneration();
  }, [stopGeneration]);

  return {
    messages,
    sendMessage,
    stopGeneration,
    clearHistory,
    isLoading: !!abortControllerRef.current,
  };
}
