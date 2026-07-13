export function CommandCenterPreview() {
  return (
    <section className="container" style={{ padding: 'var(--space-16) 0' }}>
      <div
        className="glass-panel-elevated animate-slide-up"
        style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div
          style={{
            padding: 'var(--space-4)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: 'var(--border-strong)',
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: 'var(--border-strong)',
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: 'var(--border-strong)',
              }}
            />
          </div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              letterSpacing: '0.05em',
            }}
          >
            ARENAMIND // LIVE OPs // LUSAIL STADIUM
          </div>
        </div>

        {/* The mockup image generated via AI */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            backgroundColor: 'var(--bg-app)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/dashboard-preview.png"
            alt="ArenaMind AI Command Center Interface"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
