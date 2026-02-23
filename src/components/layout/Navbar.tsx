import { Menu, Bell, User, Plus, LogOut } from 'lucide-react'
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
        className="relative flex items-center justify-between px-6 h-14 shrink-0"
        style={{ backgroundColor: 'var(--color-bg-sidebar)', borderBottom: '1px solid var(--color-border-subtle)' }}
      >
        <button onClick={toggle} className="text-secondary hover:text-primary transition-colors">
          <Menu size={20} />
        </button>

        <h1 className="text-primary text-sm font-semibold tracking-wide uppercase absolute left-1/2 -translate-x-1/2">
          {label}
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={openModal}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-accent-green-dim)', color: '#fff' }}
          >
            <Plus size={14} />
            Add Account
          </button>
          <button className="text-secondary hover:text-primary">
            <Bell size={18} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-secondary text-xs uppercase tracking-wide">
              {user?.displayName ?? 'User'}
            </span>
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName ?? 'User'}
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-accent-green-dim)' }}
              >
                <User size={14} className="text-white" />
              </div>
            )}
            <button
              onClick={signOut}
              className="text-secondary hover:text-primary transition-colors"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <AddAccountModal open={open} onClose={closeModal} />
    </>
  )
}
