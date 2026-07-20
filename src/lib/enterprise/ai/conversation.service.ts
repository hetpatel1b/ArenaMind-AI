import { prisma } from '@/lib/db/client';
import { AIMessage } from './types';
import { organizationResolver } from '@/lib/services/organization-resolver';
import { isUUID, toOptionalUUID } from '@/lib/validation/uuid';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

export class ConversationService {
  async getOrCreateConversation(
    organizationId: string,
    matchId?: string,
    userId?: string
  ): Promise<string> {
    const resolvedOrgId = await organizationResolver.resolveOrganizationId(organizationId);
    const validMatchId = toOptionalUUID(matchId);
    const validUserId = toOptionalUUID(userId);

    const whereClause: SafeAny = { organizationId: resolvedOrgId };
    if (validMatchId) whereClause.matchId = validMatchId;
    if (validUserId) whereClause.userId = validUserId;

    try {
      // Look for recent active conversation for this scope
      let conv = await prisma.aiConversation.findFirst({
        where: whereClause,
        orderBy: { updatedAt: 'desc' },
      });

      if (!conv) {
        conv = await prisma.aiConversation.create({
          data: {
            organizationId: resolvedOrgId,
            matchId: validMatchId,
            userId: validUserId,
            title: 'Copilot Session',
            contextData: {},
          },
        });
      }

      return conv.id;
    } catch (error) {
      LoggerService.error('[ConversationService] Error in getOrCreateConversation:', error);

      // Fallback: try creating conversation with minimum required valid organizationId
      try {
        const fallbackConv = await prisma.aiConversation.create({
          data: {
            organizationId: resolvedOrgId,
            title: 'Copilot Session',
            contextData: {},
          },
        });
        return fallbackConv.id;
      } catch (fallbackError) {
        LoggerService.error('[ConversationService] Critical fallback failed:', fallbackError);
        // Generates ephemeral UUID if DB is temporarily unreachable to prevent application crash
        return crypto.randomUUID();
      }
    }
  }

  async addMessage(
    conversationId: string,
    role: 'system' | 'user' | 'assistant',
    content: string,
    tokenCount?: number
  ) {
    if (!isUUID(conversationId)) {
      LoggerService.warn(
        '[ConversationService] Skipping addMessage for invalid conversationId UUID',
        { conversationId }
      );
      return;
    }

    try {
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
    } catch (error) {
      LoggerService.error('[ConversationService] Error adding message:', error);
    }
  }

  async getContextWindow(conversationId: string, maxMessages: number = 10): Promise<AIMessage[]> {
    if (!isUUID(conversationId)) {
      return [];
    }

    try {
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
    } catch (error) {
      LoggerService.error('[ConversationService] Error loading context window:', error);
      return [];
    }
  }
}

export const conversationService = new ConversationService();
