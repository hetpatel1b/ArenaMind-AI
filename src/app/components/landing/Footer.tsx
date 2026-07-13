export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: 'var(--space-12) 0',
        backgroundColor: 'var(--bg-app)',
        marginTop: 'var(--space-16)',
      }}
    >
      <div className="container flex-between" style={{ flexWrap: 'wrap', gap: 'var(--space-8)' }}>
        <div>
          <h4 style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-2)' }}>
            ArenaMind AI
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            The Intelligent Stadium Operations Copilot.
            <br />
            Built for the FIFA World Cup 2026.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)' }}>
              Product
            </span>
            <a href="#" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              Features
            </a>
            <a href="#" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              Security
            </a>
            <a href="#" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              Enterprise API
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)' }}>
              Resources
            </span>
            <a href="#" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              Documentation
            </a>
            <a href="#" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              Status
            </a>
            <a href="#" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              GitHub
            </a>
          </div>
        </div>
      </div>
      <div
        className="container"
        style={{
          marginTop: 'var(--space-8)',
          textAlign: 'center',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-tertiary)',
        }}
      >
        &copy; {new Date().getFullYear()} ArenaMind AI. All rights reserved.
      </div>
    </footer>
  );
}
