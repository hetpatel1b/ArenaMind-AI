export function Hero() {
  return (
    <section
      className="container flex-center"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url(/images/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay to ensure text contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.4), var(--bg-app))',
        }}
      />

      <div
        className="glass-panel animate-slide-up"
        style={{
          position: 'relative',
          zIndex: 'var(--z-overlay)',
          padding: 'var(--space-12)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          maxWidth: '800px',
        }}
      >
        <h1
          style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: 'var(--font-weight-bold)',
            lineHeight: 1.2,
            marginBottom: 'var(--space-4)',
          }}
        >
          The Intelligent Stadium <br />
          <span style={{ color: 'var(--ai-accent)' }}>Operations Copilot</span>
        </h1>
        <p
          style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-8)',
          }}
        >
          ArenaMind AI unifies crowd intelligence, incident response, and resource coordination for
          the FIFA World Cup 2026.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
          <button className="btn btn-primary" aria-label="Request a Demo">
            Request Demo
          </button>
          <button className="btn btn-outline" aria-label="Explore Platform Features">
            Explore Platform
          </button>
        </div>
      </div>
    </section>
  );
}
