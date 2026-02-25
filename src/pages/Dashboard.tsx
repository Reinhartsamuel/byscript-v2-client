import EquitySummary from '@/pages/dashboard/EquitySummary'
import AccountsSummary from '@/pages/dashboard/AccountsSummary'
import TopAutotraders from '@/pages/dashboard/TopAutotraders'
import TradeHistoryCard from '@/pages/dashboard/TradeHistoryCard'
import DataOverview from '@/pages/dashboard/DataOverview'
import BecomeAffiliate from '@/pages/dashboard/BecomeAffiliate'
import { useEffect, useState } from 'react'
import { BASE_URL } from '@/lib/constants'

export interface EquitySummaryData {
  total_balance: number
  chart: { label: string; value: number }[]
}

export interface AccountSummaryItem {
  id: string
  name: string
  value: number
  percentage: number
  color?: string
}

export interface AutotraderStats {
  total: number
  active: number
  stopped: number
  paused: number
}

export interface DataOverviewData {
  accounts_connected: number
  active_accounts: number
  autotraders: AutotraderStats
  trades: number
  total_pnl: number
  win_rate: number
  roi: number
}

export interface TopAutotraderItem {
  id: string
  name: string
  win_rate: number
  pair: string
  trades: number
  mini_chart?: number[]
}

export interface TradeHistoryItem {
  id: string
  ticker: string
  exchange: string
  action: string
  price: number
  pnl: number
  pnl_percent: number
  time_ago: string
}

export interface DashboardData {
  equity_summary: EquitySummaryData
  accounts_summary: AccountSummaryItem[]
  trade_history: TradeHistoryItem[]
  data_overview: DataOverviewData
  top_autotraders: TopAutotraderItem[]
}

const EMPTY_DASHBOARD: DashboardData = {
  equity_summary: { total_balance: 0, chart: [] },
  accounts_summary: [],
  trade_history: [],
  data_overview: {
    accounts_connected: 0,
    active_accounts: 0,
    autotraders: { total: 0, active: 0, stopped: 0, paused: 0 },
    trades: 0,
    total_pnl: 0,
    win_rate: 0,
    roi: 0,
  },
  top_autotraders: [],
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>(EMPTY_DASHBOARD)

  useEffect(() => {
    async function getDashboardData() {
      try {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id
        const res = await fetch(`${BASE_URL}/user/dashboard?user_id=${userId}&period=7D`)
        const json = await res.json()
        setData({ ...EMPTY_DASHBOARD, ...json })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }
    getDashboardData()
  }, [])

  return (
    <div className="flex gap-6" style={{ minHeight: 'fit-content' }}>
      <div className="flex flex-col gap-6" style={{ flex: '1 1 65%', minWidth: 0 }}>
        <EquitySummary data={data.equity_summary} />
        <AccountsSummary data={data.accounts_summary} />
        <TopAutotraders data={data.top_autotraders} />
      </div>

      <div className="flex flex-col gap-6" style={{ flex: '0 1 35%', minWidth: 0 }}>
        <TradeHistoryCard data={data.trade_history} />
        <DataOverview data={data.data_overview} />
        <BecomeAffiliate />
      </div>
    </div>
  )
}
