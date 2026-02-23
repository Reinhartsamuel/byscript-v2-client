import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import EquitySummaryChart from '@/pages/accounts/EquitySummaryChart'
import AccountsDistribution from '@/pages/accounts/AccountsDistribution'
import FilterBar from '@/pages/accounts/FilterBar'
import AccountsTable from '@/pages/accounts/AccountsTable'
import AddAccountModal from '@/components/AddAccountModal'
import { ACCOUNTS_TABLE } from '@/data/mockData'
import { useQuery } from '@tanstack/react-query';
import { getAccounts } from '@/lib/api';


export default function Accounts() {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [market, setMarket] = useState('All')
  const [provider, setProvider] = useState('All')
  const [autotrader, setAutotrader] = useState('All')
  const [addAccountOpen, setAddAccountOpen] = useState(false)

  // 1. Fetch the data
  const { data: accounts = [], isLoading, isError, error } = useAccounts()

  useEffect(() => {
    if ((location.state as { openAddAccount?: boolean } | null)?.openAddAccount) {
      setAddAccountOpen(true)
      window.history.replaceState({}, '')
    }
  }, [location.state])

  // 2. Filter the dynamic data (replaces ACCOUNTS_TABLE)
  // const filteredAccounts = useMemo(() => {
  //   return accounts.filter((row: any) => {
  //     if (search && !row.name.toLowerCase().includes(search.toLowerCase()) &&
  //         !row.subName.toLowerCase().includes(search.toLowerCase())) return false
  //     if (market !== 'All' && row.market !== market) return false
  //     if (provider !== 'All' && row.provider !== provider) return false
  //     if (autotrader !== 'All' && row.autotrader !== autotrader) return false
  //     return true
  //   })
  // }, [accounts, search, market, provider, autotrader])

  const handleClear = () => {
    setSearch('')
    setMarket('All')
    setProvider('All')
    setAutotrader('All')
  }

  // 3. Handle Loading/Error States gracefully
  if (isLoading) return <div className="p-8 text-center">Loading accounts...</div>
  if (isError) return <div className="p-8 text-red-500">Error: {(error as Error).message}</div>

  return (
    <div className="flex flex-col gap-6" style={{ minHeight: 'fit-content' }}>
      <AddAccountModal open={addAccountOpen} onClose={() => setAddAccountOpen(false)} />

      <div className="flex gap-6">
        <div style={{ flex: '1 1 60%', minWidth: 0 }}>
          {/* You can pass accounts data to charts too! */}
          <EquitySummaryChart data={accounts} />
        </div>
        <div style={{ flex: '1 1 40%', minWidth: 0 }}>
          <AccountsDistribution data={accounts} />
        </div>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        market={market}
        onMarketChange={setMarket}
        provider={provider}
        onProviderChange={setProvider}
        autotrader={autotrader}
        onAutotraderChange={setAutotrader}
        onClear={handleClear}
        onAddAccount={() => setAddAccountOpen(true)}
      />

      <AccountsTable data={accounts?.data} />
    </div>
  )
}

function useAccounts () {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
    staleTime: 1000 * 60 * 5, // 5 minutes as requested
  });
};
