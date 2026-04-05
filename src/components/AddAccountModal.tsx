import { useState, useEffect } from 'react'
import { X, Loader2, Copy, Check } from 'lucide-react'
import { registerExchangeAccount } from '@/lib/api'
import { ToastContainer } from 'react-toastify';
import { darkToast } from './DarkToast';

export const exchanges = [
  {
    exchange_name: 'GATE',
    exchange_thumbnail: 'https://assets.coingecko.com/markets/images/60/large/Frame_1.png?1747795534',
  },
  {
    exchange_name: 'OKX',
    exchange_thumbnail: 'https://assets.coingecko.com/markets/images/96/large/WeChat_Image_20220117220452.png?1706864283',
  },
  {
    exchange_name: 'HYPERLIQUID',
    exchange_thumbnail: 'https://assets.coingecko.com/markets/images/1571/large/PFP.png?1714470912',
  },
  {
    exchange_name: 'TOKOCRYPTO',
    exchange_thumbnail: 'https://assets.coingecko.com/markets/images/501/large/toko.png?1706864476',
  },
  {
    exchange_name: 'BITGET',
    exchange_thumbnail: 'https://assets.coingecko.com/markets/images/540/large/2023-07-25_21.47.43.jpg?1706864507',
  },
  {
    exchange_name: 'MEXC',
    exchange_thumbnail: 'https://assets.coingecko.com/markets/images/409/large/logo_new.png?1743600043',
  },
  {
    exchange_name: 'BITMART',
    exchange_thumbnail: 'https://assets.coingecko.com/markets/images/239/large/Bitmart.png?1706864341',
  },
];

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
  const [copied, setCopied] = useState(false)

  const WHITELIST_IPS = '151.101.66.15,151.101.66.15'

  const handleCopyIp = async () => {
    await navigator.clipboard.writeText(WHITELIST_IPS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
        exchange: exchange.toLowerCase() as any,
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
  const isBitget = exchange === 'BITGET'
  const isBitmart = exchange === 'BITMART'
  const requiresPassphrase = isOKX || isBitget || isBitmart

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={loading ? undefined : onClose}
    >
      <ToastContainer />
      <div
        className="relative w-full max-w-xl rounded-xl p-6 flex flex-col gap-5 overflow-y-auto max-h-[90vh]"
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

        {/* Whitelist IP Note */}
        <div
          className="flex flex-col gap-2 rounded-lg px-3 py-2.5 text-xs"
          style={{
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-secondary">Whitelist these IPs when creating your API key</span>
              <span className="text-primary font-mono text-sm">{WHITELIST_IPS}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyIp}
              className="ml-3 p-1.5 rounded-md transition-colors hover:bg-white/5"
              title="Copy IPs"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-secondary" />}
            </button>
          </div>
        </div>

        {/* Exchange Selection - List Layout */}
        <div className="flex flex-col gap-2">
          <label className="text-secondary text-xs uppercase tracking-wide">Select Exchange</label>
          <div className="grid grid-cols-2 gap-2">
            {exchanges.map((ex) => {
              const isSelected = exchange === ex.exchange_name;
              return (
                <button
                  key={ex.exchange_name}
                  type="button"
                  onClick={() => setExchange(ex.exchange_name)}
                  className={`
                    relative flex items-center gap-3 p-3 rounded-lg border-2 transition-all
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-transparent hover:border-white/20 hover:bg-white/5'
                    }
                  `}
                  style={{
                    backgroundColor: isSelected ? undefined : 'var(--color-bg-page)',
                  }}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
                  )}
                  
                  {/* Logo */}
                  <div className="w-10 h-10 rounded-md flex items-center justify-center overflow-hidden bg-white/5">
                    <img
                      src={ex.exchange_thumbnail}
                      alt={ex.exchange_name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Name */}
                  <span className={`text-sm font-medium ${isSelected ? 'text-blue-400' : 'text-primary'}`}>
                    {ex.exchange_name.charAt(0) + ex.exchange_name.slice(1).toLowerCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* API Permissions Note */}
        {exchange === 'GATE' && (
          <div
            className="flex flex-col gap-1.5 rounded-lg px-3 py-2.5 text-xs"
            style={{
              backgroundColor: 'rgba(234, 179, 8, 0.08)',
              border: '1px solid rgba(234, 179, 8, 0.2)',
            }}
          >
            <span className="text-secondary">Required API permissions for Gate</span>
            <ul className="text-primary text-xs list-disc list-inside flex flex-col gap-0.5">
              <li>Spot/Margin — Read & Write</li>
              <li>Account — Read</li>
              <li>Perpetual Contract — Read & Write</li>
            </ul>
          </div>
        )}
        {exchange === 'OKX' && (
          <div
            className="flex flex-col gap-1.5 rounded-lg px-3 py-2.5 text-xs"
            style={{
              backgroundColor: 'rgba(234, 179, 8, 0.08)',
              border: '1px solid rgba(234, 179, 8, 0.2)',
            }}
          >
            <span className="text-secondary">Required API permissions for OKX</span>
            <ul className="text-primary text-xs list-disc list-inside">
              <li>Trade — must be enabled</li>
            </ul>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.15s' }}>
          {/* API Key */}
          <div className="flex flex-col gap-1.5">
            <label className="text-secondary text-xs uppercase tracking wide">API Key</label>
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

          {/* Passphrase — OKX, Bitget, BitMart only */}
          {requiresPassphrase && (
            <div className="flex flex-col gap-1.5">
              <label className="text-secondary text-xs uppercase tracking-wide">
                {isBitmart ? 'API Memo (UID)' : isBitget ? 'API Password' : 'API Passphrase'}
              </label>
              <input
                required
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder={isBitmart ? 'Enter API memo/uid' : isBitget ? 'Enter API password' : 'Enter API passphrase'}
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
          <div className="flex gap-3 pt-2">
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