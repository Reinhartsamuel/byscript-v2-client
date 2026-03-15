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
        borderColor: '#00e5d1',
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
    <div style={{ height: '36px', width: '70px' }}>
      <Line data={chartData} options={options} />
    </div>
  )
}

function getInitials(name: string) {
  if (!name) return '??'
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const RANK_COLORS = ['#00e5d1', '#3d9cf5', '#a78bfa']

export default function TopAutotraders({ data }: { data: TopAutotraderItem[] }) {
  const navigate = useNavigate()

  return (
    <div className="card animate-fade-up" style={{ animationDelay: '0.1s' }}>
      <span className="label" style={{ display: 'block', marginBottom: '16px' }}>Top Autotraders</span>

      {data.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 0' }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
          }}>
            — no autotraders yet —
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '12px' }}>
          {data.map((at, idx) => (
            <div
              key={at.id}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '14px',
                borderRadius: '6px',
                backgroundColor: 'var(--color-bg-page)',
                border: '1px solid var(--color-border-subtle)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.15s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,229,209,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border-subtle)')}
              onClick={() => navigate(`/autotraders/${at.id}`)}
            >
              {/* Rank indicator */}
              <span style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: '1.1rem',
                color: RANK_COLORS[idx] ?? 'var(--color-text-muted)',
                opacity: 0.3,
                lineHeight: 1,
              }}>
                #{idx + 1}
              </span>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px',
                  borderRadius: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: 'var(--color-accent-bg-strong)',
                  border: `1px solid ${RANK_COLORS[idx] ?? 'var(--color-border-subtle)'}33`,
                  color: RANK_COLORS[idx] ?? 'var(--color-accent)',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  letterSpacing: '0.05em',
                  flexShrink: 0,
                }}>
                  {getInitials(at.name)}
                </div>
                <span style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  color: 'var(--color-text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}>
                  {at.name}
                </span>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>
                    <span className="label" style={{ fontSize: '0.6rem' }}>Pair</span>
                    <p style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.72rem',
                      color: 'var(--color-text-primary)',
                      margin: '2px 0 0',
                    }}>
                      {at.pair}
                    </p>
                  </div>
                  <div>
                    <span className="label" style={{ fontSize: '0.6rem' }}>Win Rate</span>
                    <p style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.72rem',
                      color: 'var(--color-positive)',
                      margin: '2px 0 0',
                    }}>
                      {at.win_rate}%
                    </p>
                  </div>
                  <div>
                    <span className="label" style={{ fontSize: '0.6rem' }}>Trades</span>
                    <p style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.72rem',
                      color: 'var(--color-text-secondary)',
                      margin: '2px 0 0',
                    }}>
                      {at.trades}
                    </p>
                  </div>
                </div>

                {at.mini_chart && at.mini_chart.length > 0 && (
                  <MiniChart data={at.mini_chart} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
