import { useState } from 'react'
import TradeHistoryFilterBar, { type TradeHistoryFilters } from './trade-history/TradeHistoryFilterBar'
import TradeHistoryTable, { type Trade } from './trade-history/TradeHistoryTable'

const DEFAULT_FILTERS: TradeHistoryFilters = {
  dateRange: 'Last 7 days',
  account: 'All accounts',
  market: 'Spot / Futures',
  pair: 'All pairs',
  side: 'Buy / Sell · Long / Short',
  status: 'All',
}

// Mock data — replace with API call
const MOCK_TRADES: Trade[] = [
  {
    id: 1,
    exchange: 'Binance',
    market_type: 'futures',
    contract: 'BTC_USDT',
    position_type: 'long',
    price: '67450.00',
    size: '0.05000000',
    pnl: '124.50',
    status: 'closed',
    autotrader_name: 'KeltnerDash',
    account_name: 'Main Account',
    open_filled_at: Math.floor(Date.now() / 1000) - 3600,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    exchange: 'Bybit',
    market_type: 'futures',
    contract: 'ETH_USDT',
    position_type: 'short',
    price: '3210.50',
    size: '0.50000000',
    pnl: '-45.20',
    status: 'closed',
    autotrader_name: 'PivotTurbo',
    account_name: 'Hedge Account',
    open_filled_at: Math.floor(Date.now() / 1000) - 7200,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    exchange: 'Binance',
    market_type: 'spot',
    contract: 'SOL_USDT',
    position_type: 'long',
    price: '185.30',
    size: '10.00000000',
    pnl: null,
    status: 'open',
    autotrader_name: 'IchimokuCore',
    account_name: 'Main Account',
    open_filled_at: Math.floor(Date.now() / 1000) - 900,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    exchange: 'OKX',
    market_type: 'futures',
    contract: 'BTC_USDT',
    position_type: 'short',
    price: '68100.00',
    size: '0.02000000',
    pnl: null,
    status: 'failed',
    autotrader_name: 'KeltnerDash',
    account_name: 'OKX Account',
    open_filled_at: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 5,
    exchange: 'Bybit',
    market_type: 'futures',
    contract: 'ETH_USDT',
    position_type: 'long',
    price: '3180.00',
    size: '1.00000000',
    pnl: '89.00',
    status: 'filled',
    autotrader_name: 'PivotTurbo',
    account_name: 'Hedge Account',
    open_filled_at: Math.floor(Date.now() / 1000) - 14400,
    created_at: new Date().toISOString(),
  },
]

export default function TradeHistory() {
  const [filters, setFilters] = useState<TradeHistoryFilters>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<TradeHistoryFilters>(DEFAULT_FILTERS)

  function applyFilters() {
    setAppliedFilters(filters)
  }

  const filtered = MOCK_TRADES.filter((t) => {
    if (appliedFilters.status !== 'All' && t.status !== appliedFilters.status) return false
    if (appliedFilters.pair !== 'All pairs' && t.contract !== appliedFilters.pair.replace('/', '_')) return false
    if (appliedFilters.market === 'Spot' && t.market_type !== 'spot') return false
    if (appliedFilters.market === 'Futures' && t.market_type !== 'futures') return false
    return true
  })

  return (
    <div className="flex flex-col gap-4">
      <TradeHistoryFilterBar filters={filters} onChange={setFilters} onApply={applyFilters} />
      <TradeHistoryTable data={filtered} />
    </div>
  )
}
