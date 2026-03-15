import { useState, useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from 'chart.js'
import type { EquitySummaryData } from '@/pages/Dashboard'

ChartJS.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip)

const TIME_TABS = ['7D', '30D', '90D', 'ALL'] as const
type TimeTab = typeof TIME_TABS[number]

export default function EquitySummary({ data }: { data: EquitySummaryData }) {
  const [activeTab, setActiveTab] = useState<TimeTab>('7D')

  const chartSource = data?.chart ?? []

  const peakIndex = useMemo(() => {
    let max = -Infinity, idx = 0
    chartSource.forEach((d, i) => {
      if (d.value > max) { max = d.value; idx = i }
    })
    return idx
  }, [chartSource])

  const chartData = {
    labels: chartSource.map((d) => d.label),
    datasets: [
      {
        label: 'Equity',
        data: chartSource.map((d) => d.value),
        borderColor: '#00e5d1',
        borderWidth: 1.5,
        backgroundColor: 'transparent',
        pointRadius: 0,
        pointHoverRadius: 3,
        tension: 0,
      },
    ],
  }

  const chartOptions: import('chart.js').ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0d1117',
        titleColor: '#5a7a99',
        bodyColor: '#e8edf3',
        borderColor: '#1a2332',
        borderWidth: 1,
        cornerRadius: 4,
        displayColors: false,
        titleFont: { family: "'IBM Plex Mono', monospace", size: 11 },
        bodyFont: { family: "'IBM Plex Mono', monospace", size: 12 },
        callbacks: {
          label: (ctx) => `$${(ctx.parsed.y as number).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#2e4a66',
          font: { size: 10, family: "'IBM Plex Mono', monospace" },
          maxTicksLimit: 4,
        },
        border: { display: false },
      },
      y: {
        grid: { display: true, color: 'rgba(26,35,50,0.8)' },
        ticks: { display: false },
        border: { display: false },
      },
    },
  }

  const peakLabelPlugin = useMemo(
    () => ({
      id: 'peakLabel',
      afterDraw(chart: ChartJS) {
        const { ctx, chartArea } = chart
        if (!chartArea || chartSource.length === 0) return
        const meta = chart.getDatasetMeta(0)
        const point = meta.data[peakIndex]
        if (!point) return
        const x = point.x
        const y = point.y
        const label = `$${chartSource[peakIndex].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        ctx.save()
        // Glow circle
        ctx.shadowColor = '#00e5d1'
        ctx.shadowBlur = 8
        ctx.fillStyle = '#00e5d1'
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        // Label
        ctx.fillStyle = '#00e5d1'
        ctx.font = "10px 'IBM Plex Mono', monospace"
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        ctx.fillText(label, x, y - 8)
        ctx.restore()
      },
    }),
    [peakIndex, chartSource]
  )

  const balance = data?.total_balance ?? 0

  return (
    <div className="card animate-fade-up">
      <div className="flex items-start justify-between mb-5">
        <div>
          <span className="label" style={{ display: 'block', marginBottom: '6px' }}>Total Equity</span>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '1.9rem',
            letterSpacing: '-0.03em',
            color: 'var(--color-text-primary)',
            lineHeight: 1,
          }}>
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div style={{
          display: 'flex',
          gap: '2px',
          backgroundColor: 'var(--color-bg-page)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: '4px',
          padding: '3px',
        }}>
          {TIME_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.68rem',
                fontWeight: 500,
                letterSpacing: '0.06em',
                padding: '4px 9px',
                borderRadius: '3px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
                backgroundColor: tab === activeTab ? 'var(--color-accent-bg-strong)' : 'transparent',
                color: tab === activeTab ? 'var(--color-accent)' : 'var(--color-text-muted)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '180px' }}>
        {chartSource.length > 0 ? (
          <Line data={chartData} options={chartOptions} plugins={[peakLabelPlugin]} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
            }}>
              — no equity data —
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
