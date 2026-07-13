import { AccessibilityRequest } from '@prisma/client';
import { AccessibilityRequestDto } from './dto';

export function toAccessibilityRequestDto(request: AccessibilityRequest): AccessibilityRequestDto {
  return {
    id: request.id,
    matchId: request.matchId,
    zoneId: request.zoneId,
    requestType: request.requestType,
    status: request.status,
    priority: request.priority,
  };
}
