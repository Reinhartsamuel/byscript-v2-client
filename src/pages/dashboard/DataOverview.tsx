import type { DataOverviewData } from '@/pages/Dashboard'

function StatBlock({
  label,
  value,
  sub,
  valuePositive,
  subPositive,
  accent,
}: {
  label: string
  value: string
  sub: string
  valuePositive?: boolean
  subPositive?: boolean
  accent?: string
}) {
  return (
    <div style={{
      padding: '14px',
      borderRadius: '5px',
      backgroundColor: 'var(--color-bg-page)',
      border: '1px solid var(--color-border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Accent top line */}
      {accent && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          backgroundColor: accent,
          opacity: 0.5,
        }} />
      )}
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '0.6rem',
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '-0.02em',
        color: valuePositive ? 'var(--color-positive)' : 'var(--color-text-primary)',
        lineHeight: 1.1,
      }}>
        {value}
      </span>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '0.65rem',
        color: subPositive ? 'var(--color-positive)' : 'var(--color-text-muted)',
        marginTop: '1px',
      }}>
        {sub}
      </span>
    </div>
  )
}

export default function DataOverview({ data }: { data: DataOverviewData }) {
  return (
    <div className="card animate-fade-up" style={{ animationDelay: '0.05s' }}>
      <span className="label" style={{ display: 'block', marginBottom: '14px' }}>Data Overview</span>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <StatBlock
          label="Accounts"
          value={String(data.accounts_connected)}
          sub={`Active: ${data.active_accounts}`}
          accent="#3d9cf5"
        />
        <StatBlock
          label="Bots"
          value={String(data.autotraders.total)}
          sub={`Paused: ${data.autotraders.paused}`}
          accent="#a78bfa"
        />
        <StatBlock
          label="Trades"
          value={data.trades.toLocaleString()}
          sub={`Win rate: ${data.win_rate}%`}
          subPositive={data.win_rate > 0}
          accent="#00e5d1"
        />
        <StatBlock
          label="Total P/L"
          value={`$${data.total_pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          sub={`ROI: ${data.roi}%`}
          valuePositive={data.total_pnl > 0}
          subPositive={data.roi > 0}
          accent={data.total_pnl >= 0 ? '#00e5d1' : '#ff4d6a'}
        />
      </div>
    </div>
  )
}
