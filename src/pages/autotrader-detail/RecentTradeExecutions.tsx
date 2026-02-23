import { RecentExecution } from '@/data/mockData'

interface RecentTradeExecutionsProps {
  data: RecentExecution[]
}

export default function RecentTradeExecutions({ data }: RecentTradeExecutionsProps) {
  const getActionColor = (action: string) => {
    if (action === 'BUY') return 'text-green'
    if (action === 'SELL') return 'text-red'
    return 'text-muted'
  }

  const getStatusColor = (status: string) => {
    if (status === 'OPEN') return 'text-green'
    if (status === 'FILLED') return 'text-primary'
    if (status === 'PARTIAL') return ''
    if (status === 'FAILED') return 'text-red'
    return 'text-primary'
  }

  const getStatusStyle = (status: string) => {
    if (status === 'PARTIAL') return { color: '#f59e0b' }
    return {}
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-primary text-sm font-semibold">Recent Trade Executions</h3>
        <p className="text-muted text-xs">Last 10 executions</p>
      </div>

      {/* Column headers */}
      <div
        className="grid text-muted text-xs uppercase tracking-wider mb-2"
        style={{ gridTemplateColumns: '1fr 0.8fr 0.7fr 1fr 0.9fr 0.8fr 0.8fr' }}
      >
        <span>Timestamp</span>
        <span className="text-center">Action</span>
        <span className="text-center">Side</span>
        <span className="text-right">Price</span>
        <span className="text-right">Size</span>
        <span className="text-center">Status</span>
        <span className="text-center">Source</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {data.map((row, i) => (
          <div
            key={row.id}
            className="grid py-3"
            style={{
              gridTemplateColumns: '1fr 0.8fr 0.7fr 1fr 0.9fr 0.8fr 0.8fr',
              borderTop: i > 0 ? '1px solid var(--color-border-subtle)' : 'none',
            }}
          >
            {/* Timestamp */}
            <span className="text-primary text-xs">{row.timestamp}</span>

            {/* Action */}
            <span className={`text-xs text-center ${getActionColor(row.action)}`}>{row.action}</span>

            {/* Side */}
            <span className="text-primary text-xs text-center">{row.side}</span>

            {/* Price */}
            <span className="text-primary text-xs text-right">${row.price.toLocaleString()}</span>

            {/* Size */}
            <span className="text-primary text-xs text-right">
              {row.size.toFixed(3)} {row.sizeUnit}
            </span>

            {/* Status */}
            <span
              className={`text-xs text-center ${getStatusColor(row.status)}`}
              style={getStatusStyle(row.status)}
            >
              {row.status}
            </span>

            {/* Source */}
            <span className="text-primary text-xs text-center">{row.source}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
        <p className="text-green text-xs text-right cursor-pointer hover:text-primary transition-colors">
          View all trades
        </p>
        <p className="text-muted text-xs italic mt-2">
          Binance is licensed to operate...
        </p>
      </div>
    </div>
  )
}
