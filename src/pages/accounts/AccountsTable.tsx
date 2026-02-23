import { useState, useEffect } from 'react'
import { AccountTableRow } from '@/data/mockData'

interface AccountsTableProps {
  data: AccountTableRow[]
}

export default function AccountsTable({ data }: AccountsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [data])

  const totalPages = Math.ceil(data.length / rowsPerPage)
  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  return (
    <div className="card">
      {/* Header */}
      <div
        className="grid text-muted text-xs uppercase tracking-wider mb-2"
        style={{ gridTemplateColumns: '2fr 1fr 0.7fr 0.7fr 0.7fr 1fr 1.2fr' }}
      >
        <span>Account</span>
        <span className="text-right">Value</span>
        <span className="text-right">1D</span>
        <span className="text-right">7D</span>
        <span className="text-right">30D</span>
        <span className="text-right">Autotraders</span>
        <span className="text-right">Assets</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {paginatedData.map((row, i) => (
          <div
            key={row.id}
            className="grid py-3"
            style={{
              gridTemplateColumns: '2fr 1fr 0.7fr 0.7fr 0.7fr 1fr 1.2fr',
              borderTop: i > 0 ? '1px solid var(--color-border-subtle)' : 'none',
            }}
          >
            {/* Account */}
            <div className="flex flex-col">
              <span className="text-primary text-sm font-medium">{row.name}</span>
              <p className="text-muted text-xs">{row.subName}</p>
            </div>

            {/* Value */}
            <span className="text-primary text-sm font-medium text-right">${row.value.toLocaleString()}</span>

            {/* 1D */}
            <span
              className={`text-xs text-right ${row.change1D >= 0 ? 'text-green' : 'text-red'}`}
            >
              {row.change1D >= 0 ? '+' : ''}
              {row.change1D.toFixed(1)}%
            </span>

            {/* 7D */}
            <span
              className={`text-xs text-right ${row.change7D >= 0 ? 'text-green' : 'text-red'}`}
            >
              {row.change7D >= 0 ? '+' : ''}
              {row.change7D.toFixed(1)}%
            </span>

            {/* 30D */}
            <span
              className={`text-xs text-right ${row.change30D >= 0 ? 'text-green' : 'text-red'}`}
            >
              {row.change30D >= 0 ? '+' : ''}
              {row.change30D.toFixed(1)}%
            </span>

            {/* Autotraders */}
            <div className="text-right">
              <span className="badge-green">{row.autotraderCount}</span>
            </div>

            {/* Assets */}
            <div className="flex rounded-sm overflow-hidden justify-end" style={{ width: '80px', height: '8px' }}>
              {row.assets.map((seg, j) => (
                <div key={j} style={{ width: `${seg.pct}%`, backgroundColor: seg.color }} />
              ))}
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
