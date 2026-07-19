'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { matchApi } from '@/lib/api-client/features/match';
import { CommandCenterDashboard } from '@/app/components/dashboard/CommandCenterDashboard';

export function DashboardClient({
  initialMatchData,
  organizationId,
}: {
  initialMatchData: SafeAny;
  organizationId: string;
}) {
  const { data } = useQuery({
    queryKey: ['match', 'active', organizationId],
    queryFn: () => matchApi.getMatches(),
    initialData: [initialMatchData], // wrap in array to match API shape
    staleTime: Infinity,
  });

  const matchData = Array.isArray(data)
    ? data.find((m: SafeAny) => m.matchStatus === 'active') || data[0]
    : data;

  if (!matchData) {
    return (
      <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
        <h1>No Active Match Found</h1>
        <p>Please ensure a match is set to active in your organization.</p>
      </div>
    );
  }

  return <CommandCenterDashboard matchData={matchData} />;
}
