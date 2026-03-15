import { Menu, Bell, Plus, LogOut, User } from 'lucide-react'
import { useSidebarStore, useNavStore, useAddAccountModalStore } from '@/store/index'
import AddAccountModal from '@/components/AddAccountModal'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const toggle = useSidebarStore((s) => s.toggle)
  const label = useNavStore((s) => s.activeRouteLabel)
  const { open, openModal, closeModal } = useAddAccountModalStore()
  const { user, signOut } = useAuth()

  return (
    <>
      <nav
        className="relative flex items-center justify-between shrink-0"
        style={{
          backgroundColor: 'var(--color-bg-sidebar)',
          borderBottom: '1px solid var(--color-border-subtle)',
          height: '56px',
          padding: '0 20px',
        }}
      >
        {/* Bottom glow line */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,229,209,0.2) 30%, rgba(0,229,209,0.2) 70%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Left: menu toggle + route label */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            style={{ color: 'var(--color-text-muted)', lineHeight: 1, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            <Menu size={16} strokeWidth={1.5} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '4px', height: '4px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-accent)',
              boxShadow: '0 0 6px var(--color-accent)',
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
            }}>
              {label}
            </span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={openModal}
            className="flex items-center gap-1.5"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              padding: '5px 11px',
              borderRadius: '4px',
              border: '1px solid var(--color-accent)',
              backgroundColor: 'var(--color-accent-bg-strong)',
              color: 'var(--color-accent)',
              transition: 'all 0.15s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)'
              e.currentTarget.style.color = '#080c10'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-bg-strong)'
              e.currentTarget.style.color = 'var(--color-accent)'
            }}
          >
            <Plus size={12} strokeWidth={2.5} />
            ADD ACCOUNT
          </button>

          <button
            style={{ color: 'var(--color-text-muted)', lineHeight: 1, transition: 'color 0.15s', position: 'relative' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            <Bell size={15} strokeWidth={1.5} />
          </button>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--color-border-subtle)' }} />

          {/* User */}
          <div className="flex items-center gap-2">
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.68rem',
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.03em',
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {user?.displayName ?? 'User'}
            </span>

            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName ?? 'User'}
                style={{
                  width: '26px', height: '26px',
                  borderRadius: '4px',
                  objectFit: 'cover',
                  border: '1px solid var(--color-border-subtle)',
                }}
              />
            ) : (
              <div style={{
                width: '26px', height: '26px',
                borderRadius: '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'var(--color-accent-bg-strong)',
                border: '1px solid rgba(0,229,209,0.2)',
              }}>
                <User size={12} style={{ color: 'var(--color-accent)' }} />
              </div>
            )}

            <button
              onClick={signOut}
              title="Sign out"
              style={{ color: 'var(--color-text-muted)', lineHeight: 1, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-negative)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
            >
              <LogOut size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      <AddAccountModal open={open} onClose={closeModal} />
    </>
  )
}
