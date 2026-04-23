import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Check, Copy, KeyRound } from 'lucide-react'
import { createTradingPlanKey, getTradingPlanById, TradingPlan } from '@/lib/api'
import PlanJsonPayload from '@/pages/trading-plan-detail/PlanJsonPayload'

interface GeneratedKeyData {
  key_id: number
  key: string
  secret: string
  rate_limit: number
  created_at: string | null
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
      style={{ border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)' }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copied' : label}
    </button>
  )
}

export default function TradingPlanDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [generatedKey, setGeneratedKey] = useState<GeneratedKeyData | null>(null)

  const { data: tradingPlan, isLoading, isError, error } = useQuery({
    queryKey: ['trading-plan-detail', id],
    queryFn: () => getTradingPlanById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
    select: (res): TradingPlan => {
      const row = res?.data || {}
      return {
        ...row,
        pairs: row?.pairs || [],
      }
    },
  })

  const currentUserId = useMemo(() => {
    try {
      const raw = localStorage.getItem('user')
      if (!raw) return null
      const parsed = JSON.parse(raw)
      const userId = Number(parsed?.id)
      return Number.isFinite(userId) ? userId : null
    } catch {
      return null
    }
  }, [])

  const isOwner = !!tradingPlan && currentUserId != null && tradingPlan.owner_user_id === currentUserId

  const createKeyMutation = useMutation({
    mutationFn: () => createTradingPlanKey(id!),
    onSuccess: (res) => {
      setGeneratedKey({
        key_id: res.data.key_id,
        key: res.data.key,
        secret: res.data.secret,
        rate_limit: res.data.rate_limit,
        created_at: res.data.created_at,
      })
    },
  })

  if (isLoading) return <div className="p-8 text-center text-muted">Loading trading plan...</div>
  if (isError) return <div className="p-8 text-red">Error: {(error as Error).message}</div>
  if (!tradingPlan) return <div className="p-8 text-muted">Trading plan not found.</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-xs">
        <button onClick={() => navigate('/trading-plans')} className="text-green hover:text-primary transition-colors">
          trading-plans
        </button>
        <span className="text-muted">&gt;</span>
        <span className="text-primary">{tradingPlan.name}</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        <div className="flex flex-col gap-4">
          <div className="card">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-primary text-lg font-semibold">{tradingPlan.name}</h2>
              <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)' }}>
                {tradingPlan.visibility || 'PRIVATE'}
              </span>
            </div>
            <p className="text-secondary text-sm mb-2">{tradingPlan.description || 'No description available.'}</p>
            <p className="text-muted text-xs">Strategy: {tradingPlan.strategy || '—'}</p>
            <p className="text-muted text-xs mt-1">Followers: {tradingPlan.total_followers ?? 0}</p>
          </div>

          <div className="card">
            <p className="text-primary text-sm font-semibold mb-3">Pairs</p>
            <div className="flex flex-wrap gap-2">
              {(tradingPlan.pairs || []).length === 0 ? (
                <p className="text-muted text-sm">No pairs configured.</p>
              ) : (
                tradingPlan.pairs.map((pair) => (
                  <span
                    key={pair.id}
                    className="px-2.5 py-1 rounded text-xs"
                    style={{
                      border: '1px solid var(--color-border-subtle)',
                      color: 'var(--color-text-secondary)',
                      backgroundColor: 'var(--color-bg-page)',
                    }}
                  >
                    {pair.symbol}
                  </span>
                ))
              )}
            </div>
          </div>

          {isOwner ? (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-primary text-sm font-semibold">Webhook Key Management</p>
                <button
                  onClick={() => createKeyMutation.mutate()}
                  disabled={createKeyMutation.isPending}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold"
                  style={{
                    border: '1px solid var(--color-accent-green)',
                    backgroundColor: 'var(--color-accent-green)',
                    color: '#fff',
                    opacity: createKeyMutation.isPending ? 0.65 : 1,
                  }}
                >
                  <KeyRound size={14} />
                  {createKeyMutation.isPending ? 'Generating...' : 'Generate Webhook Key'}
                </button>
              </div>

              <p className="text-muted text-xs mb-3">Generate a key for TradingView plan webhook auth. Secret is only shown once.</p>

              {createKeyMutation.isError ? (
                <p className="text-red text-xs mb-3">{(createKeyMutation.error as Error).message}</p>
              ) : null}

              {generatedKey ? (
                <div className="rounded-lg p-3 flex flex-col gap-3" style={{ border: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-page)' }}>
                  <div>
                    <p className="text-muted text-xs mb-1">key_id</p>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-primary text-xs">{generatedKey.key_id}</code>
                      <CopyButton value={String(generatedKey.key_id)} label="Copy key_id" />
                    </div>
                  </div>

                  <div>
                    <p className="text-muted text-xs mb-1">key</p>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-primary text-xs break-all">{generatedKey.key}</code>
                      <CopyButton value={generatedKey.key} label="Copy key" />
                    </div>
                  </div>

                  <div>
                    <p className="text-muted text-xs mb-1">secret</p>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-primary text-xs break-all">{generatedKey.secret}</code>
                      <CopyButton value={generatedKey.secret} label="Copy secret" />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          {isOwner ? (
            <PlanJsonPayload
              tradingPlan={tradingPlan}
              keyInfo={generatedKey}
            />
          ) : (
            <div className="card">
              <p className="text-muted text-xs">Webhook key and payload setup is visible only to plan owner.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
