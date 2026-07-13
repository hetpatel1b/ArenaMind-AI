export function Metrics() {
  const metrics = [
    { label: 'Active Sensors', value: '45,210' },
    { label: 'Inference Latency', value: '< 200ms' },
    { label: 'Uptime SLA', value: '99.99%' },
    { label: 'Incidents Prevented', value: '1,402' },
  ];

  return (
    <section className="container" style={{ padding: 'var(--space-16) 0' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-8)',
          justifyContent: 'space-around',
          textAlign: 'center',
        }}
      >
        {metrics.map((m, i) => (
          <div
            key={i}
            className="metric-card animate-slide-up"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="metric-card-value">{m.value}</div>
            <div className="metric-card-label">{m.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
