import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Wallet, Bot, History, ChevronLeft } from 'lucide-react'
import { useSidebarStore, useNavStore } from '@/store/index'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/accounts', label: 'Accounts', icon: Wallet },
  { to: '/autotraders', label: 'Autotraders', icon: Bot },
  { to: '/trade-history', label: 'Trade History', icon: History },
] as const

export default function Sidebar() {
  const collapsed = useSidebarStore((s) => s.collapsed)
  const toggle = useSidebarStore((s) => s.toggle)
  const setLabel = useNavStore((s) => s.setActiveRouteLabel)
  const location = useLocation()

  useEffect(() => {
    const match = NAV_ITEMS.find((item) => location.pathname.startsWith(item.to))
    if (match) setLabel(match.label)
  }, [location.pathname, setLabel])

  return (
    <aside
      className="flex flex-col shrink-0 transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? '56px' : '210px',
        backgroundColor: 'var(--color-bg-sidebar)',
        borderRight: '1px solid var(--color-border-subtle)',
        position: 'relative',
      }}
    >
      {/* Vertical accent line */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0,
        width: '1px',
        background: 'linear-gradient(180deg, transparent, rgba(0,229,209,0.15) 40%, rgba(0,229,209,0.15) 60%, transparent)',
        pointerEvents: 'none',
      }} />

      {/* Logo / toggle */}
      <div
        className="flex items-center h-14 shrink-0"
        style={{
          borderBottom: '1px solid var(--color-border-subtle)',
          padding: collapsed ? '0 16px' : '0 16px',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}
      >
        {!collapsed && (
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: '0.95rem',
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary)',
          }}>
            BY<span style={{ color: 'var(--color-accent)' }}>SCRIPT</span>
          </span>
        )}
        <button
          onClick={toggle}
          style={{
            color: 'var(--color-text-muted)',
            transition: 'color 0.15s',
            lineHeight: 1,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          <ChevronLeft size={16} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 flex flex-col gap-0.5" style={{ padding: '12px 8px' }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname.startsWith(item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: collapsed ? '9px 0' : '9px 10px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: '5px',
                transition: 'all 0.15s ease',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                backgroundColor: isActive ? 'var(--color-accent-bg)' : 'transparent',
                border: isActive ? '1px solid rgba(0,229,209,0.12)' : '1px solid transparent',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--color-text-muted)'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {/* Active indicator dot */}
              {isActive && (
                <span style={{
                  position: 'absolute',
                  left: collapsed ? '50%' : 0,
                  top: '50%',
                  transform: collapsed ? 'translateX(-50%) translateY(-50%)' : 'translateY(-50%)',
                  width: '3px',
                  height: '16px',
                  borderRadius: '0 2px 2px 0',
                  backgroundColor: 'var(--color-accent)',
                  boxShadow: '0 0 8px var(--color-accent)',
                  marginLeft: collapsed ? 0 : '-10px',
                  display: collapsed ? 'none' : 'block',
                }} />
              )}
              {isActive && collapsed && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '16px',
                  height: '2px',
                  borderRadius: '1px',
                  backgroundColor: 'var(--color-accent)',
                  boxShadow: '0 0 6px var(--color-accent)',
                }} />
              )}
              <Icon size={15} strokeWidth={isActive ? 2 : 1.5} />
              {!collapsed && (
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: '0.02em',
                }}>
                  {item.label}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom version tag */}
      {!collapsed && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--color-border-subtle)',
        }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.68rem',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.08em',
          }}>
            v1.0.0 — BETA
          </span>
        </div>
      )}
    </aside>
  )
}
