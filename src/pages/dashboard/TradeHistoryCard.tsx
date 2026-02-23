import { Share2 } from 'lucide-react'
import type { TradeHistoryItem } from '@/pages/Dashboard'

const TICKER_DOT_COLORS = ['#4ade80', '#22d3ee', '#60a5fa', '#fb923c', '#a78bfa']

export default function TradeHistoryCard({ data }: { data: TradeHistoryItem[] }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-primary text-sm font-semibold">Trade History</h3>
        <span className="text-green text-xs cursor-pointer hover:underline">View All</span>
      </div>
      <p className="text-muted text-xs mb-4">Last executed &amp; failed trades</p>

      {data.length === 0 ? (
        <div className="flex items-center justify-center py-6">
          <span className="text-muted text-sm">No trades yet</span>
        </div>
      ) : (
        <>
          <div className="grid text-muted text-xs uppercase tracking-wider mb-2" style={{ gridTemplateColumns: '1fr auto auto auto auto' }}>
            <span>Action</span>
            <span className="text-right">Price</span>
            <span className="text-right">PnL</span>
            <span className="text-right">Time</span>
          </div>

          <div className="flex flex-col">
            {data.map((trade, i) => (
              <div
                key={trade.id}
                className="flex items-center justify-between py-2.5"
                style={{ borderTop: i > 0 ? '1px solid var(--color-border-subtle)' : 'none' }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: TICKER_DOT_COLORS[i % TICKER_DOT_COLORS.length] }}
                  />
                  <div>
                    <span className="text-primary text-sm font-medium">{trade.ticker}</span>
                    <p className="text-muted text-xs">{trade.exchange}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={trade.action === 'Buy' ? 'badge-green' : trade.action === 'Sell' ? 'badge-red' : 'badge-gray'}>
                    {trade.action}
                  </span>
                  <span className="text-primary text-xs w-12 text-right">${Math.abs(trade.pnl).toFixed(2)}</span>
                  <span className={`text-xs w-14 text-right ${trade.pnl_percent >= 0 ? 'text-green' : 'text-red'}`}>
                    {trade.pnl_percent >= 0 ? '+' : ''}
                    {trade.pnl_percent.toFixed(2)}%
                  </span>
                  <span className="text-muted text-xs w-12 text-right">{trade.time_ago}</span>
                  <button className="text-green text-xs flex items-center gap-1 hover:underline">
                    <Share2 size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
