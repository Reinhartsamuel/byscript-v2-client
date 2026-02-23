import { AutotraderDetailData } from '@/data/mockData'

interface TradeSetupProps {
  data: AutotraderDetailData
}

export default function TradeSetup({ data }: TradeSetupProps) {
  const stats = [
    { label: 'Total Profit', value: `$${data.totalProfit.toLocaleString()}`, isGreen: true },
    { label: 'Total Loss', value: `$${data.totalLoss.toLocaleString()}`, isGreen: false },
    { label: 'Total Trades', value: data.totalTrades.toString(), isGreen: false },
    { label: 'Win Rate', value: `${data.winRate}%`, isGreen: false },
    { label: 'Winning Positions', value: data.winningPositions.toString(), isGreen: false },
    { label: 'Pending Orders', value: data.pendingOrders.toString(), isGreen: false },
    { label: 'Profit Factor', value: data.profitFactor.toFixed(1), isGreen: false },
    { label: 'Risk / Reward', value: data.riskReward, isGreen: false },
    { label: 'Max Capital Used', value: `$${data.maxCapitalUsed.toLocaleString()}`, isGreen: false },
    { label: 'Max Concurrent Positions', value: data.maxConcurrentPositions.toString(), isGreen: false },
  ]

  return (
    <div className="card">
      <p className="text-muted text-xs uppercase tracking-wide mb-4">Trade Setup</p>

      <div className="flex flex-col gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center justify-between">
            <p className="text-muted text-xs">{stat.label}</p>
            <p className={`text-sm font-medium ${stat.isGreen ? 'text-green' : 'text-primary'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
