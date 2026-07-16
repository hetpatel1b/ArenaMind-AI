'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '@/app/hooks/useWorkspaceStore';

export function EnterpriseSettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { appearance, shortcuts, setTheme, setReducedMotion, setHighContrast, toggleShortcuts } =
    useWorkspaceStore();
  const [activeTab, setActiveTab] = useState('general');

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              width: '100%',
              maxWidth: '800px',
              height: '80vh',
              maxHeight: '600px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              overflow: 'hidden',
            }}
          >
            {/* Sidebar */}
            <div
              style={{
                width: '220px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRight: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  padding: 'var(--space-4)',
                  fontSize: 'var(--text-md)',
                  fontWeight: 'bold',
                }}
              >
                Enterprise Settings
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--space-2)' }}>
                {[
                  { id: 'general', label: 'General' },
                  { id: 'appearance', label: 'Appearance' },
                  { id: 'accessibility', label: 'Accessibility' },
                  { id: 'keyboard', label: 'Keyboard Shortcuts' },
                  { id: 'notifications', label: 'Notifications' },
                  { id: 'workspace', label: 'Workspace' },
                  { id: 'privacy', label: 'Privacy' },
                  { id: 'developer', label: 'Developer' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: 'var(--space-3)',
                      backgroundColor:
                        activeTab === tab.id ? 'var(--brand-primary)' : 'transparent',
                      color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      marginBottom: 'var(--space-1)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--bg-surface-elevated)',
              }}
            >
              <div
                style={{
                  padding: 'var(--space-4)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h2 style={{ margin: 0, fontSize: 'var(--text-lg)', textTransform: 'capitalize' }}>
                  {activeTab.replace('-', ' ')}
                </h2>
                <button
                  onClick={onClose}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: 'var(--space-2)',
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)' }}>
                {activeTab === 'appearance' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <div>
                      <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--text-md)' }}>
                        Theme Preference
                      </h3>
                      <p
                        style={{
                          margin: '0 0 var(--space-4) 0',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        Select your default workspace theme. Dark mode is recommended for prolonged
                        operations.
                      </p>
                      <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                        {['light', 'dark', 'system'].map((t) => (
                          <button
                            key={t}
                            onClick={() => setTheme(t as any)}
                            style={{
                              padding: 'var(--space-4) var(--space-6)',
                              backgroundColor:
                                appearance.theme === t ? 'rgba(255,255,255,0.05)' : 'transparent',
                              border: `1px solid ${appearance.theme === t ? 'var(--brand-primary)' : 'var(--border-strong)'}`,
                              color:
                                appearance.theme === t
                                  ? 'var(--text-primary)'
                                  : 'var(--text-secondary)',
                              borderRadius: 'var(--radius-md)',
                              cursor: 'pointer',
                              textTransform: 'capitalize',
                              fontWeight: appearance.theme === t ? 'bold' : 'normal',
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'accessibility' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <h3 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--text-md)' }}>
                          Reduced Motion
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          Minimizes the amount of non-essential motion.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={appearance.reducedMotion}
                        onChange={(e) => setReducedMotion(e.target.checked)}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      />
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '1px',
                        backgroundColor: 'var(--border-subtle)',
                      }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <h3 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--text-md)' }}>
                          High Contrast
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          Increases contrast across all workspace elements.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={appearance.highContrast}
                        onChange={(e) => setHighContrast(e.target.checked)}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'keyboard' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <h3 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--text-md)' }}>
                          Enable Global Shortcuts
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          Allow keyboard shortcuts to navigate the workspace.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={shortcuts.enabled}
                        onChange={(e) => toggleShortcuts(e.target.checked)}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      />
                    </div>
                    <p
                      style={{
                        marginTop: 'var(--space-4)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      Press{' '}
                      <kbd
                        style={{
                          padding: '2px 4px',
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '4px',
                        }}
                      >
                        Shift
                      </kbd>{' '}
                      +{' '}
                      <kbd
                        style={{
                          padding: '2px 4px',
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '4px',
                        }}
                      >
                        ?
                      </kbd>{' '}
                      anywhere to view all available shortcuts.
                    </p>
                  </div>
                )}

                {/* Fallback for other tabs */}
                {['general', 'notifications', 'workspace', 'privacy', 'developer'].includes(
                  activeTab
                ) && (
                  <div
                    style={{
                      padding: 'var(--space-8)',
                      textAlign: 'center',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Settings for {activeTab} will be available in the next sprint.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
