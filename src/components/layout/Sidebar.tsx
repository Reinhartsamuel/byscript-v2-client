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
        width: collapsed ? '60px' : '220px',
        backgroundColor: 'var(--color-bg-sidebar)',
        borderRight: '1px solid var(--color-border-subtle)',
      }}
    >
      <div className="flex items-center justify-between px-4 h-14" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
        {!collapsed && <span className="text-primary text-sm font-bold tracking-wide">ByScript</span>}
        <button onClick={toggle} className="text-secondary hover:text-primary ml-auto">
          <ChevronLeft size={18} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname.startsWith(item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg transition-colors"
              style={{
                borderLeft: isActive ? '3px solid var(--color-accent-green)' : '3px solid transparent',
                backgroundColor: isActive ? 'rgba(74,222,128,0.07)' : 'transparent',
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              }}
            >
              <Icon size={18} />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
