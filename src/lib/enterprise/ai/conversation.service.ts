import { prisma } from '@/lib/db/client';
import { AIMessage } from './types';

export class ConversationService {
  async getOrCreateConversation(
    organizationId: string,
    matchId?: string,
    userId?: string
  ): Promise<string> {
    const validMatchId = matchId === 'system-default-match' ? undefined : matchId;
    const whereClause: SafeAny = { organizationId };
    if (validMatchId) whereClause.matchId = validMatchId;
    if (userId) whereClause.userId = userId;

    // Look for recent active conversation for this scope
    let conv = await prisma.aiConversation.findFirst({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
    });

    if (!conv) {
      conv = await prisma.aiConversation.create({
        data: {
          organizationId,
          matchId: validMatchId,
          userId,
          title: 'Copilot Session',
        },
      });
    }

    return conv.id;
  }

  async addMessage(
    conversationId: string,
    role: 'system' | 'user' | 'assistant',
    content: string,
    tokenCount?: number
  ) {
    await prisma.aiMessage.create({
      data: {
        conversationId,
        role,
        content,
        tokenCount,
      },
    });

    // Touch the conversation
    await prisma.aiConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
  }

  async getContextWindow(conversationId: string, maxMessages: number = 10): Promise<AIMessage[]> {
    const messages = await prisma.aiMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: maxMessages,
    });

    // Reverse to chronological order
    return messages.reverse().map((m: SafeAny) => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content,
    }));
  }
}

export const conversationService = new ConversationService();
