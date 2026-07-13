import { Match } from '@prisma/client';
import { MatchDto } from './dto';

export function toMatchDto(match: Match): MatchDto {
  return {
    id: match.id,
    stadiumId: match.stadiumId,
    matchNumber: match.matchNumber,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    scheduledAt: match.scheduledAt,
    kickoffAt: match.kickoffAt,
    endedAt: match.endedAt,
    currentPhase: match.currentPhase,
    matchStatus: match.matchStatus,
    expectedAttendance: match.expectedAttendance,
    actualAttendance: match.actualAttendance,
    weatherSummary: match.weatherSummary,
  };
}
