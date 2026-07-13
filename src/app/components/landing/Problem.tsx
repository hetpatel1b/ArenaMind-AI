export function Problem() {
  return (
    <section className="container" style={{ padding: 'var(--space-16) 0' }}>
      <div
        className="animate-slide-up"
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--space-6)',
          }}
        >
          The Unprecedented Scale of 2026
        </h2>
        <p
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}
        >
          Managing a World Cup stadium means coordinating 80,000 fans, thousands of staff, and
          hundreds of spontaneous incidents in real-time. Traditional, siloed radio networks and
          static dashboards collapse under this operational weight, leading to critical delays.
        </p>
      </div>
    </section>
  );
}
