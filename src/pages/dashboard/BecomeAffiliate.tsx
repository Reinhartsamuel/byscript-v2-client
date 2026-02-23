import { Copy } from 'lucide-react'
import { AFFILIATE } from '@/data/mockData'

export default function BecomeAffiliate() {
  return (
    <div className="card">
      <h3 className="text-primary text-sm font-semibold mb-1">Become Affiliate</h3>
      <p className="text-secondary text-xs mb-4">Earn commissions by helping traders automate their trading.</p>

      <div className="flex justify-between mb-5">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-muted text-xs uppercase tracking-wider">Closes</span>
          <span className="text-primary text-lg font-bold">{AFFILIATE.closes}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-muted text-xs uppercase tracking-wider">Leads</span>
          <span className="text-primary text-lg font-bold">{AFFILIATE.leads}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-muted text-xs uppercase tracking-wider">Earnings</span>
          <span className="text-green text-lg font-bold">${AFFILIATE.earnings.toLocaleString()}</span>
        </div>
      </div>

      <button
        className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#4ade80', color: '#1a1a2e' }}
      >
        <Copy size={15} />
        Copy referral link
      </button>
    </div>
  )
}
