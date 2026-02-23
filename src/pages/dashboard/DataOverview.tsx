import type { DataOverviewData } from '@/pages/Dashboard'

function StatBlock({
  label,
  value,
  sub,
  valueGreen,
  subGreen,
}: {
  label: string
  value: string
  sub: string
  valueGreen?: boolean
  subGreen?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted text-xs uppercase tracking-wider">{label}</span>
      <span className={`text-xl font-bold ${valueGreen ? 'text-green' : 'text-primary'}`}>{value}</span>
      <span className={`text-xs ${subGreen ? 'text-green' : 'text-secondary'}`}>{sub}</span>
    </div>
  )
}

export default function DataOverview({ data }: { data: DataOverviewData }) {
  return (
    <div className="card">
      <h3 className="text-primary text-sm font-semibold mb-4">Data Overview</h3>

      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <StatBlock
          label="Accounts Connected"
          value={String(data.accounts_connected)}
          sub={`Active: ${data.active_accounts}, Stopped: ${data.autotraders.stopped}`}
        />
        <StatBlock
          label="Autotraders"
          value={String(data.autotraders.total)}
          sub={`Paused on the spot: ${data.autotraders.paused}`}
        />
        <StatBlock
          label="Trades"
          value={data.trades.toLocaleString()}
          sub={`Win rate: ${data.win_rate}%`}
          subGreen={data.win_rate > 0}
        />
        <StatBlock
          label="Total P/L"
          value={`$${data.total_pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          sub={`ROI: ${data.roi}%`}
          valueGreen={data.total_pnl > 0}
          subGreen={data.roi > 0}
        />
      </div>
    </div>
  )
}
