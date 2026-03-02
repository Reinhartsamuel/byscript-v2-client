import { useState } from 'react'
import { Copy, Check, Link } from 'lucide-react'
import { AutotraderDetailData } from '@/data/mockData'

const ACTIONS = ['BUY', 'SELL', 'CLOSE', 'CANCEL'] as const
type Action = (typeof ACTIONS)[number]

const WEBHOOK_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.byscript.io'

interface JsonPayloadProps {
  data: AutotraderDetailData
}

export default function JsonPayload({ data }: JsonPayloadProps) {
  const [selectedAction, setSelectedAction] = useState<Action>('BUY')
  const [copied, setCopied] = useState(false)
  const [urlCopied, setUrlCopied] = useState(false)

  const webhookUrl = `${WEBHOOK_BASE_URL}/webhook/signal`

  const payload = JSON.stringify(
    {
      token: data.webhookToken ?? '<webhook_token>',
      action: selectedAction,
    },
    null,
    2,
  )

  const handleCopy = () => {
    navigator.clipboard.writeText(payload)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookUrl)
    setUrlCopied(true)
    setTimeout(() => setUrlCopied(false), 2000)
  }

  return (
    <div className="card">
      <p className="text-muted text-xs uppercase tracking-wide mb-4">JSON Payload Messages</p>

      {/* Webhook URL */}
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
        onClick={handleCopyUrl}
        className="flex items-center justify-center gap-2 text-sm font-semibold w-full cursor-pointer transition-colors mb-6"
        style={{
          backgroundColor: urlCopied
            ? 'var(--color-accent-green-dim)'
            : 'var(--color-accent-green)',
          color: '#000',
          padding: '10px 0',
          borderRadius: '8px',
          border: 'none',
        }}
      >
        {urlCopied ? <Check size={16} /> : <Link size={16} />}
        {urlCopied ? 'Copied!' : 'Copy Webhook URL'}
      </button>

      {/* Action buttons */}
      <label className="text-muted text-xs block mb-2">TradingView sent Action</label>
      <div className="flex gap-2 mb-4">
        {ACTIONS.map((action) => (
          <button
            key={action}
            onClick={() => setSelectedAction(action)}
            className="flex-1 text-xs font-medium py-2 rounded-lg cursor-pointer transition-colors"
            style={{
              backgroundColor:
                action === selectedAction ? 'var(--color-accent-green-bg)' : 'transparent',
              color:
                action === selectedAction
                  ? 'var(--color-accent-green)'
                  : 'var(--color-text-secondary)',
              border:
                action === selectedAction
                  ? '1px solid var(--color-accent-green)'
                  : '1px solid var(--color-border-subtle)',
            }}
          >
            {action}
          </button>
        ))}
      </div>

      {/* JSON code block */}
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
        {payload}
      </pre>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="flex items-center justify-center gap-2 text-sm font-semibold w-full cursor-pointer transition-colors"
        style={{
          backgroundColor: copied
            ? 'var(--color-accent-green-dim)'
            : 'var(--color-accent-green)',
          color: '#000',
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
