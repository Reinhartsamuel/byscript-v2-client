import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import Identity from '@/pages/autotrader-detail/Identity'
import PnlSnapshot from '@/pages/autotrader-detail/PnlSnapshot'
import ActionButtons from '@/pages/autotrader-detail/ActionButtons'
import RecentTradeExecutions from '@/pages/autotrader-detail/RecentTradeExecutions'
import TradeSetup from '@/pages/autotrader-detail/TradeSetup'
import JsonPayload from '@/pages/autotrader-detail/JsonPayload'
import { getAutotraderDetail, getAutotraderTrades, deleteAutotrader, subscribeToAutotraderTrades } from '@/lib/api'

export interface AutotraderDetailResponse {
  id: number
  exchange_id: number
  trading_plan_id: number | null
  market: string
  pair: string | null
  symbol: string
  status: string | null
  initial_investment: string
  current_balance: string
  leverage: number
  leverage_type: string | null
  margin_mode: string
  position_mode: string
  autocompound: boolean | null
  created_at: string | null
  webhook_token: string | null
  exchange_title: string
  trading_plan_name: string | null
  total_trades: number
  total_profit: number
  total_loss: number
  total_pnl: number
  winning_trades: number
  pending_orders: number
  win_rate: number
  profit_factor: number
}

export interface TradeRow {
  id: number
  trade_id: string
  contract: string
  position_type: string
  market_type: string
  size: string
  price: string | null
  leverage: number
  leverage_type: string
  status: string
  position_status: string | null
  pnl: string | null
  pnl_margin: string | null
  open_fill_price: string | null
  close_fill_price: string | null
  created_at: string | null
  updated_at: string | null
}

// ── Delete Confirmation Modal ─────────────────────────────────

function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  isPending,
  autotraderName,
  error,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
  autotraderName: string
  error: string | null
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={isPending ? undefined : onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-xl p-6 flex flex-col gap-5"
        style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-primary text-base font-semibold">Delete Autotrader</h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-secondary hover:text-primary transition-colors disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3">
          <p className="text-secondary text-sm">
            Are you sure you want to delete <span className="text-primary font-semibold">{autotraderName}</span>?
          </p>
          <p className="text-muted text-xs">
            This action cannot be undone. All associated trade history will remain in the database but the autotrader configuration will be permanently removed.
          </p>
          {error && <p className="text-red text-xs">{error}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-secondary hover:text-primary transition-colors disabled:opacity-40"
            style={{ border: '1px solid var(--color-border-subtle)', backgroundColor: 'transparent' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-accent-red)' }}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────

export default function AutotraderDetail() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: string }>()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const { data: autotrader, isLoading, isError, error } = useQuery({
    queryKey: ['autotrader', id],
    queryFn: () => getAutotraderDetail(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    select: (res): AutotraderDetailResponse => res.data,
  })

  const { data: initialTrades = [] } = useQuery({
    queryKey: ['autotrader-trades', id],
    queryFn: () => getAutotraderTrades(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
    select: (res): TradeRow[] => res.data || [],
  })

  const [trades, setTrades] = useState<TradeRow[]>([])

  useEffect(() => {
    if (initialTrades.length > 0) setTrades(initialTrades)
  }, [initialTrades])

  useEffect(() => {
    if (!id) return
    const unsubscribe = subscribeToAutotraderTrades(id, (items) => setTrades(items as TradeRow[]))
    return unsubscribe
  }, [id])

  const deleteMutation = useMutation({
    mutationFn: () => deleteAutotrader(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['autotraders'] })
      navigate('/autotraders')
    },
  })

  if (isLoading) return <div className="p-8 text-center text-muted">Loading autotrader...</div>
  if (isError) return <div className="p-8 text-red">Error: {(error as Error).message}</div>
  if (!autotrader) return <div className="p-8 text-muted">Autotrader not found.</div>

  const detailData = {
    id: String(autotrader.id),
    name: autotrader.trading_plan_name || autotrader.symbol,
    autotraderInfo: `${autotrader.symbol} #${autotrader.id}`,
    status: (autotrader.status === 'active' ? 'Active' : 'Stopped') as 'Active' | 'Stopped',
    createdAt: autotrader.created_at ? new Date(autotrader.created_at).toLocaleString() : '—',
    capitalPerTrade: Number(autotrader.initial_investment),
    exchange: autotrader.exchange_title,
    pair: autotrader.pair || autotrader.symbol,
    marketType: autotrader.market,
    leverage: `${autotrader.leverage_type || 'Isolated'} ${autotrader.leverage}X`,
    totalPnl: autotrader.total_pnl,
    pnl7D: 0,
    pnl30D: 0,
    pnl90D: 0,
    totalProfit: autotrader.total_profit,
    totalLoss: autotrader.total_loss,
    totalTrades: autotrader.total_trades,
    winRate: autotrader.win_rate,
    winningPositions: autotrader.winning_trades,
    pendingOrders: autotrader.pending_orders,
    profitFactor: autotrader.profit_factor,
    riskReward: '—',
    maxCapitalUsed: Number(autotrader.current_balance),
    maxConcurrentPositions: 0,
    webhookToken: autotrader.webhook_token,
  }

  const executionsData = trades.map((t) => ({
    id: String(t.id),
    timestamp: t.created_at ? new Date(t.created_at).toLocaleTimeString() : '—',
    action: (t.position_type === 'long' ? 'BUY' : 'SELL') as 'BUY' | 'SELL' | 'CANCEL',
    side: (t.position_type?.toUpperCase() || 'LONG') as 'LONG' | 'SHORT',
    price: Number(t.open_fill_price || t.price || 0),
    size: Number(t.size || 0),
    sizeUnit: autotrader.symbol?.replace(/USDT|USDC|USD/, '') || '',
    status: (t.status?.toUpperCase() || 'OPEN') as 'OPEN' | 'FILLED' | 'PARTIAL' | 'FAILED' | 'WAITING_POSITION' | 'WAITING_TARGETS',
    source: 'STRATEGY',
    pnl: Number(t.pnl || 0),
  }))

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
        <span className="text-primary">{detailData.name}</span>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-4 flex-1">
          <Identity data={detailData} />
          <PnlSnapshot data={detailData} />
          <ActionButtons onDelete={() => setDeleteModalOpen(true)} />
          <RecentTradeExecutions data={executionsData} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 w-80">
          <TradeSetup data={detailData} />
          <JsonPayload data={detailData} />
        </div>
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        isPending={deleteMutation.isPending}
        autotraderName={detailData.autotraderInfo}
        error={deleteMutation.isError ? (deleteMutation.error as Error).message : null}
      />
    </div>
  )
}
