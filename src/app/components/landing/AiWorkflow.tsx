export function AiWorkflow() {
  const steps = [
    {
      num: '01',
      title: 'Ingest',
      desc: 'Continuous streams from turnstiles, weather APIs, and staff reports.',
    },
    {
      num: '02',
      title: 'Analyze',
      desc: 'Predictive models evaluate bottlenecks and risk probabilities.',
    },
    { num: '03', title: 'Recommend', desc: 'AI generates targeted dispatch solutions.' },
    { num: '04', title: 'Execute', desc: 'Human operators approve, dispatching alerts instantly.' },
  ];

  return (
    <section className="container" style={{ padding: 'var(--space-16) 0' }}>
      <h2
        style={{
          textAlign: 'center',
          fontSize: 'var(--text-3xl)',
          fontWeight: 'var(--font-weight-bold)',
          marginBottom: 'var(--space-12)',
        }}
      >
        The Copilot Workflow
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            className="card animate-slide-up"
            style={{
              animationDelay: `${i * 100}ms`,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            <div
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--border-strong)',
              }}
            >
              {step.num}
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
              {step.title}
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
