import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import AutotradersStats from '@/pages/autotraders/AutotradersStats'
import AutotradersTable from '@/pages/autotraders/AutotradersTable'
import { getAutotraders } from '@/lib/api'

function useAutotraders() {
  return useQuery({
    queryKey: ['autotraders'],
    queryFn: getAutotraders,
    staleTime: 1000 * 60 * 5,
    select: (response) => {
      const rawData = response?.data || []
      return rawData.map((row: any) => ({
        id: String(row.id),
        status: row.status === 'active' ? 'Active' : 'Stopped',
        tradingPlan: row.trading_plan_name || '—',
        pair: row.pair || row.symbol,
        exchange: row.exchange_title || '—',
        capital: Number(row.current_balance) || 0,
        pnl: 0,
        winRate: 0,
        running: 0,
      }))
    },
  })
}

export default function Autotraders() {
  const navigate = useNavigate()
  const { data: autotraders = [], isLoading, isError, error } = useAutotraders()

  const totalCapital = autotraders.reduce((sum: number, a: any) => sum + a.capital, 0)
  const activeCount = autotraders.filter((a: any) => a.status === 'Active').length
  const stoppedCount = autotraders.length - activeCount

  if (isLoading) return <div className="p-8 text-center text-muted">Loading autotraders...</div>
  if (isError) return <div className="p-8 text-red">Error: {(error as Error).message}</div>

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
          <span className="text-primary font-semibold">{autotraders.length}</span>
          <span className="text-red">[{activeCount} / {stoppedCount}]</span>
          <span className="text-muted">|</span>
          <span className="text-muted uppercase tracking-wide">Capital Allocation:</span>
          <span className="text-primary font-semibold">${totalCapital.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        {/* Table */}
        <AutotradersTable data={autotraders} />
      </div>

      {/* Right column - Stats */}
      <div className="flex flex-col gap-4 w-64">
        <AutotradersStats />
      </div>
    </div>
  )
}
