import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import { AutotraderListRow } from '@/data/mockData'
import { updateAutotraderStatus } from '@/lib/api'
import { darkToast } from '@/components/DarkToast'

interface AutotradersTableProps {
  data: AutotraderListRow[]
}

export default function AutotradersTable({ data }: AutotradersTableProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'stopped' }) =>
      updateAutotraderStatus(id, status),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['autotraders'] })
      darkToast.success(status === 'active' ? 'Autotrader started' : 'Autotrader stopped')
    },
    onError: (err: Error) => {
      darkToast.error(err.message)
    },
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [data])

  const totalPages = Math.max(Math.ceil(data.length / rowsPerPage), 21)
  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  return (
    <div className="card">
      <ToastContainer />
      {/* Header */}
      <div
        className="grid text-muted text-xs uppercase tracking-wider mb-2"
        style={{ gridTemplateColumns: '0.8fr 1.2fr 0.9fr 0.9fr 1fr 0.8fr 0.8fr 0.7fr 0.7fr 0.7fr' }}
      >
        <span>Status</span>
        <span>Trading Plan</span>
        <span>Pair</span>
        <span>Exchange</span>
        <span className="text-right">Capital</span>
        <span className="text-right">P&L ($)</span>
        <span className="text-right">Win Rate</span>
        <span className="text-right">Running</span>
        <span className="text-center">Action</span>
        <span className="text-center">Detail</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {paginatedData.map((row, i) => (
          <div
            key={row.id}
            className="grid py-3"
            style={{
              gridTemplateColumns: '0.8fr 1.2fr 0.9fr 0.9fr 1fr 0.8fr 0.8fr 0.7fr 0.7fr 0.7fr',
              borderTop: i > 0 ? '1px solid var(--color-border-subtle)' : 'none',
            }}
          >
            {/* Status */}
            <span className={row.status === 'Stopped' ? 'badge-red' : 'badge-green'}>
              {row.status}
            </span>

            {/* Trading Plan */}
            <span className="text-primary text-sm">{row.tradingPlan}</span>

            {/* Pair */}
            <span className="text-primary text-sm">{row.pair}</span>

            {/* Exchange */}
            <span className="text-primary text-sm">{row.exchange}</span>

            {/* Capital */}
            <span className="text-primary text-sm text-right">${row.capital.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>

            {/* P&L */}
            <span
              className={`text-xs text-right ${row.pnl >= 0 ? 'text-green' : 'text-red'}`}
            >
              {row.pnl >= 0 ? '+' : ''}${row.pnl.toFixed(0)}
            </span>

            {/* Win Rate */}
            <span className="text-primary text-xs text-right">{row.winRate}%</span>

            {/* Running */}
            <span className="text-primary text-xs text-right">{row.running}</span>

            {/* Action */}
            <div className="flex justify-center">
              <button
                onClick={() => statusMutation.mutate({
                  id: row.id,
                  status: row.status === 'Active' ? 'stopped' : 'active',
                })}
                disabled={statusMutation.isPending}
                className="text-xs px-3 py-1 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'transparent',
                  color: row.status === 'Active' ? '#f87171' : '#4ade80',
                  border: `1px solid ${row.status === 'Active' ? '#f87171' : '#4ade80'}`,
                }}
              >
                {row.status === 'Active' ? 'Stop' : 'Start'}
              </button>
            </div>

            {/* Detail */}
            <div className="flex justify-center">
              <button
                onClick={() => navigate(`/autotraders/${row.id}`)}
                className="text-xs px-3 py-1 rounded-full transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: '#4ade80',
                  border: '1px solid #4ade80',
                }}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-muted text-xs">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setCurrentPage(1)
            }}
            className="text-primary text-xs bg-transparent border-b border-solid"
            style={{ borderColor: 'var(--color-border-subtle)', outline: 'none' }}
          >
            <option value={10} style={{ backgroundColor: '#22223a', color: '#f0f0f0' }}>
              10
            </option>
            <option value={25} style={{ backgroundColor: '#22223a', color: '#f0f0f0' }}>
              25
            </option>
            <option value={50} style={{ backgroundColor: '#22223a', color: '#f0f0f0' }}>
              50
            </option>
          </select>
        </div>

        {/* Page buttons */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors"
              style={{
                backgroundColor: page === currentPage ? 'var(--color-accent-green-bg)' : 'transparent',
                color: page === currentPage ? 'var(--color-accent-green)' : 'var(--color-text-secondary)',
                border: page === currentPage ? 'none' : '1px solid var(--color-border-subtle)',
              }}
            >
              {page}
            </button>
          ))}
          <button className="text-secondary text-xs ml-1 hover:text-primary transition-colors">{'>'}</button>
        </div>
      </div>
    </div>
  )
}
