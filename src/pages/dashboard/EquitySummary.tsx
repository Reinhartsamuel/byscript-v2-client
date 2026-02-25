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
        borderColor: '#4ade80',
        borderWidth: 2.5,
        backgroundColor: 'transparent',
        pointRadius: 0,
        pointHoverRadius: 4,
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
        backgroundColor: '#22223a',
        titleColor: '#8888a0',
        bodyColor: '#f0f0f0',
        borderColor: '#2e2e45',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (ctx) => `$${(ctx.parsed.y as number).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#8888a0', font: { size: 11 }, maxTicksLimit: 4 },
        border: { display: false },
      },
      y: {
        grid: { display: true, color: 'rgba(46,46,69,0.6)' },
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
        ctx.fillStyle = '#4ade80'
        ctx.beginPath()
        ctx.arc(x, y, 3.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#f0f0f0'
        ctx.font = '11px Inter, system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        ctx.fillText(label, x, y - 8)
        ctx.restore()
      },
    }),
    [peakIndex, chartSource]
  )

  return (
    <div className="card">
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-secondary text-xs uppercase tracking-wide">Equity Summary</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-3">
          <span className="text-primary text-2xl font-bold">
            ${(data?.total_balance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex gap-1">
          {TIME_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="text-xs px-3 py-1 rounded-full transition-colors"
              style={{
                backgroundColor: tab === activeTab ? 'var(--color-bg-card-hover)' : 'transparent',
                color: tab === activeTab ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '200px' }}>
        {chartSource.length > 0 ? (
          <Line data={chartData} options={chartOptions} plugins={[peakLabelPlugin]} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="text-muted text-sm">No equity data available</span>
          </div>
        )}
      </div>
    </div>
  )
}
