import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, X, Check, Plus, Trash2 } from 'lucide-react'
import { useAddAccountModalStore } from '@/store/index'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAccounts, getTradingPlans, createTradingPlan, createAutotraders } from '@/lib/api'

// ── Types ────────────────────────────────────────────────────

interface ExchangeAccount {
  id: string
  name: string
  subName: string
  value: number
  market: string
}

interface TradingPlan {
  id: number
  name: string
  description: string | null
  strategy: string | null
  visibility: string | null
  is_active: boolean
  pairs: { id: number; trading_plan_id: number; base_asset: string; quote_asset: string; symbol: string }[]
}

interface PairRow {
  pairId: string
  label: string
  symbol: string
  tradeAmount: string
  leverage: string
  leverageType: 'Cross' | 'Isolated'
  marginMode: string
  positionMode: string
}

// ── Hooks ────────────────────────────────────────────────────

function useExchangeAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
    staleTime: 1000 * 60 * 5,
    select: (response): ExchangeAccount[] => {
      const rawData = response?.data || []
      return rawData.map((row: any) => ({
        id: String(row.id),
        name: row.name || row.exchange_title?.toUpperCase() || 'Unknown',
        subName: row.subName || row.exchange_user_id || '',
        value: Number(row.value) || 0,
        market: (row.market || 'spot').toLowerCase(),
      }))
    },
  })
}

function useTradingPlans() {
  return useQuery({
    queryKey: ['trading-plans'],
    queryFn: getTradingPlans,
    staleTime: 1000 * 60 * 5,
    select: (response): TradingPlan[] => response?.data || [],
  })
}

// ── Exchange Dropdown ─────────────────────────────────────────

function ExchangeDropdown({
  accounts,
  value,
  onChange,
  onConnectNew: _onConnectNew,
}: {
  accounts: ExchangeAccount[]
  value: string
  onChange: (id: string) => void
  onConnectNew: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = accounts.find((a) => a.id === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm"
        style={{
          backgroundColor: 'var(--color-bg-page)',
          border: '1px solid var(--color-border-subtle)',
          color: selected ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
        }}
      >
        {selected ? (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: 'var(--color-bg-card-hover)' }}
            >
              {selected.name[0]}
            </div>
            <div className="text-left">
              <p className="text-primary text-sm font-medium">{selected.name}</p>
              <p className="text-muted text-xs">{selected.subName}</p>
            </div>
          </div>
        ) : (
          <span>Select account</span>
        )}
        <ChevronDown size={16} className="text-secondary shrink-0" />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1 rounded-lg z-30 overflow-hidden"
          style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)' }}
        >
          {accounts.map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => { onChange(acc.id); setOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: 'var(--color-bg-card-hover)' }}
              >
                {acc.name[0]}
              </div>
              <div className="text-left flex-1">
                <p className="text-primary text-sm font-medium">{acc.name}</p>
                <p className="text-muted text-xs">{acc.subName}</p>
              </div>
              <span className="text-secondary text-xs">${acc.value.toLocaleString()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Trading Plan Dropdown ─────────────────────────────────────

function TradingPlanDropdown({
  plans,
  value,
  onChange,
}: {
  plans: TradingPlan[]
  value: string
  onChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = plans.find((p) => String(p.id) === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm"
        style={{
          backgroundColor: 'var(--color-bg-page)',
          border: '1px solid var(--color-border-subtle)',
          color: selected ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
        }}
      >
        <span>{selected ? selected.name : 'Select trading plan'}</span>
        <ChevronDown size={16} className="text-secondary shrink-0" />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1 rounded-lg z-30 overflow-hidden"
          style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)' }}
        >
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => { onChange(String(plan.id)); setOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: 'var(--color-bg-card-hover)' }}
              >
                {plan.name[0]}
              </div>
              <div className="text-left">
                <p className="text-primary text-sm font-medium">{plan.name}</p>
                <p className="text-muted text-xs">{plan.pairs.length} pairs</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Create Trading Plan Drawer ────────────────────────────────

function TradingPlanDrawer({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: (planId: number) => void
}) {
  const queryClient = useQueryClient()
  const [planName, setPlanName] = useState('')
  const [selectedPairs, setSelectedPairs] = useState<{ base: string; quote: string; label: string }[]>([])
  const [baseInput, setBaseInput] = useState('')
  const [quoteInput, setQuoteInput] = useState('USDT')
  const mutation = useMutation({
    mutationFn: createTradingPlan,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trading-plans'] })
      onCreated(data.data.id)
      setPlanName('')
      setSelectedPairs([])
      onClose()
    },
  })

  const addCustomPair = () => {
    const base = baseInput.trim().toUpperCase()
    const quote = quoteInput.trim().toUpperCase()
    if (!base || !quote) return
    const label = `${base}/${quote}`
    if (selectedPairs.some((p) => p.label === label)) return
    setSelectedPairs((prev) => [...prev, { base, quote, label }])
    setBaseInput('')
  }

  const removePair = (label: string) => setSelectedPairs((prev) => prev.filter((x) => x.label !== label))

  const handleSave = () => {
    if (!planName.trim() || selectedPairs.length === 0) return
    mutation.mutate({
      name: planName.trim(),
      visibility: 'PRIVATE',
      pairs: selectedPairs.map((p) => ({
        base_asset: p.base,
        quote_asset: p.quote,
        symbol: `${p.base}${p.quote}`,
      })),
    })
  }

  return (
    <div
      className="fixed top-0 right-0 h-full z-40 flex flex-col transition-transform duration-300"
      style={{
        width: 360,
        backgroundColor: 'var(--color-bg-card)',
        borderLeft: '1px solid var(--color-border-subtle)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
      >
        <h3 className="text-primary text-sm font-semibold">Create Trading Plan</h3>
        <button onClick={onClose} className="text-secondary hover:text-primary transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
        {/* Plan Basics */}
        <div className="flex flex-col gap-3">
          <p className="text-muted text-xs uppercase tracking-wide">Plan Basics</p>
          <div className="flex flex-col gap-1.5">
            <label className="text-secondary text-xs">Plan name</label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Plan name"
              className="text-primary text-sm px-3 py-2.5 rounded-lg"
              style={{
                backgroundColor: 'var(--color-bg-page)',
                border: '1px solid var(--color-border-subtle)',
                outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent-green-dim)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-subtle)')}
            />
            <p className="text-muted text-xs">Trading Plans define which pairs can be used when creating autotraders.</p>
          </div>
        </div>

        {/* Add Pair */}
        <div className="flex flex-col gap-3">
          <p className="text-muted text-xs uppercase tracking-wide">Add Trading Pair</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={baseInput}
              onChange={(e) => setBaseInput(e.target.value)}
              placeholder="Base (e.g. BTC)"
              className="text-primary text-sm px-3 py-2 rounded-lg flex-1"
              style={{
                backgroundColor: 'var(--color-bg-page)',
                border: '1px solid var(--color-border-subtle)',
                outline: 'none',
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') addCustomPair() }}
            />
            <input
              type="text"
              value={quoteInput}
              onChange={(e) => setQuoteInput(e.target.value)}
              placeholder="Quote (e.g. USDT)"
              className="text-primary text-sm px-3 py-2 rounded-lg w-24"
              style={{
                backgroundColor: 'var(--color-bg-page)',
                border: '1px solid var(--color-border-subtle)',
                outline: 'none',
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') addCustomPair() }}
            />
            <button
              type="button"
              onClick={addCustomPair}
              className="px-3 py-2 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: 'var(--color-accent-green-dim)', color: '#fff' }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Pair Selection */}
        <div className="flex flex-col gap-3">
          <p className="text-muted text-xs uppercase tracking-wide">Selected Pairs</p>

          {/* Selected pair chips */}
          {selectedPairs.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedPairs.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: 'var(--color-bg-page)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-primary)' }}
                >
                  {p.label}
                  <button type="button" onClick={() => removePair(p.label)} className="text-muted hover:text-primary transition-colors">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pair count + unselect all */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedPairs.length > 0 ? 'var(--color-accent-green-dim)' : 'var(--color-text-muted)' }}
              />
              <span className="text-secondary">{selectedPairs.length} pairs</span>
            </div>
            {selectedPairs.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedPairs([])}
                className="text-muted hover:text-primary transition-colors"
              >
                Unselect all ({selectedPairs.length})
              </button>
            )}
          </div>

          <p className="text-muted text-xs">Only these pairs will be available when creating autotraders using this plan.</p>
        </div>

        {mutation.isError && (
          <p className="text-red text-xs">Error: {(mutation.error as Error).message}</p>
        )}
      </div>

      {/* Footer actions */}
      <div
        className="flex gap-3 px-6 py-4 shrink-0"
        style={{ borderTop: '1px solid var(--color-border-subtle)' }}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 rounded-lg text-sm font-medium text-secondary hover:text-primary transition-colors"
          style={{ border: '1px solid var(--color-border-subtle)', backgroundColor: 'transparent' }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={mutation.isPending || !planName.trim() || selectedPairs.length === 0}
          className="flex-1 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-accent-green-dim)', color: '#fff' }}
        >
          {mutation.isPending ? 'Saving...' : 'Save Trading Plan'}
        </button>
      </div>
    </div>
  )
}

// ── Live Preview Panel ────────────────────────────────────────

function PreviewPanel({
  market,
  account,
  plan,
  pairs,
}: {
  market: 'Spot' | 'Futures'
  account: ExchangeAccount | undefined
  plan: TradingPlan | undefined
  pairs: PairRow[]
}) {
  const totalCapital = pairs.reduce((sum, p) => sum + (parseFloat(p.tradeAmount) || 0), 0)
  const isReady = !!account && !!plan && pairs.length > 0

  return (
    <div
      className="sticky top-0 flex flex-col gap-4 rounded-xl p-5"
      style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)' }}
    >
      {/* Header */}
      <div>
        <p className="text-primary text-sm font-semibold">Autotrader Preview</p>
        <p className="text-muted text-xs mt-0.5">Live summary of your configuration.</p>
      </div>

      {/* Status pill */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{ backgroundColor: isReady ? 'var(--color-accent-green-bg)' : 'var(--color-bg-page)' }}
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: isReady ? 'var(--color-accent-green)' : 'var(--color-text-muted)' }}
        />
        <span
          className="text-xs font-medium"
          style={{ color: isReady ? 'var(--color-accent-green)' : 'var(--color-text-muted)' }}
        >
          {isReady ? 'Ready to deploy' : 'Incomplete configuration'}
        </span>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--color-border-subtle)' }} />

      {/* Market */}
      <PreviewRow label="Market">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded"
          style={{ backgroundColor: 'var(--color-bg-page)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-subtle)' }}
        >
          {market}
        </span>
      </PreviewRow>

      {/* Exchange */}
      <PreviewRow label="Exchange">
        {account ? (
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ backgroundColor: 'var(--color-bg-card-hover)' }}
            >
              {account.name[0]}
            </div>
            <span className="text-primary text-xs">{account.name}</span>
          </div>
        ) : (
          <span className="text-muted text-xs">—</span>
        )}
      </PreviewRow>

      {/* Trading Plan */}
      <PreviewRow label="Trading Plan">
        {plan ? (
          <span className="text-primary text-xs">{plan.name}</span>
        ) : (
          <span className="text-muted text-xs">—</span>
        )}
      </PreviewRow>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--color-border-subtle)' }} />

      {/* Pairs */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-muted text-xs uppercase tracking-wide">Pairs</span>
          <span className="text-primary text-xs font-semibold">{pairs.length}</span>
        </div>

        {pairs.length === 0 ? (
          <p className="text-muted text-xs">No pairs added yet.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {pairs.map((row, i) => {
              const amount = parseFloat(row.tradeAmount)
              return (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ backgroundColor: 'var(--color-bg-page)' }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-primary text-xs font-medium">{row.label}</span>
                    {market === 'Futures' && row.leverage && (
                      <span className="text-muted text-xs">{row.leverageType} {row.leverage}x</span>
                    )}
                  </div>
                  <span className="text-secondary text-xs">
                    {isNaN(amount) || amount === 0 ? '—' : `$${amount.toLocaleString()}`}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--color-border-subtle)' }} />

      {/* Totals */}
      <div className="flex flex-col gap-2">
        <PreviewRow label="Total Autotraders">
          <span className="text-primary text-xs font-semibold">{pairs.length}</span>
        </PreviewRow>
        <PreviewRow label="Total Capital">
          <span className="text-primary text-xs font-semibold">
            {totalCapital > 0 ? `$${totalCapital.toLocaleString()}` : '—'}
          </span>
        </PreviewRow>
      </div>

      {/* Checklist */}
      <div style={{ borderTop: '1px solid var(--color-border-subtle)' }} />
      <div className="flex flex-col gap-1.5">
        <CheckItem done={!!account} label="Exchange selected" />
        <CheckItem done={!!plan} label="Trading plan selected" />
        <CheckItem done={pairs.length > 0} label="At least one pair added" />
        <CheckItem
          done={pairs.length > 0 && pairs.every((p) => parseFloat(p.tradeAmount) > 0)}
          label="All trade amounts filled"
        />
        {market === 'Futures' && (
          <CheckItem
            done={pairs.length > 0 && pairs.every((p) => parseFloat(p.leverage) > 0)}
            label="All leverage values set"
          />
        )}
      </div>
    </div>
  )
}

function PreviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted text-xs">{label}</span>
      <div className="flex items-center">{children}</div>
    </div>
  )
}

function CheckItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: done ? 'var(--color-accent-green-bg)' : 'var(--color-bg-page)', border: `1px solid ${done ? 'var(--color-accent-green-dim)' : 'var(--color-border-subtle)'}` }}
      >
        {done && <Check size={9} style={{ color: 'var(--color-accent-green)' }} />}
      </div>
      <span className="text-xs" style={{ color: done ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
        {label}
      </span>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────

export default function AutotraderConfigurator() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const openAddAccount = useAddAccountModalStore((s) => s.openModal)

  const [market, setMarket] = useState<'Spot' | 'Futures'>('Spot')
  const [accountId, setAccountId] = useState('')
  const [tradingPlanId, setTradingPlanId] = useState('')
  const [pairs, setPairs] = useState<PairRow[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { data: accounts = [] } = useExchangeAccounts()
  const { data: tradingPlans = [] } = useTradingPlans()

  const selectedAccount = accounts.find((a) => a.id === accountId)
  const selectedPlan = tradingPlans.find((p) => String(p.id) === tradingPlanId)

  // Available pairs come from the selected trading plan
  const availablePairs = selectedPlan?.pairs || []

  const createMutation = useMutation({
    mutationFn: createAutotraders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['autotraders'] })
      navigate('/autotraders')
    },
  })

  // Reset dependent state when market changes
  const handleMarketChange = (m: 'Spot' | 'Futures') => {
    setMarket(m)
    setAccountId('')
    setTradingPlanId('')
    setPairs([])
  }

  const addPair = () => {
    if (availablePairs.length === 0) return
    const defaultPair = availablePairs[0]
    setPairs((prev) => [
      ...prev,
      {
        pairId: String(defaultPair.id),
        label: `${defaultPair.base_asset}/${defaultPair.quote_asset}`,
        symbol: defaultPair.symbol,
        tradeAmount: '',
        leverage: '10',
        leverageType: 'Cross',
        marginMode: 'cross',
        positionMode: 'one_way',
      },
    ])
  }

  const updatePairField = <K extends keyof PairRow>(index: number, field: K, value: PairRow[K]) => {
    setPairs((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)))
  }

  const removePair = (index: number) => {
    setPairs((prev) => prev.filter((_, i) => i !== index))
  }

  const handleConnectNewExchange = () => {
    navigate('/accounts')
    openAddAccount()
  }

  const handleCreate = () => {
    if (!accountId || !tradingPlanId || pairs.length === 0) return
    createMutation.mutate({
      exchange_id: Number(accountId),
      trading_plan_id: Number(tradingPlanId),
      market: market.toLowerCase(),
      pairs: pairs.map((p) => ({
        symbol: p.symbol,
        pair: p.label.replace('/', '_'),
        initial_investment: p.tradeAmount,
        leverage: parseInt(p.leverage) || 1,
        leverage_type: p.leverageType.toUpperCase(),
        margin_mode: p.marginMode,
        position_mode: p.positionMode,
      })),
    })
  }

  return (
    <div className="flex flex-col gap-0 min-h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-6">
        <button
          onClick={() => navigate('/autotraders')}
          className="text-green hover:text-primary transition-colors cursor-pointer"
        >
          Autotraders
        </button>
        <span className="text-muted">&gt;</span>
        <span className="text-primary">New</span>
      </div>

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-primary text-lg font-semibold">Autotrader Configurator</h2>
        {/* Market toggle — top right */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg"
          style={{ backgroundColor: 'var(--color-bg-page)', border: '1px solid var(--color-border-subtle)' }}
        >
          {(['Spot', 'Futures'] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleMarketChange(m)}
              className="px-4 py-1.5 rounded-md text-xs font-semibold transition-colors"
              style={
                market === m
                  ? { backgroundColor: 'var(--color-accent-green-dim)', color: '#fff' }
                  : { backgroundColor: 'transparent', color: 'var(--color-text-secondary)' }
              }
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Two-column layout: form + preview */}
      <div className="flex gap-6 items-start">
        {/* Left: form sections */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          {/* Exchange */}
          <div className="card flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-primary text-sm font-semibold">Exchange</h3>
                <p className="text-muted text-xs mt-0.5">Select an exchange compatible with the chosen market.</p>
              </div>
              <button
                type="button"
                onClick={handleConnectNewExchange}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90 shrink-0"
                style={{ border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-primary)', backgroundColor: 'transparent' }}
              >
                Connect New Exchange
              </button>
            </div>
            <ExchangeDropdown
              accounts={accounts}
              value={accountId}
              onChange={setAccountId}
              onConnectNew={handleConnectNewExchange}
            />
          </div>

          {/* Trading Plan */}
          <div className="card flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-primary text-sm font-semibold">Trading Plan</h3>
                <p className="text-muted text-xs mt-0.5">Pick a plan that matches your execution style.</p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors shrink-0"
                style={{ border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-primary)', backgroundColor: 'transparent' }}
              >
                Create Trading Plan
              </button>
            </div>
            <TradingPlanDropdown
              plans={tradingPlans}
              value={tradingPlanId}
              onChange={(id) => { setTradingPlanId(id); setPairs([]) }}
            />
          </div>

          {/* Pairs Configuration */}
          <div className="card flex flex-col gap-4">
            <div>
              <h3 className="text-primary text-sm font-semibold">Pairs Configuration</h3>
              <p className="text-muted text-xs mt-0.5">Each pair represents an individual autotrader instance.</p>
            </div>

            {!selectedPlan ? (
              <p className="text-muted text-xs py-2">Select a trading plan first to configure pairs.</p>
            ) : (
              <>
                {/* Table header */}
                <div
                  className="grid text-muted text-xs uppercase tracking-wider pb-2"
                  style={{
                    gridTemplateColumns: market === 'Futures'
                      ? '1.5fr 1fr 1fr 1fr 40px'
                      : '2fr 1fr 40px',
                    borderBottom: '1px solid var(--color-border-subtle)',
                  }}
                >
                  <span>Pair</span>
                  <span>Trade Amount (USD)</span>
                  {market === 'Futures' && <span>Leverage</span>}
                  {market === 'Futures' && <span>Leverage Type</span>}
                  <span />
                </div>

                {/* Pair rows */}
                {pairs.length === 0 ? (
                  <p className="text-muted text-xs py-2">Add pairs to spin up new autotraders.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {pairs.map((row, i) => (
                      <div
                        key={i}
                        className="grid items-center gap-3"
                        style={{
                          gridTemplateColumns: market === 'Futures'
                            ? '1.5fr 1fr 1fr 1fr 40px'
                            : '2fr 1fr 40px',
                        }}
                      >
                        {/* Pair select */}
                        <div className="relative">
                          <select
                            value={row.pairId}
                            onChange={(e) => {
                              const pair = availablePairs.find((p) => String(p.id) === e.target.value)
                              if (pair) {
                                updatePairField(i, 'pairId', String(pair.id))
                                updatePairField(i, 'label', `${pair.base_asset}/${pair.quote_asset}`)
                                updatePairField(i, 'symbol', pair.symbol)
                              }
                            }}
                            className="w-full text-primary text-sm rounded-lg px-3 py-2 appearance-none pr-8"
                            style={{
                              backgroundColor: 'var(--color-bg-page)',
                              border: '1px solid var(--color-border-subtle)',
                              outline: 'none',
                            }}
                          >
                            {availablePairs.map((p) => (
                              <option key={p.id} value={String(p.id)} style={{ backgroundColor: '#22223a' }}>
                                {p.base_asset}/{p.quote_asset}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-secondary" />
                        </div>

                        {/* Trade amount */}
                        <input
                          type="number"
                          min="0"
                          placeholder="e.g. 100"
                          value={row.tradeAmount}
                          onChange={(e) => updatePairField(i, 'tradeAmount', e.target.value)}
                          className="text-primary text-sm rounded-lg px-3 py-2"
                          style={{
                            backgroundColor: 'var(--color-bg-page)',
                            border: '1px solid var(--color-border-subtle)',
                            outline: 'none',
                          }}
                          onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent-green-dim)')}
                          onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-subtle)')}
                        />

                        {market === 'Futures' && (
                          <>
                            {/* Leverage */}
                            <input
                              type="number"
                              min="1"
                              max="125"
                              placeholder="e.g. 10"
                              value={row.leverage}
                              onChange={(e) => updatePairField(i, 'leverage', e.target.value)}
                              className="text-primary text-sm rounded-lg px-3 py-2"
                              style={{
                                backgroundColor: 'var(--color-bg-page)',
                                border: '1px solid var(--color-border-subtle)',
                                outline: 'none',
                              }}
                              onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent-green-dim)')}
                              onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-subtle)')}
                            />

                            {/* Leverage type */}
                            <div className="relative">
                              <select
                                value={row.leverageType}
                                onChange={(e) => updatePairField(i, 'leverageType', e.target.value as 'Cross' | 'Isolated')}
                                className="w-full text-primary text-sm rounded-lg px-3 py-2 appearance-none pr-8"
                                style={{
                                  backgroundColor: 'var(--color-bg-page)',
                                  border: '1px solid var(--color-border-subtle)',
                                  outline: 'none',
                                }}
                              >
                                <option value="Cross" style={{ backgroundColor: '#22223a' }}>Cross</option>
                                <option value="Isolated" style={{ backgroundColor: '#22223a' }}>Isolated</option>
                              </select>
                              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-secondary" />
                            </div>
                          </>
                        )}

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removePair(i)}
                          className="flex items-center justify-center text-muted hover:text-red transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add pair */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addPair}
                    disabled={availablePairs.length === 0}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                    style={{ border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-primary)', backgroundColor: 'transparent' }}
                  >
                    <Plus size={13} />
                    Add Pair
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer CTA */}
          <div className="card flex items-center justify-between">
            <div>
              <p className="text-primary text-sm font-semibold">Ready to create new autotraders?</p>
              <p className="text-muted text-xs mt-0.5">Changes reflect instantly on the right-hand preview.</p>
              {createMutation.isError && (
                <p className="text-red text-xs mt-1">Error: {(createMutation.error as Error).message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleCreate}
              disabled={createMutation.isPending || !accountId || !tradingPlanId || pairs.length === 0}
              className="text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-accent-green-dim)', color: '#fff' }}
            >
              {createMutation.isPending ? 'Creating...' : `Create Autotrader${pairs.length > 1 ? 's' : ''}`}
            </button>
          </div>
        </div>

        {/* Right: live preview */}
        <div className="w-72 shrink-0">
          <PreviewPanel
            market={market}
            account={selectedAccount}
            plan={selectedPlan}
            pairs={pairs}
          />
        </div>
      </div>

      {/* Trading plan drawer + backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-30"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <TradingPlanDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCreated={(planId) => setTradingPlanId(String(planId))}
      />
    </div>
  )
}
