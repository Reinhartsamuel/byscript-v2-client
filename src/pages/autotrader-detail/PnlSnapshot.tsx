import { AutotraderDetailData } from '@/data/mockData'

interface PnlSnapshotProps {
  data: AutotraderDetailData
}

function pnlColor(value: number) {
  return value >= 0 ? 'text-green' : 'text-red'
}

function pnlPrefix(value: number) {
  return value >= 0 ? '+$' : '-$'
}

function formatPnl(value: number) {
  return `${pnlPrefix(value)}${Math.abs(value).toLocaleString()}`
}

export default function PnlSnapshot({ data }: PnlSnapshotProps) {
  return (
    <div className="card">
      <div className="flex gap-4">
        {/* Total P&L */}
        <div className="flex-1">
          <p className="text-muted text-xs uppercase tracking-wide mb-2">Total P&L</p>
          <p className={`text-2xl font-bold ${pnlColor(data.totalPnl)}`}>{formatPnl(data.totalPnl)}</p>
        </div>

        {/* 7D */}
        <div className="flex-1">
          <p className="text-muted text-xs uppercase tracking-wide mb-2">7D</p>
          <p className={`text-xl font-bold ${pnlColor(data.pnl7D)}`}>{formatPnl(data.pnl7D)}</p>
        </div>

        {/* 30D */}
        <div className="flex-1">
          <p className="text-muted text-xs uppercase tracking-wide mb-2">30D</p>
          <p className={`text-xl font-bold ${pnlColor(data.pnl30D)}`}>{formatPnl(data.pnl30D)}</p>
        </div>

        {/* 90D */}
        <div className="flex-1">
          <p className="text-muted text-xs uppercase tracking-wide mb-2">90D</p>
          <p className={`text-xl font-bold ${pnlColor(data.pnl90D)}`}>{formatPnl(data.pnl90D)}</p>
        </div>
      </div>
    </div>
  )
}
