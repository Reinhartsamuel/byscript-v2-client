import { ChevronDown } from 'lucide-react'

interface FilterBarProps {
  search: string
  onSearchChange: (val: string) => void
  market: string
  onMarketChange: (val: string) => void
  provider: string
  onProviderChange: (val: string) => void
  autotrader: string
  onAutotraderChange: (val: string) => void
  onClear: () => void
  onAddAccount?: () => void
}

const MARKET_OPTIONS = ['All', 'Futures', 'Spot', 'Web3']
const PROVIDER_OPTIONS = ['All', 'hypercloud', 'Green', 'CEX', 'hydr']
const AUTOTRADER_OPTIONS = ['All', 'KeltnerDash', 'PivotTurbo', 'IchimokuCore']

export default function FilterBar({
  search,
  onSearchChange,
  market,
  onMarketChange,
  provider,
  onProviderChange,
  autotrader,
  onAutotraderChange,
  onClear,
  onAddAccount,
}: FilterBarProps) {
  return (
    <div className="card flex items-end gap-6">
      {/* Search */}
      <div className="flex flex-col gap-2">
        <label className="text-muted text-xs uppercase tracking-wide">Search</label>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search account here"
          className="text-primary text-sm bg-transparent border-b border-solid"
          style={{ borderColor: 'var(--color-border-subtle)', outline: 'none' }}
        />
      </div>

      {/* Market dropdown */}
      <div className="flex flex-col gap-2 relative">
        <label className="text-muted text-xs uppercase tracking-wide">Market</label>
        <select
          value={market}
          onChange={(e) => onMarketChange(e.target.value)}
          className="text-primary text-sm bg-transparent border-b border-solid pr-6"
          style={{ borderColor: 'var(--color-border-subtle)', outline: 'none', appearance: 'none' }}
        >
          {MARKET_OPTIONS.map((opt) => (
            <option key={opt} value={opt} style={{ backgroundColor: '#22223a', color: '#f0f0f0' }}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute bottom-1 right-0 text-secondary pointer-events-none" />
      </div>

      {/* Provider dropdown */}
      <div className="flex flex-col gap-2 relative">
        <label className="text-muted text-xs uppercase tracking-wide">Provider</label>
        <select
          value={provider}
          onChange={(e) => onProviderChange(e.target.value)}
          className="text-primary text-sm bg-transparent border-b border-solid pr-6"
          style={{ borderColor: 'var(--color-border-subtle)', outline: 'none', appearance: 'none' }}
        >
          {PROVIDER_OPTIONS.map((opt) => (
            <option key={opt} value={opt} style={{ backgroundColor: '#22223a', color: '#f0f0f0' }}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute bottom-1 right-0 text-secondary pointer-events-none" />
      </div>

      {/* Autotrader dropdown */}
      <div className="flex flex-col gap-2 relative">
        <label className="text-muted text-xs uppercase tracking-wide">Autotrader</label>
        <select
          value={autotrader}
          onChange={(e) => onAutotraderChange(e.target.value)}
          className="text-primary text-sm bg-transparent border-b border-solid pr-6"
          style={{ borderColor: 'var(--color-border-subtle)', outline: 'none', appearance: 'none' }}
        >
          {AUTOTRADER_OPTIONS.map((opt) => (
            <option key={opt} value={opt} style={{ backgroundColor: '#22223a', color: '#f0f0f0' }}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute bottom-1 right-0 text-secondary pointer-events-none" />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Clear button */}
        <button onClick={onClear} className="text-muted text-xs cursor-pointer hover:text-secondary transition-colors">
          Clear
        </button>
        {onAddAccount && (
          <button onClick={onAddAccount} className="button text-xs">
            Add Account
          </button>
        )}
      </div>
    </div>
  )
}
