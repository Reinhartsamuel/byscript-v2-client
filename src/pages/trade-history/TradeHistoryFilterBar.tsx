import { ChevronDown } from 'lucide-react'

export interface TradeHistoryFilters {
  dateRange: string
  account: string
  market: string
  pair: string
  side: string
  status: string
}

interface Props {
  filters: TradeHistoryFilters
  onChange: (filters: TradeHistoryFilters) => void
  onApply: () => void
}

const DATE_RANGE_OPTIONS = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time']
const ACCOUNT_OPTIONS = ['All accounts', 'Account 1', 'Account 2', 'Account 3']
const MARKET_OPTIONS = ['Spot / Futures', 'Spot', 'Futures']
const PAIR_OPTIONS = ['All pairs', 'BTC_USDT', 'ETH_USDT', 'SOL_USDT']
const SIDE_OPTIONS = ['Buy / Sell · Long / Short', 'Buy', 'Sell', 'Long', 'Short']
const STATUS_OPTIONS = ['All', 'open', 'filled', 'cancelled', 'closed', 'failed']

function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-muted text-xs uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-primary text-xs bg-transparent pr-5 pb-1 border-b border-solid"
        style={{ borderColor: 'var(--color-border-subtle)', outline: 'none', appearance: 'none' }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ backgroundColor: '#22223a', color: '#f0f0f0' }}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute bottom-1.5 right-0 text-secondary pointer-events-none" />
    </div>
  )
}

export default function TradeHistoryFilterBar({ filters, onChange, onApply }: Props) {
  function set<K extends keyof TradeHistoryFilters>(key: K, value: TradeHistoryFilters[K]) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="card flex items-end gap-6 flex-wrap">
      <Dropdown label="Date Range" value={filters.dateRange} options={DATE_RANGE_OPTIONS} onChange={(v) => set('dateRange', v)} />
      <Dropdown label="Account" value={filters.account} options={ACCOUNT_OPTIONS} onChange={(v) => set('account', v)} />
      <Dropdown label="Market" value={filters.market} options={MARKET_OPTIONS} onChange={(v) => set('market', v)} />
      <Dropdown label="Pair" value={filters.pair} options={PAIR_OPTIONS} onChange={(v) => set('pair', v)} />
      <Dropdown label="Side" value={filters.side} options={SIDE_OPTIONS} onChange={(v) => set('side', v)} />
      <Dropdown label="Status" value={filters.status} options={STATUS_OPTIONS} onChange={(v) => set('status', v)} />

      <button
        onClick={onApply}
        className="ml-auto px-4 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'var(--color-accent-green-dim)', color: '#fff' }}
      >
        Filters
      </button>
    </div>
  )
}
