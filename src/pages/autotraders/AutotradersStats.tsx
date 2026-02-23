export default function AutotradersStats() {
  return (
    <div className="flex flex-col gap-4">
      {/* Total Autotraders */}
      <div className="card">
        <p className="text-muted text-xs uppercase tracking-wide mb-2">Total Autotraders</p>
        <p className="text-primary text-2xl font-bold mb-1">203</p>
        <p className="text-muted text-xs">Active / Total</p>
      </div>

      {/* Running */}
      <div className="card">
        <p className="text-muted text-xs uppercase tracking-wide mb-2">Running</p>
        <p className="text-primary text-2xl font-bold mb-1">0</p>
        <p className="text-muted text-xs">Running / Active Traders</p>
      </div>

      {/* Capital */}
      <div className="card">
        <p className="text-muted text-xs uppercase tracking-wide mb-2">Capital</p>
        <p className="text-primary text-2xl font-bold mb-1">$0</p>
        <p className="text-muted text-xs">Total Deposited Amount</p>
      </div>
    </div>
  )
}
