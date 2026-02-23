import { useNavigate } from 'react-router-dom'
import Identity from '@/pages/autotrader-detail/Identity'
import PnlSnapshot from '@/pages/autotrader-detail/PnlSnapshot'
import ActionButtons from '@/pages/autotrader-detail/ActionButtons'
import RecentTradeExecutions from '@/pages/autotrader-detail/RecentTradeExecutions'
import TradeSetup from '@/pages/autotrader-detail/TradeSetup'
import JsonPayload from '@/pages/autotrader-detail/JsonPayload'
import { AUTOTRADER_DETAIL, RECENT_EXECUTIONS } from '@/data/mockData'

export default function AutotraderDetail() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => navigate('/autotraders')}
          className="text-green cursor-pointer hover:text-primary transition-colors"
        >
          autotrader
        </button>
        <span className="text-muted">&gt;</span>
        <span className="text-primary">{AUTOTRADER_DETAIL.name}</span>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-4 flex-1">
          <Identity data={AUTOTRADER_DETAIL} />
          <PnlSnapshot data={AUTOTRADER_DETAIL} />
          <ActionButtons />
          <RecentTradeExecutions data={RECENT_EXECUTIONS} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 w-80">
          <TradeSetup data={AUTOTRADER_DETAIL} />
          <JsonPayload />
        </div>
      </div>
    </div>
  )
}
