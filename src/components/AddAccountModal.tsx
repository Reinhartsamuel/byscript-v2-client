import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { registerExchangeAccount } from '@/lib/api'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { darkToast } from './DarkToast';
const EXCHANGES = ['Gate', 'OKX', 'Hyperliquid']

interface AddAccountModalProps {
  open: boolean
  onClose: () => void
}

export default function AddAccountModal({ open, onClose }: AddAccountModalProps) {
  const [exchange, setExchange] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [apiSecret, setApiSecret] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [loading, setLoading] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setExchange('')
      setApiKey('')
      setApiSecret('')
      setPassphrase('')
      setLoading(false)
    }
  }, [open])

  // Close on Escape key (not while loading)
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !loading) onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, loading, onClose])

  if (!open) return null

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const user = localStorage.getItem('user');
    if (!user) {
      darkToast.error('User not found');
      setLoading(false);
      return;
    }

    darkToast.info(`Registering ${exchange} account...`);

    try {
      const addAccount = await registerExchangeAccount({
        exchange: exchange.toLowerCase() as 'gate' | 'okx' | 'hyperliquid',
        api_key: apiKey,
        api_secret: apiSecret,
        api_passphrase: passphrase,
        user_id: JSON.parse(user).id as number,
      })
      setExchange('');
      setApiKey('');
      setApiSecret('');
      setPassphrase('');
      console.log(addAccount, 'addAccount')
      darkToast.success(`Successfully registered ${exchange} account!`);
      onClose();
    } catch (e:Error|any) {
      darkToast.error(e.message);
      console.log('Error registering exchange account:', e.message);
    } finally {
      setLoading(false);
    }
  }

    const isOKX = exchange === 'OKX'

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={loading ? undefined : onClose}
      >
        <ToastContainer />
        <div
          className="relative w-full max-w-md rounded-xl p-6 flex flex-col gap-5"
          style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-primary text-base font-semibold">Add Account</h2>
            <button onClick={onClose} disabled={loading} className="text-secondary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.15s' }}>
            {/* Exchange */}
            <div className="flex flex-col gap-1.5">
              <label className="text-secondary text-xs uppercase tracking-wide">Exchange</label>
              <div className="relative">
                <select
                  required
                  value={exchange}
                  onChange={(e) => setExchange(e.target.value)}
                  className="w-full text-primary text-sm rounded-lg px-3 py-2.5 appearance-none pr-8"
                  style={{
                    backgroundColor: 'var(--color-bg-page)',
                    border: '1px solid var(--color-border-subtle)',
                    outline: 'none',
                  }}
                >
                  <option value="" disabled style={{ backgroundColor: '#22223a' }}>Select exchange</option>
                  {EXCHANGES.map((ex) => (
                    <option key={ex} value={ex} style={{ backgroundColor: '#22223a' }}>{ex}</option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary"
                  width="12" height="12" viewBox="0 0 12 12" fill="currentColor"
                >
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* API Key */}
            <div className="flex flex-col gap-1.5">
              <label className="text-secondary text-xs uppercase tracking-wide">API Key</label>
              <input
                required
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API key"
                className="text-primary text-sm rounded-lg px-3 py-2.5"
                style={{
                  backgroundColor: 'var(--color-bg-page)',
                  border: '1px solid var(--color-border-subtle)',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent-green-dim)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-subtle)')}
              />
            </div>

            {/* API Secret */}
            <div className="flex flex-col gap-1.5">
              <label className="text-secondary text-xs uppercase tracking-wide">API Secret</label>
              <input
                required
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="Enter API secret"
                className="text-primary text-sm rounded-lg px-3 py-2.5"
                style={{
                  backgroundColor: 'var(--color-bg-page)',
                  border: '1px solid var(--color-border-subtle)',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent-green-dim)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-subtle)')}
              />
            </div>

            {/* Passphrase — OKX only */}
            {isOKX && (
              <div className="flex flex-col gap-1.5">
                <label className="text-secondary text-xs uppercase tracking-wide">API Passphrase</label>
                <input
                  required
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter API passphrase"
                  className="text-primary text-sm rounded-lg px-3 py-2.5"
                  style={{
                    backgroundColor: 'var(--color-bg-page)',
                    border: '1px solid var(--color-border-subtle)',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent-green-dim)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-subtle)')}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-secondary transition-colors hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ border: '1px solid var(--color-border-subtle)', backgroundColor: 'transparent' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--color-accent-green-dim)', color: '#fff' }}
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? 'Adding...' : 'Add Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
