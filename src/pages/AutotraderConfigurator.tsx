import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, X, Search, Star, Check, Plus, Trash2 } from 'lucide-react'
import { useAddAccountModalStore } from '@/store/index'

// ── Mock data ────────────────────────────────────────────────

const MOCK_ACCOUNTS = [
  { id: '1', exchange: 'Binance', label: 'Binance', subLabel: 'Primary API •••• 4821', balance: 18240, market: ['Spot', 'Futures'] },
  { id: '2', exchange: 'Bybit', label: 'Bybit', subLabel: 'Main API •••• 3310', balance: 12500, market: ['Spot', 'Futures'] },
  { id: '3', exchange: 'OKX', label: 'OKX', subLabel: 'Trading API •••• 9912', balance: 7800, market: ['Spot', 'Futures'] },
  { id: '4', exchange: 'Bitget', label: 'Bitget', subLabel: 'Sub API •••• 5544', balance: 3200, market: ['Spot'] },
]

const MOCK_TRADING_PLANS = [
  { id: '1', name: 'Momentum Core', market: 'Spot', pairsCount: 10 },
  { id: '2', name: 'Mean Reversion', market: 'Spot', pairsCount: 25 },
  { id: '3', name: 'Momentum Turbo', market: 'Futures', pairsCount: 15 },
  { id: '4', name: 'Hedged Breakout', market: 'Futures', pairsCount: 8 },
  { id: '5', name: 'Scalp Elite', market: 'Spot', pairsCount: 20 },
]

const SPOT_PAIRS = [
  { id: 'btc', base: 'BTC', quote: 'USDT', label: 'BTC/USDT' },
  { id: 'eth', base: 'ETH', quote: 'USDT', label: 'ETH/USDT' },
  { id: 'sol', base: 'SOL', quote: 'USDT', label: 'SOL/USDT' },
  { id: 'ava', base: 'AVA', quote: 'USDT', label: 'AVA/USDT' },
  { id: 'bnb', base: 'BNB', quote: 'USDT', label: 'BNB/USDT' },
  { id: 'ada', base: 'ADA', quote: 'USDT', label: 'ADA/USDT' },
  { id: 'dot', base: 'DOT', quote: 'USDT', label: 'DOT/USDT' },
  { id: 'link', base: 'LINK', quote: 'USDT', label: 'LINK/USDT' },
]

const FUTURES_PAIRS = [
  { id: 'btcperp', base: 'BTC', quote: 'USDT', label: 'BTC/USDT' },
  { id: 'ethperp', base: 'ETH', quote: 'USDT', label: 'ETH/USDT' },
  { id: 'solperp', base: 'SOL', quote: 'USDT', label: 'SOL/USDT' },
  { id: 'xrpperp', base: 'XRP', quote: 'USDT', label: 'XRP/USDT' },
  { id: 'bnbperp', base: 'BNB', quote: 'USDT', label: 'BNB/USDT' },
  { id: 'avaxperp', base: 'AVAX', quote: 'USDT', label: 'AVAX/USDT' },
]

// ── Types ────────────────────────────────────────────────────

interface PairRow {
  pairId: string
  label: string
  tradeAmount: string
  leverage: string
  leverageType: 'Cross' | 'Isolated'
}

// ── Exchange Dropdown ─────────────────────────────────────────

function ExchangeDropdown({
  market,
  value,
  onChange,
  onConnectNew,
}: {
  market: 'Spot' | 'Futures'
  value: string
  onChange: (id: string) => void
  onConnectNew: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const filtered = MOCK_ACCOUNTS.filter((a) => a.market.includes(market))
  const selected = MOCK_ACCOUNTS.find((a) => a.id === value)

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
              {selected.exchange[0]}
            </div>
            <div className="text-left">
              <p className="text-primary text-sm font-medium">{selected.exchange}</p>
              <p className="text-muted text-xs">{selected.subLabel}</p>
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
          {filtered.map((acc) => (
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
                {acc.exchange[0]}
              </div>
              <div className="text-left flex-1">
                <p className="text-primary text-sm font-medium">{acc.exchange}</p>
                <p className="text-muted text-xs">{acc.subLabel}</p>
              </div>
              <span className="text-secondary text-xs">${acc.balance.toLocaleString()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Trading Plan Dropdown ─────────────────────────────────────

function TradingPlanDropdown({
  market,
  value,
  onChange,
}: {
  market: 'Spot' | 'Futures'
  value: string
  onChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const filtered = MOCK_TRADING_PLANS.filter((p) => p.market === market)
  const selected = MOCK_TRADING_PLANS.find((p) => p.id === value)

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
          {filtered.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => { onChange(plan.id); setOpen(false) }}
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
                <p className="text-muted text-xs">{plan.market} • Top {plan.pairsCount} pairs</p>
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
  market,
  open,
  onClose,
}: {
  market: 'Spot' | 'Futures'
  open: boolean
  onClose: () => void
}) {
  const [planName, setPlanName] = useState('')
  const [drawerMarket, setDrawerMarket] = useState<'Spot' | 'Futures'>(market)
  const [selectedPairs, setSelectedPairs] = useState<string[]>([])
  const [pairSearch, setPairSearch] = useState('')
  const [pairDropOpen, setPairDropOpen] = useState(false)
  const pairDropRef = useRef<HTMLDivElement>(null)

  // Sync drawer market when parent market changes
  useEffect(() => { setDrawerMarket(market) }, [market])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pairDropRef.current && !pairDropRef.current.contains(e.target as Node))
        setPairDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const currentPairs = drawerMarket === 'Spot' ? SPOT_PAIRS : FUTURES_PAIRS

  const filteredPairs = currentPairs.filter((p) =>
    p.label.toLowerCase().includes(pairSearch.toLowerCase())
  )

  const togglePair = (id: string) => {
    setSelectedPairs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const removePair = (id: string) => setSelectedPairs((prev) => prev.filter((x) => x !== id))

  const selectedPairObjects = currentPairs.filter((p) => selectedPairs.includes(p.id))

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

        {/* Market Compatibility */}
        <div className="flex flex-col gap-3">
          <p className="text-muted text-xs uppercase tracking-wide">Market Compatibility</p>
          <div className="flex gap-2">
            {(['Spot', 'Futures'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setDrawerMarket(m); setSelectedPairs([]) }}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={
                  drawerMarket === m
                    ? { backgroundColor: 'var(--color-accent-green-dim)', color: '#fff' }
                    : { backgroundColor: 'var(--color-bg-page)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-subtle)' }
                }
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Pair Selection */}
        <div className="flex flex-col gap-3">
          <p className="text-muted text-xs uppercase tracking-wide">Pair Selection</p>
          <p className="text-secondary text-xs">Select at least one pair.</p>

          {/* Selected pair chips */}
          {selectedPairObjects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedPairObjects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: 'var(--color-bg-page)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-primary)' }}
                >
                  {p.label}
                  <button type="button" onClick={() => removePair(p.id)} className="text-muted hover:text-primary transition-colors">
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
              <span className="text-secondary">{selectedPairs.length} pairs USDT</span>
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

          {/* Pair dropdown trigger */}
          <div ref={pairDropRef} className="relative">
            <button
              type="button"
              onClick={() => setPairDropOpen((o) => !o)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-muted"
              style={{
                backgroundColor: 'var(--color-bg-page)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <Search size={13} className="text-muted shrink-0" />
              <span>Search pairs</span>
            </button>

            {pairDropOpen && (
              <div
                className="absolute left-0 right-0 top-full mt-1 rounded-lg z-30 overflow-hidden flex flex-col"
                style={{
                  backgroundColor: 'var(--color-bg-page)',
                  border: '1px solid var(--color-border-subtle)',
                  maxHeight: 260,
                }}
              >
                {/* Search input inside dropdown */}
                <div
                  className="flex items-center gap-2 px-3 py-2.5"
                  style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                >
                  <Search size={13} className="text-muted shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={pairSearch}
                    onChange={(e) => setPairSearch(e.target.value)}
                    placeholder="Search pairs"
                    className="flex-1 text-xs text-primary bg-transparent outline-none"
                  />
                </div>
                <div className="overflow-y-auto">
                  {filteredPairs.map((pair) => {
                    const checked = selectedPairs.includes(pair.id)
                    return (
                      <button
                        key={pair.id}
                        type="button"
                        onClick={() => togglePair(pair.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors"
                      >
                        <Star size={13} className="text-muted shrink-0" />
                        <span className="text-muted text-xs font-mono w-8">{pair.base}</span>
                        <span className="text-primary text-xs flex-1 text-left">{pair.label}</span>
                        <span className="text-muted text-xs">{pair.quote}</span>
                        {checked && <Check size={13} className="text-green shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <p className="text-muted text-xs">Only these pairs will be available when creating autotraders using this plan.</p>
        </div>
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
          onClick={onClose}
          className="flex-1 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--color-accent-green-dim)', color: '#fff' }}
        >
          Save Trading Plan
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
  account: (typeof MOCK_ACCOUNTS)[number] | undefined
  plan: (typeof MOCK_TRADING_PLANS)[number] | undefined
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
              {account.exchange[0]}
            </div>
            <span className="text-primary text-xs">{account.exchange}</span>
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
                      <span className="text-muted text-xs">{row.leverageType} {row.leverage}×</span>
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
  const openAddAccount = useAddAccountModalStore((s) => s.openModal)

  const [market, setMarket] = useState<'Spot' | 'Futures'>('Spot')
  const [accountId, setAccountId] = useState('')
  const [tradingPlanId, setTradingPlanId] = useState('')
  const [pairs, setPairs] = useState<PairRow[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  const selectedAccount = MOCK_ACCOUNTS.find((a) => a.id === accountId)
  const selectedPlan = MOCK_TRADING_PLANS.find((p) => p.id === tradingPlanId)

  // Reset dependent state when market changes
  const handleMarketChange = (m: 'Spot' | 'Futures') => {
    setMarket(m)
    setAccountId('')
    setTradingPlanId('')
    setPairs([])
  }

  const availablePairs = market === 'Spot' ? SPOT_PAIRS : FUTURES_PAIRS

  const addPair = () => {
    const defaultPair = availablePairs[0]
    setPairs((prev) => [
      ...prev,
      {
        pairId: defaultPair.id,
        label: defaultPair.label,
        tradeAmount: '',
        leverage: '10',
        leverageType: 'Cross',
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
              market={market}
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
              market={market}
              value={tradingPlanId}
              onChange={setTradingPlanId}
            />
          </div>

          {/* Pairs Configuration */}
          <div className="card flex flex-col gap-4">
            <div>
              <h3 className="text-primary text-sm font-semibold">Pairs Configuration</h3>
              <p className="text-muted text-xs mt-0.5">Each pair represents an individual autotrader instance.</p>
            </div>

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
                          const pair = availablePairs.find((p) => p.id === e.target.value)
                          if (pair) updatePairField(i, 'pairId', pair.id)
                          if (pair) updatePairField(i, 'label', pair.label)
                        }}
                        className="w-full text-primary text-sm rounded-lg px-3 py-2 appearance-none pr-8"
                        style={{
                          backgroundColor: 'var(--color-bg-page)',
                          border: '1px solid var(--color-border-subtle)',
                          outline: 'none',
                        }}
                      >
                        {availablePairs.map((p) => (
                          <option key={p.id} value={p.id} style={{ backgroundColor: '#22223a' }}>
                            {p.label}
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
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                style={{ border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-primary)', backgroundColor: 'transparent' }}
              >
                <Plus size={13} />
                Add Pair
              </button>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="card flex items-center justify-between">
            <div>
              <p className="text-primary text-sm font-semibold">Ready to create new autotraders?</p>
              <p className="text-muted text-xs mt-0.5">Changes reflect instantly on the right-hand preview.</p>
            </div>
            <button
              type="button"
              className="text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--color-accent-green-dim)', color: '#fff' }}
            >
              Create Autotrader{pairs.length > 1 ? 's' : ''}
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
        market={market}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}
