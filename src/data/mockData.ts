// ── Equity Summary ──────────────────────────────────────────
export const EQUITY_SUMMARY = {
  totalEquity: 286478,
  change: 0.98,
  changePositive: true,
}

export const EQUITY_CHART_7D: { label: string; value: number }[] = [
  { label: 'Jan 13', value: 252000 },
  { label: 'Jan 15', value: 248500 },
  { label: 'Jan 17', value: 243200 },
  { label: 'Jan 20', value: 250800 },
  { label: 'Jan 24', value: 254781.79 },
  { label: 'Jan 27', value: 252100 },
  { label: 'Jan 31', value: 253400 },
]

export const EQUITY_CHART_30D = EQUITY_CHART_7D
export const EQUITY_CHART_90D = EQUITY_CHART_7D
export const EQUITY_CHART_ALL = EQUITY_CHART_7D

// ── Accounts Summary ─────────────────────────────────────────
export interface Account {
  id: string
  name: string
  value: number
  percentage: number
  color: string
}

export const ACCOUNTS: Account[] = [
  { id: '1', name: 'Web3 Futures #7', value: 32494, percentage: 16.9, color: 'var(--color-dot-0)' },
  { id: '2', name: 'CEX Futures #11', value: 31224, percentage: 16.3, color: 'var(--color-dot-1)' },
  { id: '3', name: 'CEX Futures #10', value: 29507, percentage: 15.8, color: 'var(--color-dot-2)' },
  { id: '4', name: 'CEX Futures #4', value: 15099, percentage: 5.3, color: 'var(--color-dot-3)' },
  { id: '5', name: 'CEX Futures #12', value: 15005, percentage: 5.3, color: 'var(--color-dot-4)' },
  { id: '6', name: 'BANDSUSDT', value: 13112, percentage: 6.4, color: 'var(--color-dot-5)' },
]

// ── Top Autotraders ──────────────────────────────────────────
export interface Autotrader {
  id: string
  initials: string
  name: string
  winRate: number
  pair: string
  trades: number
  miniChartData: number[]
}

export const TOP_AUTOTRADERS: Autotrader[] = [
  {
    id: '1',
    initials: 'AP',
    name: 'Keltner Dash v2',
    winRate: 83.7,
    pair: 'APQ3/USDT',
    trades: 17,
    miniChartData: [10, 12, 11, 14, 13, 16, 15, 18, 17, 20],
  },
  {
    id: '2',
    initials: 'AA',
    name: 'Pivot Turbo v3',
    winRate: 82.7,
    pair: 'BTC/USDT',
    trades: 28,
    miniChartData: [8, 10, 9, 12, 11, 13, 14, 13, 15, 16],
  },
  {
    id: '3',
    initials: 'FT',
    name: 'Ichimoku Core v3',
    winRate: 46.2,
    pair: 'ETH/USDT',
    trades: 8,
    miniChartData: [15, 14, 16, 13, 12, 14, 11, 13, 12, 14],
  },
]

// ── Trade History ────────────────────────────────────────────
export type TradeAction = 'Buy' | 'Sell' | 'Close' | 'Cancel'

export interface TradeEntry {
  id: string
  ticker: string
  exchange: string
  action: TradeAction
  pnl: number
  pnlPercent: number
  timeAgo: string
}

export const RECENT_TRADES: TradeEntry[] = [
  { id: '1', ticker: 'ZEC', exchange: 'Match Spot #1', action: 'Sell', pnl: -6.12, pnlPercent: -1.05, timeAgo: '6d ago' },
  { id: '2', ticker: 'GALA', exchange: 'Web3 Spot #2', action: 'Close', pnl: 12.45, pnlPercent: 2.30, timeAgo: '6d ago' },
  { id: '3', ticker: 'ETC', exchange: 'CEX Futures #7', action: 'Buy', pnl: 8.75, pnlPercent: 1.15, timeAgo: '6d ago' },
  { id: '4', ticker: 'ASTR', exchange: 'CEX Futures #4', action: 'Buy', pnl: 5.20, pnlPercent: 0.85, timeAgo: '6d ago' },
  { id: '5', ticker: 'YFI', exchange: 'CEX Futures #7', action: 'Buy', pnl: 15.60, pnlPercent: 3.20, timeAgo: '6d ago' },
]

// ── Data Overview ────────────────────────────────────────────
export const DATA_OVERVIEW = {
  accountsConnected: 35,
  accountsActive: 29,
  accountsStopped: 6,
  autotraders: 203,
  autotradersPaused: 47,
  trades: 9800,
  winRate: 76.52,
  totalPnl: 30856.11,
  roi: 48.25,
}

// ── Become Affiliate ─────────────────────────────────────────
export const AFFILIATE = {
  closes: 30,
  leads: 21,
  earnings: 2100,
}

// ── Accounts Page ────────────────────────────────────────────
export interface AccountTableRow {
  id: string
  name: string
  subName: string
  value: number
  change1D: number
  change7D: number
  change30D: number
  autotraderCount: number
  market: string
  provider: string
  autotrader: string
  assets: { color: string; pct: number }[]
}

export const ACCOUNTS_TABLE: AccountTableRow[] = [
  {
    id: '1',
    name: 'Web3 Futures #7',
    subName: 'hypercloud - Web3',
    value: 32494,
    change1D: -1.7,
    change7D: 69.2,
    change30D: 299.5,
    autotraderCount: 9,
    market: 'Futures',
    provider: 'hypercloud',
    autotrader: 'KeltnerDash',
    assets: [
      { color: '#4ade80', pct: 35 },
      { color: '#22d3ee', pct: 20 },
      { color: '#60a5fa', pct: 25 },
      { color: '#facc15', pct: 12 },
      { color: '#a78bfa', pct: 8 },
    ],
  },
  {
    id: '2',
    name: 'CEX Futures #11',
    subName: 'Green_Futures - Futures',
    value: 31224,
    change1D: 3.7,
    change7D: 63.8,
    change30D: -32.7,
    autotraderCount: 10,
    market: 'Futures',
    provider: 'Green',
    autotrader: 'PivotTurbo',
    assets: [
      { color: '#4ade80', pct: 28 },
      { color: '#22d3ee', pct: 30 },
      { color: '#60a5fa', pct: 18 },
      { color: '#fb923c', pct: 14 },
      { color: '#a78bfa', pct: 10 },
    ],
  },
  {
    id: '3',
    name: 'CEX Futures #10',
    subName: 'CEX - Futures',
    value: 29557,
    change1D: 5.3,
    change7D: 9.2,
    change30D: 0.3,
    autotraderCount: 10,
    market: 'Futures',
    provider: 'CEX',
    autotrader: 'IchimokuCore',
    assets: [
      { color: '#4ade80', pct: 40 },
      { color: '#22d3ee', pct: 15 },
      { color: '#60a5fa', pct: 20 },
      { color: '#facc15', pct: 15 },
      { color: '#a78bfa', pct: 10 },
    ],
  },
  {
    id: '4',
    name: 'CEX Futures #4',
    subName: 'CEX - Futures',
    value: 15099,
    change1D: -3.1,
    change7D: 5.7,
    change30D: 75.4,
    autotraderCount: 8,
    market: 'Futures',
    provider: 'CEX',
    autotrader: 'KeltnerDash',
    assets: [
      { color: '#4ade80', pct: 22 },
      { color: '#22d3ee', pct: 25 },
      { color: '#60a5fa', pct: 30 },
      { color: '#fb923c', pct: 13 },
      { color: '#a78bfa', pct: 10 },
    ],
  },
  {
    id: '5',
    name: 'CEX Futures #12',
    subName: 'CEX - Futures',
    value: 15005,
    change1D: 5.2,
    change7D: 32.9,
    change30D: 118.2,
    autotraderCount: 3,
    market: 'Futures',
    provider: 'CEX',
    autotrader: 'PivotTurbo',
    assets: [
      { color: '#4ade80', pct: 30 },
      { color: '#22d3ee', pct: 22 },
      { color: '#60a5fa', pct: 18 },
      { color: '#facc15', pct: 18 },
      { color: '#a78bfa', pct: 12 },
    ],
  },
  {
    id: '6',
    name: 'CEX Futures #7',
    subName: 'hydr - Futures',
    value: 13112,
    change1D: 0.9,
    change7D: 4.7,
    change30D: 1.6,
    autotraderCount: 11,
    market: 'Futures',
    provider: 'hydr',
    autotrader: 'IchimokuCore',
    assets: [
      { color: '#4ade80', pct: 18 },
      { color: '#22d3ee', pct: 28 },
      { color: '#60a5fa', pct: 22 },
      { color: '#fb923c', pct: 20 },
      { color: '#a78bfa', pct: 12 },
    ],
  },
  {
    id: '7',
    name: 'CEX Futures #3',
    subName: 'CEX - Futures',
    value: 11500,
    change1D: -0.4,
    change7D: 12.1,
    change30D: 45.8,
    autotraderCount: 6,
    market: 'Futures',
    provider: 'CEX',
    autotrader: 'KeltnerDash',
    assets: [
      { color: '#4ade80', pct: 25 },
      { color: '#22d3ee', pct: 20 },
      { color: '#60a5fa', pct: 25 },
      { color: '#fb923c', pct: 15 },
      { color: '#a78bfa', pct: 15 },
    ],
  },
]

export interface DistributionAccount {
  id: string
  name: string
  value: number
  percentage: number
}

export const ACCOUNTS_PAGE_DISTRIBUTION: DistributionAccount[] = [
  { id: '1', name: 'hyperliquid', value: 32494, percentage: 11.3 },
  { id: '2', name: 'QFXE_SAWS', value: 28100, percentage: 9.8 },
  { id: '3', name: 'token_Futures', value: 24800, percentage: 8.6 },
  { id: '4', name: 'EEES_JALU', value: 21500, percentage: 7.5 },
  { id: '5', name: 'Sunoh - Futures', value: 19200, percentage: 6.7 },
  { id: '6', name: 'AKSH_JALU', value: 17400, percentage: 6.1 },
  { id: '7', name: 'idx - Futures', value: 15800, percentage: 5.5 },
  { id: '8', name: 'ESHK - FURE', value: 13962, percentage: 4.9 },
  { id: '9', name: 'Others', value: 178762, percentage: 83.2 },
]

// ── Autotraders Page ─────────────────────────────────────────
export interface AutotraderListRow {
  id: string
  status: 'Active' | 'Stopped'
  tradingPlan: string
  pair: string
  exchange: string
  capital: number
  pnl: number
  winRate: number
  running: number
}

const BASE_AUTOTRADERS: AutotraderListRow[] = [
  { id: '1', status: 'Stopped', tradingPlan: 'Trading Plan #2', pair: 'BTC_USDT', exchange: 'Exchange', capital: 2763.58, pnl: 0, winRate: 0, running: 0 },
  { id: '2', status: 'Stopped', tradingPlan: 'Trading Plan #3', pair: 'BTC_USDT', exchange: 'Exchange', capital: 1075.12, pnl: 0, winRate: 0, running: 0 },
  { id: '3', status: 'Stopped', tradingPlan: 'Trading Plan #1', pair: 'BTC_USDT', exchange: 'Exchange', capital: 7819.01, pnl: 0, winRate: 0, running: 0 },
  { id: '4', status: 'Stopped', tradingPlan: 'Trading Plan #3', pair: 'BTC_USDT', exchange: 'Exchange', capital: 1404.33, pnl: 0, winRate: 0, running: 0 },
  { id: '5', status: 'Stopped', tradingPlan: 'Trading Plan #4', pair: 'BTC_USDT', exchange: 'Exchange', capital: 2763.69, pnl: 0, winRate: 0, running: 0 },
  { id: '6', status: 'Stopped', tradingPlan: 'Trading Plan #1', pair: 'BTC_USDT', exchange: 'Exchange', capital: 4984.57, pnl: 0, winRate: 0, running: 0 },
  { id: '7', status: 'Stopped', tradingPlan: 'Trading Plan #2', pair: 'BTC_USDT', exchange: 'Exchange', capital: 9090.10, pnl: 0, winRate: 0, running: 0 },
  { id: '8', status: 'Stopped', tradingPlan: 'Trading Plan #3', pair: 'BTC_USDT', exchange: 'Exchange', capital: 2534.80, pnl: 0, winRate: 0, running: 0 },
  { id: '9', status: 'Stopped', tradingPlan: 'Trading Plan #2', pair: 'BTC_USDT', exchange: 'Exchange', capital: 9268.80, pnl: 0, winRate: 0, running: 0 },
  { id: '10', status: 'Stopped', tradingPlan: 'Trading Plan #5', pair: 'BTC_USDT', exchange: 'Exchange', capital: 4827.85, pnl: 0, winRate: 0, running: 0 },
]

export const AUTOTRADERS_LIST: AutotraderListRow[] = Array.from({ length: 203 }, (_, i) => ({
  ...BASE_AUTOTRADERS[i % 10],
  id: String(i + 1),
}))

// ── Autotrader Detail Page ───────────────────────────────────
export interface AutotraderDetailData {
  id: string
  name: string
  autotraderInfo: string
  status: 'Active' | 'Stopped'
  createdAt: string
  capitalPerTrade: number
  exchange: string
  pair: string
  marketType: string
  leverage: string
  totalPnl: number
  pnl7D: number
  pnl30D: number
  pnl90D: number
  totalProfit: number
  totalLoss: number
  totalTrades: number
  winRate: number
  winningPositions: number
  pendingOrders: number
  profitFactor: number
  riskReward: string
  maxCapitalUsed: number
  maxConcurrentPositions: number
}

export const AUTOTRADER_DETAIL: AutotraderDetailData = {
  id: '1',
  name: 'Grid Cuentrus',
  autotraderInfo: 'jR23nrc1339a33F',
  status: 'Active',
  createdAt: 'Jan 02 2026 - 18:00',
  capitalPerTrade: 100,
  exchange: 'Binance',
  pair: 'BTC / USDT',
  marketType: 'Futures',
  leverage: 'Isolated 50X',
  totalPnl: 3680,
  pnl7D: 68,
  pnl30D: 150,
  pnl90D: 1020,
  totalProfit: 19000,
  totalLoss: 42,
  totalTrades: 42,
  winRate: 43,
  winningPositions: 37,
  pendingOrders: 6,
  profitFactor: 2.1,
  riskReward: '1:0.8',
  maxCapitalUsed: 119000,
  maxConcurrentPositions: 110,
}

// ── Recent Trade Executions ──────────────────────────────────
export interface RecentExecution {
  id: string
  timestamp: string
  action: 'BUY' | 'SELL' | 'CANCEL'
  side: 'LONG' | 'SHORT'
  price: number
  size: number
  sizeUnit: string
  status: 'OPEN' | 'FILLED' | 'PARTIAL' | 'FAILED'
  source: string
}

export const RECENT_EXECUTIONS: RecentExecution[] = [
  { id: '1', timestamp: '12:01:47', action: 'BUY', side: 'LONG', price: 67300, size: 0.2, sizeUnit: 'BTC', status: 'OPEN', source: 'STRATEGY' },
  { id: '2', timestamp: '11:58:22', action: 'SELL', side: 'SHORT', price: 67250, size: 0.15, sizeUnit: 'BTC', status: 'FILLED', source: 'STRATEGY' },
  { id: '3', timestamp: '11:45:13', action: 'BUY', side: 'LONG', price: 67100, size: 0.25, sizeUnit: 'BTC', status: 'PARTIAL', source: 'STRATEGY' },
  { id: '4', timestamp: '11:32:41', action: 'CANCEL', side: 'LONG', price: 67050, size: 0.1, sizeUnit: 'BTC', status: 'FAILED', source: 'STRATEGY' },
  { id: '5', timestamp: '11:20:15', action: 'BUY', side: 'LONG', price: 66900, size: 0.3, sizeUnit: 'BTC', status: 'FILLED', source: 'STRATEGY' },
  { id: '6', timestamp: '11:05:33', action: 'SELL', side: 'SHORT', price: 66850, size: 0.2, sizeUnit: 'BTC', status: 'OPEN', source: 'STRATEGY' },
  { id: '7', timestamp: '10:50:47', action: 'BUY', side: 'LONG', price: 66700, size: 0.15, sizeUnit: 'BTC', status: 'FILLED', source: 'STRATEGY' },
  { id: '8', timestamp: '10:35:22', action: 'SELL', side: 'SHORT', price: 66600, size: 0.25, sizeUnit: 'BTC', status: 'PARTIAL', source: 'STRATEGY' },
  { id: '9', timestamp: '10:20:11', action: 'BUY', side: 'LONG', price: 66500, size: 0.18, sizeUnit: 'BTC', status: 'FILLED', source: 'STRATEGY' },
]
