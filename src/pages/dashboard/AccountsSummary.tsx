import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, DoughnutController, ArcElement, Tooltip } from 'chart.js'
import { useNavigate } from 'react-router-dom'
import type { AccountSummaryItem } from '@/pages/Dashboard'

ChartJS.register(DoughnutController, ArcElement, Tooltip)

const DOT_COLORS = ['#4ade80', '#22d3ee', '#60a5fa', '#fb923c', '#a78bfa', '#facc15']

export default function AccountsSummary({ data }: { data: AccountSummaryItem[] }) {
  const navigate = useNavigate()

  const accounts = data.map((a, i) => ({
    ...a,
    color: a.color ?? DOT_COLORS[i % DOT_COLORS.length],
  }))

  if (accounts.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center gap-4 py-8">
        <h3 className="text-primary text-sm font-semibold">Accounts Summary</h3>
        <p className="text-muted text-sm text-center">You have no accounts connected yet.</p>
        <button
          className="button"
          onClick={() => navigate('/accounts', { state: { openAddAccount: true } })}
        >
          Add Account
        </button>
      </div>
    )
  }

  const chartData = {
    labels: accounts.map((a) => a.name),
    datasets: [
      {
        data: accounts.map((a) => a.value),
        backgroundColor: accounts.map((a) => a.color),
        borderColor: '#1a1a2e',
        borderWidth: 3,
        hoverOffset: 4,
      },
    ],
  }

  const chartOptions: import('chart.js').ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#22223a',
        titleColor: '#8888a0',
        bodyColor: '#f0f0f0',
        borderColor: '#2e2e45',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` $${ctx.parsed.toLocaleString('en-US')}`,
        },
      },
    },
  }

  return (
    <div className="card">
      <h3 className="text-primary text-sm font-semibold mb-4">Accounts Summary</h3>

      <div className="flex gap-6">
        <div className="flex-1 flex flex-col gap-2.5">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: account.color }} />
                <span className="text-secondary text-sm">{account.name}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-primary text-sm font-medium">${account.value.toLocaleString()}</span>
                <span className="text-secondary text-xs">{account.percentage}%</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ width: '140px', height: '160px', flexShrink: 0 }}>
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}
