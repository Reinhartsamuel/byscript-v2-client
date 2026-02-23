import { useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, DoughnutController, ArcElement, Tooltip } from 'chart.js'
import { ACCOUNTS_PAGE_DISTRIBUTION } from '@/data/mockData'

ChartJS.register(DoughnutController, ArcElement, Tooltip)

const DISTRIBUTION_COLORS = ['#4ade80', '#22d3ee', '#06b6d4', '#60a5fa', '#818cf8', '#a78bfa', '#facc15', '#fb923c', '#f472b6']

export default function AccountsDistribution() {
  const [view, setView] = useState<'chart' | 'list'>('chart')

  const chartData = {
    labels: ACCOUNTS_PAGE_DISTRIBUTION.map((a) => a.name),
    datasets: [
      {
        data: ACCOUNTS_PAGE_DISTRIBUTION.map((a) => a.value),
        backgroundColor: DISTRIBUTION_COLORS,
        borderColor: '#1a1a2e',
        borderWidth: 3,
        hoverOffset: 4,
      },
    ],
  }

  const chartOptions: import('chart.js').ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-primary text-sm font-semibold">Accounts Distribution</h3>
        <div className="flex gap-3">
          <button
            onClick={() => setView('chart')}
            className={`text-xs cursor-pointer transition-colors ${
              view === 'chart' ? 'text-primary' : 'text-muted hover:text-secondary'
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setView('list')}
            className={`text-xs cursor-pointer transition-colors ${
              view === 'list' ? 'text-primary' : 'text-muted hover:text-secondary'
            }`}
          >
            Accounts
          </button>
        </div>
      </div>

      {view === 'chart' ? (
        <div className="flex gap-4">
          <div style={{ width: '180px', height: '180px', flexShrink: 0 }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>

          <div className="flex-1 flex flex-col gap-2">
            {ACCOUNTS_PAGE_DISTRIBUTION.map((item, i) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: DISTRIBUTION_COLORS[i] }} />
                  <span className="text-secondary text-xs">{item.name}</span>
                  {item.name === 'Others' && <span className="text-muted text-xs">83.2%</span>}
                </div>
                <span className="text-primary text-xs font-medium">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {ACCOUNTS_PAGE_DISTRIBUTION.map((item, i) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: DISTRIBUTION_COLORS[i] }} />
                <span className="text-secondary text-xs">{item.name}</span>
              </div>
              <span className="text-primary text-xs font-medium">${item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
