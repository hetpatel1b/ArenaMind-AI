import { Notification } from '@prisma/client';
import { AlertDto } from './dto';

export function toAlertDto(notification: Notification): AlertDto {
  return {
    id: notification.id,
    userId: notification.userId,
    matchId: notification.matchId,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    data: notification.data,
    createdAt: notification.createdAt,
  };
}
