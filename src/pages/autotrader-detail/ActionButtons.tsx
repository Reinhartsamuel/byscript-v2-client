export default function ActionButtons() {
  return (
    <div className="flex gap-3">
      {/* Stop */}
      <button
        className="text-sm font-medium px-4 py-2 rounded-lg transition-colors text-white"
        style={{ backgroundColor: 'var(--color-accent-red)' }}
      >
        Stop
      </button>

      {/* Cancel All Pending Orders */}
      <button
        className="text-sm font-medium px-4 py-2 rounded-lg transition-colors text-white"
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #f59e0b',
          color: 'white',
        }}
      >
        Cancel All Pending Orders
      </button>

      {/* Close All Positions */}
      <button
        className="text-sm font-medium px-4 py-2 rounded-lg transition-colors text-white"
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #f59e0b',
          color: 'white',
        }}
      >
        Close All Positions
      </button>
    </div>
  )
}
