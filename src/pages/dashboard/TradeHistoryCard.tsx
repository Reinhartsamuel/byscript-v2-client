import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { TradeHistoryItem } from '@/pages/Dashboard'

const DOT_COLORS = ['#00e5d1', '#3d9cf5', '#a78bfa', '#fb923c', '#f43f5e']

export default function TradeHistoryCard({ data }: { data: TradeHistoryItem[] }) {
  const navigate = useNavigate()

  return (
    <div className="card animate-fade-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span className="label">Trade History</span>
        <button
          onClick={() => navigate('/trade-history')}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.65rem',
            color: 'var(--color-accent)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.04em',
            transition: 'opacity 0.15s',
            padding: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          VIEW ALL →
        </button>
      </div>

      <p style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '0.65rem',
        color: 'var(--color-text-muted)',
        marginBottom: '16px',
      }}>
        Recent executions
      </p>

      {data.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 0' }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
          }}>
            — no trades yet —
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 52px 60px 40px',
            gap: '8px',
            paddingBottom: '8px',
            borderBottom: '1px solid var(--color-border-subtle)',
            marginBottom: '4px',
          }}>
            {['Asset', 'P&L', '%', 'Age'].map((h) => (
              <span key={h} style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.6rem',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textAlign: h === 'Asset' ? 'left' : 'right',
              }}>
                {h}
              </span>
            ))}
          </div>

          {data.map((trade, i) => {
            const positive = (trade.pnl_percent ?? 0) >= 0
            return (
              <div
                key={trade.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 52px 60px 40px',
                  gap: '8px',
                  alignItems: 'center',
                  padding: '9px 0',
                  borderBottom: i < data.length - 1 ? '1px solid rgba(26,35,50,0.6)' : 'none',
                  transition: 'background 0.1s',
                }}
              >
                {/* Asset */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <span style={{
                    width: '6px', height: '6px',
                    borderRadius: '1px',
                    backgroundColor: DOT_COLORS[i % DOT_COLORS.length],
                    flexShrink: 0,
                  }} />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '0.73rem',
                        fontWeight: 500,
                        color: 'var(--color-text-primary)',
                      }}>
                        {trade.ticker}
                      </span>
                      <span className={trade.action === 'Buy' ? 'badge-green' : trade.action === 'Sell' ? 'badge-red' : 'badge-gray'}>
                        {trade.action}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.6rem',
                      color: 'var(--color-text-muted)',
                      display: 'block',
                      marginTop: '1px',
                    }}>
                      {trade.exchange}
                    </span>
                  </div>
                </div>

                {/* P&L */}
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.7rem',
                  color: 'var(--color-text-primary)',
                  textAlign: 'right',
                }}>
                  ${Math.abs(trade.pnl ?? 0).toFixed(2)}
                </span>

                {/* % */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
                  {positive
                    ? <ArrowUpRight size={10} style={{ color: 'var(--color-positive)', flexShrink: 0 }} />
                    : <ArrowDownRight size={10} style={{ color: 'var(--color-negative)', flexShrink: 0 }} />
                  }
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.7rem',
                    color: positive ? 'var(--color-positive)' : 'var(--color-negative)',
                  }}>
                    {Math.abs(trade.pnl_percent ?? 0).toFixed(2)}%
                  </span>
                </div>

                {/* Time */}
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.6rem',
                  color: 'var(--color-text-muted)',
                  textAlign: 'right',
                }}>
                  {trade.time_ago}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
