import { useState, useEffect } from 'react'

export interface Trade {
  id: number
  exchange: string
  market_type: string
  contract: string
  position_type: string
  price: string | null
  size: string
  pnl: string | null
  status: string
  autotrader_name: string
  account_name: string
  open_filled_at: number | null
  created_at: string
}

interface Props {
  data: Trade[]
  loading?: boolean
}

const COLS = [
  { label: 'Time', flex: '1.2fr' },
  { label: 'Exchange', flex: '1fr' },
  { label: 'Market', flex: '0.8fr' },
  { label: 'Pair', flex: '1fr' },
  { label: 'Action', flex: '0.8fr' },
  { label: 'Price', flex: '1fr' },
  { label: 'Quantity', flex: '1fr' },
  { label: 'PnL', flex: '1fr' },
  { label: 'Status', flex: '0.9fr' },
  { label: 'Trading Plan', flex: '1.2fr' },
  { label: 'Account', flex: '1fr' },
]

const GRID = COLS.map((c) => c.flex).join(' ')

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  if (s === 'open' || s === 'filled' || s === 'closed') {
    return <span className="badge-green">{status}</span>
  }
  if (s === 'failed' || s === 'cancelled') {
    return <span className="badge-red">{status}</span>
  }
  return <span className="badge-gray">{status}</span>
}

function formatTime(trade: Trade) {
  const ts = trade.open_filled_at
    ? new Date(trade.open_filled_at * 1000)
    : new Date(trade.created_at)
  return ts.toLocaleString('en-US', {
    month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

function formatPnl(pnl: string | null) {
  if (pnl === null || pnl === undefined) return <span className="text-muted text-xs">—</span>
  const n = parseFloat(pnl)
  const sign = n >= 0 ? '+' : ''
  return (
    <span className={`text-xs font-medium ${n >= 0 ? 'text-green' : 'text-red'}`}>
      {sign}{n.toFixed(2)}
    </span>
  )
}

export default function TradeHistoryTable({ data, loading }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => { setCurrentPage(1) }, [data])

  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage))
  const paginated = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  return (
    <div className="card overflow-x-auto">
      {/* Header */}
      <div
        className="grid text-muted text-xs uppercase tracking-wider pb-2 min-w-max w-full"
        style={{ gridTemplateColumns: GRID, borderBottom: '1px solid var(--color-border-subtle)' }}
      >
        {COLS.map((c) => (
          <span key={c.label}>{c.label}</span>
        ))}
      </div>

      {/* Rows */}
      {loading ? (
        <p className="text-secondary text-sm py-8 text-center">Loading...</p>
      ) : paginated.length === 0 ? (
        <p className="text-secondary text-sm py-8 text-center">No trades match these filters.</p>
      ) : (
        <div className="flex flex-col min-w-max w-full">
          {paginated.map((trade, i) => (
            <div
              key={trade.id}
              className="grid py-3 items-center"
              style={{
                gridTemplateColumns: GRID,
                borderTop: i > 0 ? '1px solid var(--color-border-subtle)' : 'none',
              }}
            >
              {/* Time */}
              <span className="text-secondary text-xs">{formatTime(trade)}</span>

              {/* Exchange */}
              <span className="text-primary text-xs font-medium">{trade.exchange}</span>

              {/* Market */}
              <span className="text-secondary text-xs capitalize">{trade.market_type}</span>

              {/* Pair */}
              <span className="text-primary text-xs font-medium">{trade.contract.replace('_', '/')}</span>

              {/* Action (position type) */}
              <span
                className={`text-xs font-semibold capitalize ${trade.position_type === 'long' ? 'text-green' : 'text-red'}`}
              >
                {trade.position_type}
              </span>

              {/* Price */}
              <span className="text-primary text-xs">
                {trade.price ? parseFloat(trade.price).toLocaleString() : '—'}
              </span>

              {/* Quantity */}
              <span className="text-primary text-xs">{parseFloat(trade.size).toFixed(4)}</span>

              {/* PnL */}
              {formatPnl(trade.pnl)}

              {/* Status */}
              <StatusBadge status={trade.status} />

              {/* Trading Plan (autotrader) */}
              <span className="text-secondary text-xs truncate pr-2">{trade.autotrader_name}</span>

              {/* Account */}
              <span className="text-secondary text-xs truncate">{trade.account_name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div
        className="flex items-center justify-between mt-4 pt-4"
        style={{ borderTop: '1px solid var(--color-border-subtle)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-muted text-xs">Rows per page</span>
          <select
            value={rowsPerPage}
            onChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setCurrentPage(1) }}
            className="text-primary text-xs bg-transparent border-b border-solid px-1"
            style={{ borderColor: 'var(--color-border-subtle)', outline: 'none' }}
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n} style={{ backgroundColor: '#22223a', color: '#f0f0f0' }}>{n}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors"
              style={{
                backgroundColor: page === currentPage ? 'var(--color-accent-green-bg)' : 'transparent',
                color: page === currentPage ? 'var(--color-accent-green)' : 'var(--color-text-secondary)',
                border: page === currentPage ? 'none' : '1px solid var(--color-border-subtle)',
              }}
            >
              {page}
            </button>
          ))}
          {currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="text-secondary text-xs ml-1 hover:text-primary transition-colors"
            >
              {'>'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
