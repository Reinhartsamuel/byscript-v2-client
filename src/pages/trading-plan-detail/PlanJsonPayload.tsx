import { useMemo, useState } from 'react'
import { Check, Copy, Link } from 'lucide-react'
import type { TradingPlan } from '@/lib/api'

const ACTIONS = ['BUY', 'SELL', 'CLOSE', 'CANCEL'] as const
type Action = (typeof ACTIONS)[number]

const WEBHOOK_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.byscript.io'

export default function PlanJsonPayload({
  tradingPlan,
  keyInfo,
}: {
  tradingPlan: TradingPlan
  keyInfo: {
    key_id: number
    key: string
    secret: string
  } | null
}) {
  const [selectedAction, setSelectedAction] = useState<Action>('BUY')
  const [copied, setCopied] = useState(false)
  const [urlCopied, setUrlCopied] = useState(false)

  const webhookUrl = `${WEBHOOK_BASE_URL}/webhook/public-signal`

  const payload = useMemo(() => {
    const base: Record<string, unknown> = {
      key_id: keyInfo?.key_id ?? '<key_id>',
      secret: keyInfo?.secret ?? '<secret>',
      event_id: '{{strategy.order.id}}',
      action: selectedAction,
    }

    if ((tradingPlan.pairs || []).length > 0) {
      base.pair_symbol = tradingPlan.pairs[0].symbol
    }

    if (selectedAction === 'BUY' || selectedAction === 'SELL') {
      return {
        ...base,
        order_type: 'market',
        market_price: '{{close}}',
        take_profit: {
          enabled: true,
          price: '{{takeProfitPrice}}',
          price_type: 'mark',
        },
        stop_loss: {
          enabled: true,
          price: '{{stopLossPrice}}',
          price_type: 'mark',
        },
      }
    }

    return base
  }, [keyInfo, selectedAction, tradingPlan.pairs])

  const payloadJson = JSON.stringify(payload, null, 2)

  return (
    <div className="card">
      <p className="text-muted text-xs uppercase tracking-wide mb-4">Plan Webhook JSON Payload</p>

      <label className="text-muted text-xs block mb-2">Webhook URL</label>
      <div
        className="mb-4"
        style={{
          backgroundColor: 'var(--color-bg-base)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: '8px',
          padding: '12px 16px',
          fontFamily: 'monospace',
        }}
      >
        <span className="text-sm" style={{ color: 'var(--color-text-primary)', wordBreak: 'break-all' }}>
          {webhookUrl}
        </span>
      </div>
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(webhookUrl)
          setUrlCopied(true)
          setTimeout(() => setUrlCopied(false), 2000)
        }}
        className="flex items-center justify-center gap-2 text-sm font-semibold w-full cursor-pointer transition-colors mb-6"
        style={{
          backgroundColor: urlCopied ? 'var(--color-accent-green-dim)' : 'var(--color-accent-green)',
          color: '#ffffff',
          padding: '10px 0',
          borderRadius: '8px',
          border: 'none',
        }}
      >
        {urlCopied ? <Check size={16} /> : <Link size={16} />}
        {urlCopied ? 'Copied!' : 'Copy Webhook URL'}
      </button>

      <label className="text-muted text-xs block mb-2">TradingView action</label>
      <div className="flex gap-2 mb-4">
        {ACTIONS.map((action) => (
          <button
            key={action}
            onClick={() => setSelectedAction(action)}
            className="flex-1 text-xs font-medium py-2 rounded-lg cursor-pointer transition-colors"
            style={{
              backgroundColor: action === selectedAction ? 'var(--color-accent-green-bg)' : 'transparent',
              color: action === selectedAction ? 'var(--color-accent-green)' : 'var(--color-text-secondary)',
              border: action === selectedAction ? '1px solid var(--color-accent-green)' : '1px solid var(--color-border-subtle)',
            }}
          >
            {action}
          </button>
        ))}
      </div>

      <pre
        className="text-sm mb-4"
        style={{
          backgroundColor: 'var(--color-bg-base)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: '8px',
          padding: '16px',
          overflowX: 'auto',
          color: 'var(--color-accent-green)',
          fontFamily: 'monospace',
        }}
      >
        {payloadJson}
      </pre>

      <button
        onClick={async () => {
          await navigator.clipboard.writeText(payloadJson)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }}
        className="flex items-center justify-center gap-2 text-sm font-semibold w-full cursor-pointer transition-colors"
        style={{
          backgroundColor: copied ? 'var(--color-accent-green-dim)' : 'var(--color-accent-green)',
          color: '#ffffff',
          padding: '10px 0',
          borderRadius: '8px',
          border: 'none',
        }}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'Copied!' : 'Copy Payload'}
      </button>
    </div>
  )
}
