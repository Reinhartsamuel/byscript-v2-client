import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Dashboard from '@/pages/Dashboard'
import Accounts from '@/pages/Accounts'
import Autotraders from '@/pages/Autotraders'
import AutotraderConfigurator from '@/pages/AutotraderConfigurator'
import AutotraderDetail from '@/pages/AutotraderDetail'
import TradeHistory from '@/pages/TradeHistory'
import TradingPlans from '@/pages/TradingPlans'
import TradingPlanDetail from '@/pages/TradingPlanDetail'
import Login from '@/pages/Login'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="autotraders" element={<Autotraders />} />
          <Route path="autotraders/new" element={<AutotraderConfigurator />} />
          <Route path="autotraders/:id" element={<AutotraderDetail />} />
          <Route path="trade-history" element={<TradeHistory />} />
          <Route path="trading-plans" element={<TradingPlans />} />
          <Route path="trading-plans/:id" element={<TradingPlanDetail />} />
        </Route>
      </Route>
    </Routes>
  )
}
