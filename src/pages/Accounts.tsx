import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import EquitySummaryChart from '@/pages/accounts/EquitySummaryChart'
import AccountsDistribution from '@/pages/accounts/AccountsDistribution'
import FilterBar from '@/pages/accounts/FilterBar'
import AccountsTable from '@/pages/accounts/AccountsTable'
import AddAccountModal from '@/components/AddAccountModal'

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
          <EquitySummaryChart />
        </div>
        <div style={{ flex: '1 1 40%', minWidth: 0 }}>
          <AccountsDistribution />
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

      <AccountsTable data={accounts} />
    </div>
  )
}

function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
    staleTime: 1000 * 60 * 5,
    // Transform the data here so the component always gets the right shape
    select: (response) => {
      const rawData = response?.data || [];
      return rawData.map((row: any) => ({
        id: row.id,
        name: row.exchange_title?.toUpperCase() || 'Unknown',
        subName: row.exchange_user_id || 'N/A',
        value: Number(row.value) || 0,
        // Provide defaults for missing backend fields to prevent .toFixed() crashes
        change1D: Number(row.change1D) || 0,
        change7D: Number(row.change7D) || 0,
        change30D: Number(row.change30D) || 0,
        autotraderCount: Number(row.autotraderCount) || 0,
        market: row.market_type || 'spot',
        provider: row.exchange_title || 'gate',
        autotrader: row.autotraderCount > 0 ? 'Active' : 'None',
        assets: row.assets || [{ color: '#4ade80', pct: 100 }], // Default bar
      }));
    },
  });
}
