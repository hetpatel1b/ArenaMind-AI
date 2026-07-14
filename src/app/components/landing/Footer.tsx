'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '80px 24px 40px',
        backgroundColor: '#050507',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(100, 150, 255, 0.2), transparent)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '30%',
          height: '1px',
        }}
      >
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: '100px',
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, rgba(100, 150, 255, 0.8), transparent)',
          }}
        />
      </div>

      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '60px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.4) 100%)',
              }}
            />
            <span
              style={{
                fontWeight: 600,
                color: '#fff',
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
              }}
            >
              ArenaMind AI
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Enterprise Intelligence Platform <br />
            Built for FIFA World Cup 2026
          </p>
        </div>

        {/* System Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span
            style={{
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            SYSTEM STATUS
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
              }}
            />
            <span
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
              }}
            >
              SECURE CONNECTION ESTABLISHED
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
              }}
            />
            <span
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
              }}
            >
              SOC 2 Type II Certified
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#38bdf8',
              }}
            />
            <span
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
              }}
            >
              99.999% Uptime
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#38bdf8',
              }}
            />
            <span
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
              }}
            >
              Global Infrastructure Online
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
              }}
            />
            <span
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
              }}
            >
              Latency &lt;45ms
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span
            style={{
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            NAVIGATION
          </span>
          {[
            { label: 'Platform', href: '#' },
            { label: 'Security', href: '#' },
            { label: 'Documentation', href: '#' },
            { label: 'API Reference', href: '#' },
            { label: 'Developer Portal', href: '#' },
            { label: 'GitHub', href: '#' },
            { label: 'System Status', href: '#' },
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.875rem',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.textShadow = '0 0 10px rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.textShadow = 'none';
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div
        className="container"
        style={{
          marginTop: '60px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '60px auto 0',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
          &copy; {new Date().getFullYear()} ArenaMind AI. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
