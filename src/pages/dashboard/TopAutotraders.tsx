import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js'
import { useNavigate } from 'react-router-dom'
import type { TopAutotraderItem } from '@/pages/Dashboard'

ChartJS.register(LineController, LineElement, PointElement, LinearScale, CategoryScale)

function MiniChart({ data }: { data: number[] }) {
  const chartData = {
    labels: data.map((_, i) => String(i)),
    datasets: [
      {
        data,
        borderColor: '#4ade80',
        borderWidth: 1.5,
        backgroundColor: 'transparent',
        pointRadius: 0,
        tension: 0.3,
      },
    ],
  }
  const options: import('chart.js').ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
  }
  return (
    <div style={{ height: '40px' }}>
      <Line data={chartData} options={options} />
    </div>
  )
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function TopAutotraders({ data }: { data: TopAutotraderItem[] }) {
  const navigate = useNavigate()

  return (
    <div className="card">
      <h3 className="text-primary text-sm font-semibold mb-4">Top Autotraders</h3>

      {data.length === 0 ? (
        <div className="flex items-center justify-center py-6">
          <span className="text-muted text-sm">No autotraders yet</span>
        </div>
      ) : (
        <div className="flex gap-4">
          {data.map((at) => (
            <div
              key={at.id}
              className="flex-1 flex flex-col gap-3 p-4 rounded-lg"
              style={{ backgroundColor: 'var(--color-bg-card-hover)', border: '1px solid var(--color-border-subtle)' }}
            >
              <div className="flex items-start gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: '#4ade80' }}
                >
                  {getInitials(at.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-sm font-semibold truncate">{at.name}</span>
                    <span
                      className="text-green text-xs font-semibold shrink-0 px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(74, 222, 128, 0.15)' }}
                    >
                      {at.win_rate}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row w-full justify-around gap-2">
                <div className="w-1/3 flex flex-col gap-1">
                  <span className="text-secondary text-xs">{at.pair}</span>
                  <span className="text-muted text-xs">Trades: {at.trades}</span>
                </div>
                <div className="w-1/3" />
                <div className="w-1/3">
                  {at.mini_chart && at.mini_chart.length > 0 && <MiniChart data={at.mini_chart} />}
                </div>
              </div>

              <button className="button" onClick={() => navigate(`/autotraders/${at.id}`)}>
                View Autotrader
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
