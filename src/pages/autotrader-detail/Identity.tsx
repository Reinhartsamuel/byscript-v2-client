import { AutotraderDetailData } from '@/data/mockData'

interface IdentityProps {
  data: AutotraderDetailData
}

export default function Identity({ data }: IdentityProps) {
  return (
    <div className="card">
      <p className="text-muted text-xs uppercase tracking-wide mb-4">Identity</p>

      <div className="flex gap-8">
        {/* Left: Key-value pairs */}
        <div className="flex flex-col gap-3">
          {/* Autotrader Info */}
          <div className="flex flex-col gap-1">
            <p className="text-muted text-xs">Autotrader Info</p>
            <p className="text-secondary text-sm font-mono">{data.autotraderInfo}</p>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <p className="text-muted text-xs">Status</p>
            <span className={data.status === 'Active' ? 'badge-green' : 'badge-red'}>
              {data.status}
            </span>
          </div>

          {/* Created At */}
          <div className="flex flex-col gap 1">
            <p className="text-muted text-xs">Created At</p>
            <p className="text-primary text-sm">{data.createdAt}</p>
          </div>

          {/* Capital per trade */}
          <div className="flex flex-col gap-1">
            <p className="text-muted text-xs">Capital per trade</p>
            <p className="text-primary text-sm">${data.capitalPerTrade}</p>
          </div>
        </div>

        {/* Right: Exchange info */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-primary font-semibold">{data.exchange}</p>
            <p className="text-primary text-lg font-bold">{data.pair}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-secondary text-sm">{data.marketType}</p>
            <p className="text-secondary text-sm">{data.leverage}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
