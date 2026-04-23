import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, CheckCircle2, Edit3, Loader2, Plus, Trash2 } from 'lucide-react'
import { createTradingPlan, deleteTradingPlan, getMyTradingPlans, queryTradingPlans, updateTradingPlan } from '@/lib/api'

interface PlanPairFormState {
  base: string
  quote: string
  symbol: string
}

interface PlanFormState {
  name: string
  description: string
  strategy: string
  visibility: 'PRIVATE' | 'UNLISTED' | 'PUBLIC'
  pairs: PlanPairFormState[]
}

const INITIAL_FORM: PlanFormState = {
  name: '',
  description: '',
  strategy: '',
  visibility: 'PRIVATE',
  pairs: [],
}

interface TradingPlanRow {
  id: number
  owner_user_id: number
  name: string
  description: string | null
  strategy: string | null
  visibility: string | null
  total_followers: number | null
  created_at: string | null
  pairs: { id: number; symbol: string }[]
}

function TradingPlanForm({
  mode,
  initial,
  isPending,
  error,
  onCancel,
  onSubmit,
}: {
  mode: 'create' | 'edit'
  initial: PlanFormState
  isPending: boolean
  error: string | null
  onCancel: () => void
  onSubmit: (value: PlanFormState) => void
}) {
  const [form, setForm] = useState<PlanFormState>(initial)
  const [baseInput, setBaseInput] = useState('')
  const [quoteInput, setQuoteInput] = useState('USDT')

  const addPair = () => {
    const base = baseInput.trim().toUpperCase()
    const quote = quoteInput.trim().toUpperCase()
    if (!base || !quote) return

    const symbol = `${base}${quote}`
    const exists = form.pairs.some((pair) => pair.symbol === symbol)
    if (exists) return

    setForm((prev) => ({
      ...prev,
      pairs: [...prev.pairs, { base, quote, symbol }],
    }))
    setBaseInput('')
  }

  const removePair = (symbol: string) => {
    setForm((prev) => ({
      ...prev,
      pairs: prev.pairs.filter((pair) => pair.symbol !== symbol),
    }))
  }

  return (
    <div
      className="rounded-xl p-4"
      style={{
        border: '1px solid var(--color-border-subtle)',
        backgroundColor: 'var(--color-bg-card)',
      }}
    >
      <p className="text-primary text-sm font-semibold mb-3">{mode === 'create' ? 'Create Trading Plan' : 'Edit Trading Plan'}</p>
      <div className="flex flex-col gap-3">
        <input
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Plan name"
          className="px-3 py-2 rounded-lg text-sm"
          style={{
            border: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-bg-page)',
            color: 'var(--color-text-primary)',
          }}
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="Description"
          rows={3}
          className="px-3 py-2 rounded-lg text-sm"
          style={{
            border: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-bg-page)',
            color: 'var(--color-text-primary)',
            resize: 'vertical',
          }}
        />
        <input
          value={form.strategy}
          onChange={(e) => setForm((p) => ({ ...p, strategy: e.target.value }))}
          placeholder="Strategy"
          className="px-3 py-2 rounded-lg text-sm"
          style={{
            border: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-bg-page)',
            color: 'var(--color-text-primary)',
          }}
        />
        <select
          value={form.visibility}
          onChange={(e) => setForm((p) => ({ ...p, visibility: e.target.value as PlanFormState['visibility'] }))}
          className="px-3 py-2 rounded-lg text-sm"
          style={{
            border: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-bg-page)',
            color: 'var(--color-text-primary)',
          }}
        >
          <option value="PRIVATE">PRIVATE</option>
          <option value="UNLISTED">UNLISTED</option>
          <option value="PUBLIC">PUBLIC</option>
        </select>

        {mode === 'create' ? (
          <div
            className="rounded-lg p-3 flex flex-col gap-2"
            style={{ border: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-page)' }}
          >
            <p className="text-xs text-muted">Trading pairs</p>
            <div className="flex gap-2">
              <input
                value={baseInput}
                onChange={(e) => setBaseInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addPair() }}
                placeholder="Base (e.g. BTC)"
                className="px-3 py-2 rounded-lg text-sm flex-1"
                style={{
                  border: '1px solid var(--color-border-subtle)',
                  backgroundColor: 'var(--color-bg-card)',
                  color: 'var(--color-text-primary)',
                }}
              />
              <input
                value={quoteInput}
                onChange={(e) => setQuoteInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addPair() }}
                placeholder="Quote"
                className="px-3 py-2 rounded-lg text-sm w-28"
                style={{
                  border: '1px solid var(--color-border-subtle)',
                  backgroundColor: 'var(--color-bg-card)',
                  color: 'var(--color-text-primary)',
                }}
              />
              <button
                type="button"
                onClick={addPair}
                className="px-3 py-2 rounded-lg text-xs font-semibold"
                style={{ border: '1px solid var(--color-accent-green)', color: 'var(--color-accent-green)' }}
              >
                Add Pair
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.pairs.map((pair) => (
                <span
                  key={pair.symbol}
                  className="text-xs px-2 py-1 rounded-full inline-flex items-center gap-1"
                  style={{ border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)' }}
                >
                  {pair.base}/{pair.quote}
                  <button
                    type="button"
                    onClick={() => removePair(pair.symbol)}
                    className="inline-flex items-center"
                    style={{ color: '#ef4444' }}
                    aria-label={`Remove ${pair.base}/${pair.quote}`}
                  >
                    <Trash2 size={11} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {error ? (
          <div
            className="text-xs rounded-lg px-3 py-2 flex items-start gap-2"
            style={{
              border: '1px solid rgba(239,68,68,0.35)',
              backgroundColor: 'rgba(239,68,68,0.08)',
              color: '#fca5a5',
            }}
          >
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            type="button"
            disabled={isPending}
            className="px-3 py-2 rounded-lg text-xs"
            style={{ border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)', opacity: isPending ? 0.65 : 1 }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(form)}
            type="button"
            disabled={isPending || !form.name.trim() || !form.description.trim() || (mode === 'create' && form.pairs.length === 0)}
            className="px-3 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
            style={{
              border: '1px solid var(--color-accent-green)',
              backgroundColor: 'var(--color-accent-green)',
              color: '#fff',
              opacity: isPending ? 0.7 : 1,
            }}
          >
            {isPending ? <Loader2 size={12} className="animate-spin" /> : null}
            {isPending ? 'Saving plan...' : mode === 'create' ? 'Create' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TradingPlans() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'public' | 'mine'>('public')
  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState<TradingPlanRow | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { data: myPlans = [], isLoading: myLoading, isError: myError, error: myErrorObj } = useQuery({
    queryKey: ['trading-plans', 'mine'],
    queryFn: getMyTradingPlans,
    staleTime: 1000 * 60 * 2,
    select: (res): TradingPlanRow[] => res?.data || [],
  })

  const { data: publicPlans = [], isLoading: publicLoading, isError: publicError, error: publicErrorObj } = useQuery({
    queryKey: ['trading-plans', 'public'],
    queryFn: () => queryTradingPlans({ visibility: 'PUBLIC', sort_by: 'created_at', sort_order: 'desc', limit: 100 }),
    staleTime: 1000 * 60 * 2,
    select: (res): TradingPlanRow[] => res?.data || [],
  })

  const currentUserId = useMemo(() => {
    try {
      const raw = localStorage.getItem('user')
      if (!raw) return null
      const parsed = JSON.parse(raw)
      const id = Number(parsed?.id)
      return Number.isFinite(id) ? id : null
    } catch {
      return null
    }
  }, [])

  const createMutation = useMutation({
    mutationFn: createTradingPlan,
    onMutate: () => {
      setSuccessMessage(null)
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['trading-plans', 'mine'] })
      queryClient.invalidateQueries({ queryKey: ['trading-plans', 'public'] })
      setShowCreate(false)
      setSuccessMessage(`Trading plan "${result?.data?.name || 'New plan'}" created successfully.`)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { name?: string; description?: string; strategy?: string; visibility?: string } }) =>
      updateTradingPlan(String(id), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading-plans', 'mine'] })
      queryClient.invalidateQueries({ queryKey: ['trading-plans', 'public'] })
      setEditTarget(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTradingPlan(String(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading-plans', 'mine'] })
      queryClient.invalidateQueries({ queryKey: ['trading-plans', 'public'] })
    },
  })

  const isLoading = activeTab === 'mine' ? myLoading : publicLoading
  const isError = activeTab === 'mine' ? myError : publicError
  const tabError = activeTab === 'mine' ? myErrorObj : publicErrorObj
  const plans = activeTab === 'mine' ? myPlans : publicPlans

  if (isLoading) return <div className="p-8 text-center text-muted">Loading trading plans...</div>
  if (isError) return <div className="p-8 text-red">Error: {(tabError as Error).message}</div>

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-primary text-lg font-semibold">Trading Plans</h2>
          <p className="text-muted text-sm">Browse public plans or manage your own plans.</p>
        </div>
        {activeTab === 'mine' ? (
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="text-xs px-3 py-2 rounded-full flex items-center gap-1"
            style={{
              border: '1px solid #4ade80',
              color: '#4ade80',
              backgroundColor: 'transparent',
            }}
          >
            <Plus size={14} />
            Add Trading Plan
          </button>
        ) : null}
      </div>

      {successMessage ? (
        <div
          className="rounded-lg px-3 py-2 text-xs inline-flex items-center gap-2"
          style={{
            border: '1px solid rgba(74,222,128,0.35)',
            backgroundColor: 'rgba(74,222,128,0.1)',
            color: '#86efac',
          }}
        >
          <CheckCircle2 size={14} />
          {successMessage}
        </div>
      ) : null}

      <div
        className="flex items-center gap-2 pb-3"
        style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
      >
        <button
          onClick={() => setActiveTab('public')}
          className="px-3 py-1.5 rounded text-xs font-semibold"
          style={{
            border: activeTab === 'public' ? '1px solid var(--color-accent-green)' : '1px solid var(--color-border-subtle)',
            backgroundColor: activeTab === 'public' ? 'var(--color-accent-green-bg)' : 'transparent',
            color: activeTab === 'public' ? 'var(--color-accent-green)' : 'var(--color-text-secondary)',
          }}
        >
          Public Trading Plan
        </button>
        <button
          onClick={() => setActiveTab('mine')}
          className="px-3 py-1.5 rounded text-xs font-semibold"
          style={{
            border: activeTab === 'mine' ? '1px solid var(--color-accent-green)' : '1px solid var(--color-border-subtle)',
            backgroundColor: activeTab === 'mine' ? 'var(--color-accent-green-bg)' : 'transparent',
            color: activeTab === 'mine' ? 'var(--color-accent-green)' : 'var(--color-text-secondary)',
          }}
        >
          My Trading Plan
        </button>
      </div>

      {activeTab === 'mine' && showCreate ? (
        <TradingPlanForm
          mode="create"
          initial={INITIAL_FORM}
          isPending={createMutation.isPending}
          error={createMutation.isError ? (createMutation.error as Error).message : null}
          onCancel={() => setShowCreate(false)}
          onSubmit={(value) => {
            createMutation.mutate({
              name: value.name.trim(),
              description: value.description.trim() || undefined,
              strategy: value.strategy.trim() || undefined,
              visibility: value.visibility,
              pairs: value.pairs.map((pair) => ({
                base_asset: pair.base,
                quote_asset: pair.quote,
                symbol: pair.symbol,
              })),
            })
          }}
        />
      ) : null}

      {activeTab === 'mine' && editTarget ? (
        <TradingPlanForm
          mode="edit"
          initial={{
            name: editTarget.name,
            description: editTarget.description || '',
            strategy: editTarget.strategy || '',
            visibility: (editTarget.visibility?.toUpperCase() as PlanFormState['visibility']) || 'PRIVATE',
            pairs: [],
          }}
          isPending={updateMutation.isPending}
          error={updateMutation.isError ? (updateMutation.error as Error).message : null}
          onCancel={() => setEditTarget(null)}
          onSubmit={(value) => {
            updateMutation.mutate({
              id: editTarget.id,
              payload: {
                name: value.name.trim(),
                description: value.description.trim(),
                strategy: value.strategy.trim(),
                visibility: value.visibility,
              },
            })
          }}
        />
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const isOwner = currentUserId != null && plan.owner_user_id === currentUserId

          if (activeTab === 'public') {
            return (
              <div
                key={plan.id}
                className="rounded-xl p-4 flex flex-col gap-3"
                style={{
                  border: '1px solid rgba(59,130,246,0.25)',
                  background: 'linear-gradient(180deg, rgba(59,130,246,0.08), rgba(59,130,246,0.03))',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-primary font-semibold truncate">{plan.name}</p>
                    <p className="text-muted text-xs mt-1">
                      PUBLIC • {(plan.pairs || []).length} pairs • {plan.total_followers ?? 0} followers
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded" style={{ border: '1px solid #3b82f6', color: '#3b82f6' }}>
                    MARKET
                  </span>
                </div>

                <p className="text-secondary text-sm min-h-10">{plan.description || 'No description.'}</p>
                <div className="text-xs text-muted">Strategy: {plan.strategy || '—'}</div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => navigate(`/trading-plans/${plan.id}`)}
                    className="px-2.5 py-1.5 rounded text-xs"
                    style={{ border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)' }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/autotraders/new?trading_plan_id=${plan.id}`)}
                    className="px-2.5 py-1.5 rounded text-xs"
                    style={{ border: '1px solid #3b82f6', color: '#3b82f6' }}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            )
          }

          return (
            <div
              key={plan.id}
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{
                border: '1px solid var(--color-border-subtle)',
                backgroundColor: 'var(--color-bg-card)',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-primary font-semibold truncate">{plan.name}</p>
                  <p className="text-muted text-xs mt-1">
                    {plan.visibility || 'PRIVATE'} • {(plan.pairs || []).length} pairs • {plan.total_followers ?? 0} followers
                  </p>
                </div>
                {isOwner ? (
                  <span className="text-[10px] px-2 py-1 rounded" style={{ border: '1px solid #4ade80', color: '#4ade80' }}>
                    OWNER
                  </span>
                ) : null}
              </div>

              <p className="text-secondary text-sm min-h-10">{plan.description || 'No description.'}</p>

              <div className="text-xs text-muted">Strategy: {plan.strategy || '—'}</div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => navigate(`/trading-plans/${plan.id}`)}
                  className="px-2.5 py-1.5 rounded text-xs"
                  style={{ border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)' }}
                >
                  View Details
                </button>

                {isOwner ? (
                  <>
                    <button
                      onClick={() => setEditTarget(plan)}
                      className="px-2.5 py-1.5 rounded text-xs inline-flex items-center gap-1"
                      style={{ border: '1px solid #f59e0b', color: '#f59e0b' }}
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        const ok = window.confirm(`Delete trading plan "${plan.name}"?`)
                        if (ok) deleteMutation.mutate(plan.id)
                      }}
                      disabled={deleteMutation.isPending}
                      className="px-2.5 py-1.5 rounded text-xs inline-flex items-center gap-1"
                      style={{ border: '1px solid #ef4444', color: '#ef4444', opacity: deleteMutation.isPending ? 0.6 : 1 }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      {plans.length === 0 ? (
        <div className="text-muted text-sm">
          {activeTab === 'public' ? 'No public trading plans available.' : 'No trading plans yet.'}
        </div>
      ) : null}
    </div>
  )
}
