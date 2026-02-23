import { useNavigate } from 'react-router-dom'
import AutotradersStats from '@/pages/autotraders/AutotradersStats'
import AutotradersTable from '@/pages/autotraders/AutotradersTable'
import { AUTOTRADERS_LIST } from '@/data/mockData'

export default function Autotraders() {
  const navigate = useNavigate()

  return (
    <div className="flex gap-6">
      {/* Left column */}
      <div className="flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-primary text-lg font-semibold">Total Autotraders Performance</h2>
          <button
            onClick={() => navigate('/autotraders/new')}
            className="text-xs px-3 py-1 rounded-full transition-colors"
            style={{
              backgroundColor: 'transparent',
              color: '#4ade80',
              border: '1px solid #4ade80',
            }}
          >
            + Add Autotrader
          </button>
        </div>

        {/* Chart placeholder */}
        <div className="card">
          <p className="text-muted text-sm">No chart data</p>
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-2 text-xs py-3">
          <span className="text-muted uppercase tracking-wide">Autotraders</span>
          <span className="text-primary font-semibold">203</span>
          <span className="text-red">[0 / 203]</span>
          <span className="text-muted">|</span>
          <span className="text-muted uppercase tracking-wide">Capital Allocation:</span>
          <span className="text-primary font-semibold">$0</span>
        </div>

        {/* Table */}
        <AutotradersTable data={AUTOTRADERS_LIST} />
      </div>

      {/* Right column - Stats */}
      <div className="flex flex-col gap-4 w-64">
        <AutotradersStats />
      </div>
    </div>
  )
}
