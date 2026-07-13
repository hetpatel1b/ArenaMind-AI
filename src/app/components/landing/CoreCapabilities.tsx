export function CoreCapabilities() {
  const features = [
    {
      title: 'Crowd Intelligence',
      desc: 'Predictive modeling prevents congestion at gates and concourses.',
    },
    {
      title: 'Incident Management',
      desc: 'AI categorizes severity and suggests nearby medical or security staff.',
    },
    {
      title: 'Accessibility Routing',
      desc: 'Generates optimal paths for wheelchair users based on live elevator statuses.',
    },
    {
      title: 'Transport Coordination',
      desc: 'Integrates with local transit APIs to sync egress with train schedules.',
    },
    {
      title: 'Multilingual Assistance',
      desc: 'Auto-translates staff reports and fan broadcasts dynamically.',
    },
    {
      title: 'Sustainability Tracking',
      desc: 'Monitors real-time HVAC and power usage across zones.',
    },
  ];

  return (
    <section className="container" style={{ padding: 'var(--space-16) 0' }}>
      <h2
        style={{
          fontSize: 'var(--text-3xl)',
          fontWeight: 'var(--font-weight-bold)',
          marginBottom: 'var(--space-12)',
        }}
      >
        Core Capabilities
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {features.map((feature, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: 'var(--space-6)',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: 'none',
              transition: 'transform var(--duration-fast) var(--ease-out)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: 'var(--space-2)',
              }}
            >
              {feature.title}
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
