import { BASE_URL } from './constants'
import Cookies from 'js-cookie'

// 401 handler - logout and redirect to login
function handleUnauthorized() {
  // Clear local storage
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  

  // clear token fb_id_token from cookies
  Cookies.remove('fb_id_token')

  // Dispatch custom event for other components to listen (optional)
  window.dispatchEvent(new CustomEvent('auth:unauthorized'))
  
  // Redirect to login page
  window.location.href = '/login'
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  }

  const res = await fetch(url, { ...options, headers })

  if (res.status === 401) {
    handleUnauthorized()
    throw new Error('Unauthorized - please log in again')
  }

  return res
}

export async function loginToBackendWithFirebaseToken(idToken: string) {
  const res = await fetch(`${BASE_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}



export async function registerExchangeAccount(payload: {
  exchange: 'gate' | 'okx' | 'hyperliquid' | 'tokocrypto' | 'bitget' | 'mexc' | 'bitmart';
  api_key: string;
  api_secret: string;
  api_passphrase?: string;
  user_id: number;
}) {
  const res = await fetchWithAuth(`${BASE_URL}/${payload.exchange}/register-user`, {
    method: 'POST',
    body: JSON.stringify({
      api_key: payload.api_key,
      api_secret: payload.api_secret,
      api_passphrase: payload.api_passphrase ?? null,
      user_id: payload.user_id,
    }),
  })

  // 1. Parse the response body regardless of status
  const data = await res.json();

  // 2. Check if the request failed
  if (!res.ok) {
    // 3. Throw the specific message from the server JSON
    throw new Error(data.message || `Error: ${res.statusText}`);
  }

  // 4. Return the data if successful
  return data;
}


export async function getAccounts() {
  const res = await fetchWithAuth(`${BASE_URL}/user/accounts`)
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
})

//TODO: add pagination
export async function getAutotraders() {
  const res = await fetchWithAuth(`${BASE_URL}/user/autotraders`, { headers: authHeaders() })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

export interface TradingPlanPair {
  id: number;
  trading_plan_id: number;
  base_asset: string;
  quote_asset: string;
  symbol: string;
}

export interface TradingPlan {
  id: number;
  owner_user_id: number;
  name: string;
  description: string | null;
  strategy: string | null;
  visibility: string | null;
  total_followers: number | null;
  pnl_30d: string | null;
  max_dd: string | null;
  sharpe: string | null;
  created_at: string | null;
  is_active: boolean;
  pairs: TradingPlanPair[];
}

export async function getMyTradingPlans() {
  const res = await fetchWithAuth(`${BASE_URL}/user/trading-plans`, {
    method: 'GET',
    headers: authHeaders(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`)
  return data as { data: TradingPlan[] }
}

export async function getTradingPlans() {
  const [userPlansRes, publicPlansRes] = await Promise.all([
    fetchWithAuth(`${BASE_URL}/user/trading-plans`, { headers: authHeaders() }),
    fetchWithAuth(
      `${BASE_URL}/trading-plans?visibility=PUBLIC&limit=100&sort_by=created_at&sort_order=desc`,
      { headers: authHeaders() }
    ),
  ])

  const userPlansData = await userPlansRes.json()
  const publicPlansData = await publicPlansRes.json()

  if (!userPlansRes.ok) {
    throw new Error(userPlansData.message || `Error: ${userPlansRes.statusText}`)
  }

  if (!publicPlansRes.ok) {
    throw new Error(publicPlansData.message || `Error: ${publicPlansRes.statusText}`)
  }

  const userPlans = (userPlansData?.data || []) as TradingPlan[]
  const publicPlans = (publicPlansData?.data || []) as TradingPlan[]

  const mergedById = new Map<number, TradingPlan>()
  for (const plan of publicPlans) mergedById.set(plan.id, plan)
  for (const plan of userPlans) mergedById.set(plan.id, plan)

  return { data: Array.from(mergedById.values()) } as { data: TradingPlan[] }
}

export async function queryTradingPlans(params: {
  visibility?: 'PRIVATE' | 'UNLISTED' | 'PUBLIC';
  limit?: number;
  offset?: number;
  sort_by?: 'created_at' | 'total_followers' | 'name' | 'pnl_30d' | 'sharpe';
  sort_order?: 'asc' | 'desc';
  is_active?: boolean;
} = {}) {
  const query = new URLSearchParams()
  if (params.visibility) query.set('visibility', params.visibility)
  if (params.limit != null) query.set('limit', String(params.limit))
  if (params.offset != null) query.set('offset', String(params.offset))
  if (params.sort_by) query.set('sort_by', params.sort_by)
  if (params.sort_order) query.set('sort_order', params.sort_order)
  if (params.is_active != null) query.set('is_active', String(params.is_active))

  const res = await fetchWithAuth(`${BASE_URL}/trading-plans?${query.toString()}`, {
    method: 'GET',
    headers: authHeaders(),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data as { data: TradingPlan[]; pagination?: { total: number; limit: number; offset: number; has_more: boolean } };
}

export async function getTradingPlanById(id: string) {
  const res = await fetchWithAuth(`${BASE_URL}/trading-plans/${id}/with-pairs`, {
    method: 'GET',
    headers: authHeaders(),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

export async function createTradingPlan(payload: {
  owner_user_id?: number;
  name: string;
  description?: string;
  strategy?: string;
  visibility?: string;
  pairs: { base_asset: string; quote_asset: string; symbol: string }[];
}) {
  let ownerUserId = payload.owner_user_id

  if (ownerUserId == null) {
    try {
      const rawUser = localStorage.getItem('user')
      const parsedUser = rawUser ? JSON.parse(rawUser) : null
      const parsedId = Number(parsedUser?.id)
      ownerUserId = Number.isFinite(parsedId) ? parsedId : undefined
    } catch {
      ownerUserId = undefined
    }
  }

  if (ownerUserId == null) {
    throw new Error('Unable to create trading plan: missing user id. Please log in again.')
  }

  const res = await fetchWithAuth(`${BASE_URL}/trading-plans`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ ...payload, owner_user_id: ownerUserId }),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

export async function updateTradingPlan(id: string, payload: {
  name?: string;
  description?: string;
  strategy?: string;
  visibility?: string;
  is_active?: boolean;
}) {
  const res = await fetchWithAuth(`${BASE_URL}/trading-plans/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

export async function deleteTradingPlan(id: string) {
  const res = await fetchWithAuth(`${BASE_URL}/trading-plans/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

export async function createTradingPlanKey(id: string) {
  const res = await fetchWithAuth(`${BASE_URL}/user/trading-plans/${id}/keys`, {
    method: 'POST',
    headers: authHeaders(),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data as {
    data: {
      id: number;
      trading_plan_id: number;
      rate_limit: number;
      is_active: boolean;
      created_at: string | null;
      key_id: number;
      key: string;
      secret: string;
    };
    note?: string;
  };
}

export async function deleteAutotrader(id: string) {
  const res = await fetchWithAuth(`${BASE_URL}/user/autotraders/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

export async function getAutotraderDetail(id: string) {
  const res = await fetchWithAuth(`${BASE_URL}/user/autotraders/${id}`, {
    method: 'GET',
    headers: authHeaders(),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

export async function getAutotraderTrades(id: string) {
  const res = await fetchWithAuth(`${BASE_URL}/user/autotraders/${id}/trades`, {
    method: 'GET',
    headers: authHeaders(),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

export async function updateAutotraderStatus(id: string, status: 'active' | 'stopped') {
  const res = await fetchWithAuth(`${BASE_URL}/user/autotraders/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

export async function getTradeHistory(params: {
  exchange_id?: number;
  market_type?: string;
  contract?: string;
  position_type?: 'long' | 'short';
  status?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const query = new URLSearchParams();
  if (params.exchange_id != null) query.set('exchange_id', String(params.exchange_id));
  if (params.market_type) query.set('market_type', params.market_type);
  if (params.contract) query.set('contract', params.contract);
  if (params.position_type) query.set('position_type', params.position_type);
  if (params.status) query.set('status', params.status);
  if (params.date_from) query.set('date_from', params.date_from);
  if (params.date_to) query.set('date_to', params.date_to);
  if (params.limit != null) query.set('limit', String(params.limit));
  if (params.offset != null) query.set('offset', String(params.offset));

  const res = await fetchWithAuth(`${BASE_URL}/user/trades?${query.toString()}`, {
    method: 'GET',
    headers: authHeaders(),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data as { data: TradeHistoryItem[]; total: number; limit: number; offset: number };
}

export interface AutotraderTradeRow {
  id: number;
  trade_id: string;
  contract: string;
  position_type: string;
  market_type: string;
  size: string;
  price: string | null;
  leverage: number;
  leverage_type: string;
  status: string;
  position_status: string | null;
  pnl: string | null;
  pnl_margin: string | null;
  open_fill_price: string | null;
  close_fill_price: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TradeHistoryItem {
  id: number;
  contract: string;
  position_type: string;
  market_type: string;
  size: string;
  price: string | null;
  status: string;
  pnl: string | null;
  pnl_margin: string | null;
  open_filled_at: number | null;
  created_at: string;
  exchange_title: string;
  exchange_user_id: string;
  autotrader_symbol: string;
}

export function subscribeToTrades(onData: (trades: TradeHistoryItem[]) => void): () => void {
  const controller = new AbortController()
  const token = localStorage.getItem('token')
  fetch(`${BASE_URL}/user/sse/trades`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal,
  }).then(async (res) => {
    if (res.status === 401) {
      handleUnauthorized()
      return
    }
    if (!res.body) return
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buf = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      const lines = buf.split('\n\n')
      buf = lines.pop() ?? ''
      for (const chunk of lines) {
        const line = chunk.trim()
        if (!line.startsWith('data:')) continue
        try {
          const payload = JSON.parse(line.slice(5).trim())
          if (payload.type === 'trades') onData(payload.data)
        } catch { /* ignore parse errors */ }
      }
    }
  }).catch(() => { /* aborted or network error — silently ignore */ })

  return () => controller.abort()
}

export function subscribeToAutotraderTrades(
  id: string,
  onData: (trades: AutotraderTradeRow[]) => void,
): () => void {
  const controller = new AbortController()
  const token = localStorage.getItem('token')
  fetch(`${BASE_URL}/user/sse/autotraders/${id}/trades`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal,
  }).then(async (res) => {
    if (res.status === 401) {
      handleUnauthorized()
      return
    }
    if (!res.body) return
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buf = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      const lines = buf.split('\n\n')
      buf = lines.pop() ?? ''
      for (const chunk of lines) {
        const line = chunk.trim()
        if (!line.startsWith('data:')) continue
        try {
          const payload = JSON.parse(line.slice(5).trim())
          if (payload.type === 'trades') onData(payload.data)
        } catch { /* ignore parse errors */ }
      }
    }
  }).catch(() => { /* aborted or network error — silently ignore */ })

  return () => controller.abort()
}

export async function createAutotraders(payload: {
  exchange_id: number;
  trading_plan_id: number;
  market: string;
  pairs: {
    symbol: string;
    pair: string;
    initial_investment: string;
    leverage: number;
    leverage_type: string;
    margin_mode: string;
    position_mode: string;
  }[];
}) {
  const res = await fetchWithAuth(`${BASE_URL}/user/autotraders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

export async function getDashboardData(period: string = '7d') {
  const res = await fetchWithAuth(`${BASE_URL}/user/dashboard?period=${period}`)
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}
