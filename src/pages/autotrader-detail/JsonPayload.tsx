import { useState } from 'react'
import { Copy } from 'lucide-react'

export default function JsonPayload() {
  const [selectedAction, setSelectedAction] = useState('')

  const handleCopy = () => {
    const payload = {
      action: selectedAction,
      timestamp: new Date().toISOString(),
      strategy: 'Grid Cuentrus',
    }
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
  }

  return (
    <div className="card">
      <p className="text-muted text-xs uppercase tracking-wide mb-4">JSON Payload Messages</p>

      {/* Label */}
      <label className="text-muted text-xs block mb-2">Trading View sent Action</label>

      {/* Dropdown */}
      <div className="flex flex-col gap-2 relative mb-4">
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="text-primary text-sm bg-transparent border-b border-solid pr-6"
          style={{ borderColor: 'var(--color-border-subtle)', outline: 'none', appearance: 'none' }}
        >
          <option value="" style={{ backgroundColor: '#22223a', color: '#f0f0f0' }}>
            Select TradingView alert action to generate payload
          </option>
          <option value="BUY" style={{ backgroundColor: '#22223a', color: '#f0f0f0' }}>
            Buy
          </option>
          <option value="SELL" style={{ backgroundColor: '#22223a', color: '#f0f0f0' }}>
            Sell
          </option>
          <option value="CLOSE" style={{ backgroundColor: '#22223a', color: '#f0f0f0' }}>
            Close
          </option>
          <option value="CANCEL" style={{ backgroundColor: '#22223a', color: '#f0f0f0' }}>
            Cancel
          </option>
        </select>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        disabled={!selectedAction}
        className="flex items-center gap-2 text-green text-xs cursor-pointer hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Copy size={14} />
        Copy JSON
      </button>

      {/* Instruction text */}
      <p className="text-muted text-xs mt-3">
        Select an action to generate the JSON payload for TradingView webhooks
      </p>
    </div>
  )
}
