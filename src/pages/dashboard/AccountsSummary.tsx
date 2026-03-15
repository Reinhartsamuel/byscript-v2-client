import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, DoughnutController, ArcElement, Tooltip } from 'chart.js'
import { useNavigate } from 'react-router-dom'
import type { AccountSummaryItem } from '@/pages/Dashboard'

ChartJS.register(DoughnutController, ArcElement, Tooltip)

const DOT_COLORS = ['#00e5d1', '#3d9cf5', '#a78bfa', '#fb923c', '#f43f5e', '#facc15']

export default function AccountsSummary({ data }: { data: AccountSummaryItem[] }) {
  const navigate = useNavigate()

  const accounts = data.map((a: any, i) => ({
    id: a.id ?? a.exchange_id ?? String(i),
    name: a.name ?? a.exchange_title ?? 'Unknown',
    value: Number(a.value ?? a.balance ?? 0),
    percentage: a.percentage ?? 0,
    color: a.color ?? DOT_COLORS[i % DOT_COLORS.length],
  }))

  if (accounts.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '32px 20px' }}>
        <span className="label">Accounts Summary</span>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          No accounts connected yet.
        </p>
        <button
          className="button-accent"
          onClick={() => navigate('/accounts', { state: { openAddAccount: true } })}
        >
          + ADD ACCOUNT
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
        borderColor: '#080c10',
        borderWidth: 3,
        hoverOffset: 4,
      },
    ],
  }

  const chartOptions: import('chart.js').ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0d1117',
        titleColor: '#5a7a99',
        bodyColor: '#e8edf3',
        borderColor: '#1a2332',
        borderWidth: 1,
        cornerRadius: 4,
        titleFont: { family: "'IBM Plex Mono', monospace", size: 11 },
        bodyFont: { family: "'IBM Plex Mono', monospace", size: 12 },
        callbacks: {
          label: (ctx) => ` $${ctx.parsed.toLocaleString('en-US')}`,
        },
      },
    },
  }

  return (
    <div className="card animate-fade-up" style={{ animationDelay: '0.05s' }}>
      <span className="label" style={{ display: 'block', marginBottom: '16px' }}>Accounts Summary</span>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        {/* Account list */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {accounts.map((account, i) => (
            <div key={account.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '8px', height: '8px',
                  borderRadius: '2px',
                  backgroundColor: account.color,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.73rem',
                  color: 'var(--color-text-secondary)',
                }}>
                  {account.name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.73rem',
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                }}>
                  ${account.value.toLocaleString()}
                </span>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.65rem',
                  color: 'var(--color-text-muted)',
                }}>
                  {account.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Donut */}
        <div style={{ width: '120px', height: '120px', flexShrink: 0, position: 'relative' }}>
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}
