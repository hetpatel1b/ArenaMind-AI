import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGenericMutation } from '@/lib/api-client/mutations';
import { incidentApi } from '@/lib/api-client/features/incident';

export function CopilotWhatIfEngine() {
  const [selectedOption, setSelectedOption] = useState<
    'APPROVE' | 'IGNORE' | 'ESCALATE' | 'EVACUATE' | null
  >(null);

  const executeMutation = useGenericMutation(
    (variables: { scenario: string }) => incidentApi.executeScenario(variables),
    {
      invalidateKeys: [['incidents', 'engine']],
    }
  );

  const options = [
    {
      id: 'APPROVE',
      label: 'Approve Recommendation',
      color: '#3e82f7',
      impact: 'Moderate',
      cost: 'Nominal',
      time: '12m',
    },
    {
      id: 'IGNORE',
      label: 'Ignore Incident',
      color: '#ff453a',
      impact: 'Severe',
      cost: 'High Risk',
      time: 'N/A',
    },
    {
      id: 'ESCALATE',
      label: 'Escalate to Command',
      color: '#ff9f0a',
      impact: 'High',
      cost: 'Increased',
      time: '4m',
    },
    {
      id: 'EVACUATE',
      label: 'Initiate Evacuation',
      color: '#bf5af2',
      impact: 'Critical',
      cost: 'Maximum',
      time: '2m',
    },
  ] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{ fontSize: '12px', color: '#bf5af2', textTransform: 'uppercase', fontWeight: 600 }}
      >
        What-If Simulation
      </div>

      {options.map((opt) => (
        <motion.button
          key={opt.id}
          onClick={() => setSelectedOption(opt.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            background:
              selectedOption === opt.id
                ? `rgba(${opt.color === '#ff453a' ? '255,69,58' : opt.color === '#3e82f7' ? '62,130,247' : opt.color === '#ff9f0a' ? '255,159,10' : '191,90,242'}, 0.1)`
                : 'rgba(255,255,255,0.02)',
            border: `1px solid ${selectedOption === opt.id ? opt.color : 'var(--border-subtle)'}`,
            borderRadius: '8px',
            padding: '16px',
            cursor: 'pointer',
            textAlign: 'left',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 600, color: opt.color }}>{opt.label}</div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span>IMPACT</span>
              <span style={{ color: '#fff' }}>{opt.impact}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span>COST</span>
              <span style={{ color: '#fff' }}>{opt.cost}</span>
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}
            >
              <span>RECOVERY</span>
              <span style={{ color: '#fff' }}>{opt.time}</span>
            </div>
          </div>
        </motion.button>
      ))}

      {selectedOption && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => executeMutation.mutate({ scenario: selectedOption })}
          disabled={executeMutation.isPending}
          style={{
            background: executeMutation.isPending ? 'var(--bg-surface-active)' : '#3e82f7',
            border: 'none',
            color: '#fff',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: executeMutation.isPending ? 'not-allowed' : 'pointer',
            marginTop: '8px',
            opacity: executeMutation.isPending ? 0.7 : 1,
          }}
        >
          {executeMutation.isPending ? 'EXECUTING...' : 'EXECUTE SCENARIO'}
        </motion.button>
      )}
    </div>
  );
}
