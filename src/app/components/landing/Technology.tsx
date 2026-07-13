export function Technology() {
  return (
    <section
      style={{
        padding: 'var(--space-16) 0',
        backgroundColor: 'var(--bg-surface-elevated)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Enterprise Foundation
          </h2>
          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-12)',
            }}
          >
            Built on a battle-tested Next.js App Router stack, backed by strict TypeScript,
            PostgreSQL, and decoupled adapter patterns.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 'var(--space-4)',
            }}
          >
            {[
              'Next.js 14',
              'PostgreSQL',
              'Prisma',
              'SOLID Architecture',
              'WCAG 2.2 AA',
              'Zero Vendor Lock-in',
            ].map((tech) => (
              <span
                key={tech}
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-primary)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
