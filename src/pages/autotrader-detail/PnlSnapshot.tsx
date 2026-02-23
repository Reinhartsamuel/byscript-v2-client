import { AutotraderDetailData } from '@/data/mockData'

interface PnlSnapshotProps {
  data: AutotraderDetailData
}

export default function PnlSnapshot({ data }: PnlSnapshotProps) {
  return (
    <div className="card">
      <div className="flex gap-4">
        {/* Total P&L */}
        <div className="flex-1">
          <p className="text-muted text-xs uppercase tracking-wide mb-2">Total P&L</p>
          <p className="text-primary text-2xl font-bold">${data.totalPnl.toLocaleString()}</p>
        </div>

        {/* 7D */}
        <div className="flex-1">
          <p className="text-muted text-xs uppercase tracking-wide mb-2">7D</p>
          <p className="text-primary text-xl font-bold">${data.pnl7D.toLocaleString()}</p>
        </div>

        {/* 30D */}
        <div className="flex-1">
          <p className="text-muted text-xs uppercase tracking-wide mb-2">30D</p>
          <p className="text-green text-xl font-bold">+${data.pnl30D.toLocaleString()}</p>
        </div>

        {/* 90D */}
        <div className="flex-1">
          <p className="text-muted text-xs uppercase tracking-wide mb-2">90D</p>
          <p className="text-green text-xl font-bold">+${data.pnl90D.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
