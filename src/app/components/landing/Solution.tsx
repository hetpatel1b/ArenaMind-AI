export function Solution() {
  return (
    <section className="container" style={{ padding: 'var(--space-16) 0' }}>
      <div
        className="card animate-fade-in"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-8)',
          alignItems: 'center',
          borderColor: 'var(--ai-accent)',
          borderWidth: '1px',
        }}
      >
        <div style={{ padding: 'var(--space-6)' }}>
          <div
            style={{
              color: 'var(--ai-accent)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-bold)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 'var(--space-2)',
            }}
          >
            Human-in-the-loop AI
          </div>
          <h2
            style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Predict. Recommend. Resolve.
          </h2>
          <p
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: 'var(--space-6)',
            }}
          >
            ArenaMind AI ingests millions of data points from stadium sensors, weather APIs, and
            staff reports to predict bottlenecks before they form. It generates actionable response
            plans, leaving the final critical decision to human operators.
          </p>
          <ul
            style={{
              color: 'var(--text-secondary)',
              paddingLeft: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            <li>Continuous Sensor Ingestion</li>
            <li>Predictive Crowd Modeling</li>
            <li>Automated Dispatch Suggestions</li>
          </ul>
        </div>

        <div
          className="glass-panel"
          style={{
            height: '100%',
            minHeight: '300px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow-ai)',
          }}
        >
          <div className="animate-pulse" style={{ color: 'var(--ai-accent)' }}>
            [ AI Inference Core Active ]
          </div>
        </div>
      </div>
    </section>
  );
}
