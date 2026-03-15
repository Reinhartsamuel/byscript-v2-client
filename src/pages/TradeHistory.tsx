import { useState, useEffect, useCallback } from 'react'
import TradeHistoryFilterBar, { type TradeHistoryFilters } from './trade-history/TradeHistoryFilterBar'
import TradeHistoryTable, { type Trade } from './trade-history/TradeHistoryTable'
import { getTradeHistory, subscribeToTrades } from '../lib/api'

const DEFAULT_FILTERS: TradeHistoryFilters = {
  dateRange: 'Last 7 days',
  account: 'All accounts',
  market: 'Spot / Futures',
  pair: 'All pairs',
  side: 'Buy / Sell · Long / Short',
  status: 'All',
}

function dateRangeToIso(dateRange: string): { date_from?: string; date_to?: string } {
  const now = new Date()
  const days: Record<string, number> = {
    'Last 7 days': 7,
    'Last 30 days': 30,
    'Last 90 days': 90,
  }
  if (days[dateRange]) {
    const from = new Date(now.getTime() - days[dateRange] * 24 * 60 * 60 * 1000)
    return { date_from: from.toISOString() }
  }
  return {}
}

export default function TradeHistory() {
  const [filters, setFilters] = useState<TradeHistoryFilters>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<TradeHistoryFilters>(DEFAULT_FILTERS)
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTrades = useCallback(async (f: TradeHistoryFilters) => {
    setLoading(true)
    try {
      const params: Parameters<typeof getTradeHistory>[0] = {}

      if (f.status !== 'All') params.status = f.status.toLowerCase()
      if (f.pair !== 'All pairs') params.contract = f.pair.replace('/', '_')
      if (f.market === 'Spot') params.market_type = 'spot'
      else if (f.market === 'Futures') params.market_type = 'futures'

      if (f.side === 'Buy · Long') params.position_type = 'long'
      else if (f.side === 'Sell · Short') params.position_type = 'short'

      const { date_from, date_to } = dateRangeToIso(f.dateRange)
      if (date_from) params.date_from = date_from
      if (date_to) params.date_to = date_to

      const res = await getTradeHistory({ ...params, limit: 50 })

      setTrades(
        res.data.map((t) => ({
          id: t.id,
          exchange: t.exchange_title,
          market_type: t.market_type,
          contract: t.contract,
          position_type: t.position_type,
          price: t.price,
          size: t.size,
          pnl: t.pnl,
          status: t.status,
          autotrader_name: t.autotrader_symbol,
          account_name: t.exchange_user_id,
          open_filled_at: t.open_filled_at,
          created_at: t.created_at,
        }))
      )
    } catch (err) {
      console.error('Failed to fetch trade history:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrades(appliedFilters)
  }, [appliedFilters, fetchTrades])

  // SSE: re-fetch when the backend pushes a trade update
  useEffect(() => {
    const unsubscribe = subscribeToTrades((items) => {
      setTrades(
        items.map((t) => ({
          id: t.id,
          exchange: t.exchange_title,
          market_type: t.market_type,
          contract: t.contract,
          position_type: t.position_type,
          price: t.price,
          size: t.size,
          pnl: t.pnl,
          status: t.status,
          autotrader_name: t.autotrader_symbol,
          account_name: t.exchange_user_id,
          open_filled_at: t.open_filled_at,
          created_at: t.created_at,
        }))
      )
    })
    return unsubscribe
  }, [])

  function applyFilters() {
    setAppliedFilters(filters)
  }

  return (
    <div className="flex flex-col gap-4">
      <TradeHistoryFilterBar filters={filters} onChange={setFilters} onApply={applyFilters} />
      <TradeHistoryTable data={trades} loading={loading} />
    </div>
  )
}
