import { BASE_URL } from './constants'

export async function loginWithFirebaseToken(idToken: string) {
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
  exchange: 'gate' | 'okx' | 'hyperliquid' | 'tokocrypto';
  api_key: string;
  api_secret: string;
  api_passphrase?: string;
  user_id: number;
}) {
  const res = await fetch(`${BASE_URL}/${payload.exchange}/register-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  const res = await fetch(`${BASE_URL}/user/accounts`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
})

export async function getAutotraders() {
  const res = await fetch(`${BASE_URL}/user/autotraders`, {
    method: 'GET',
    headers: authHeaders(),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

export async function getTradingPlans() {
  const res = await fetch(`${BASE_URL}/user/trading-plans`, {
    method: 'GET',
    headers: authHeaders(),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

export async function createTradingPlan(payload: {
  name: string;
  description?: string;
  strategy?: string;
  visibility?: string;
  pairs: { base_asset: string; quote_asset: string; symbol: string }[];
}) {
  const res = await fetch(`${BASE_URL}/user/trading-plans`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

export async function deleteAutotrader(id: string) {
  const res = await fetch(`${BASE_URL}/user/autotraders/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

export async function getAutotraderDetail(id: string) {
  const res = await fetch(`${BASE_URL}/user/autotraders/${id}`, {
    method: 'GET',
    headers: authHeaders(),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

export async function getAutotraderTrades(id: string) {
  const res = await fetch(`${BASE_URL}/user/autotraders/${id}/trades`, {
    method: 'GET',
    headers: authHeaders(),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}

export async function updateAutotraderStatus(id: string, status: 'active' | 'stopped') {
  const res = await fetch(`${BASE_URL}/user/autotraders/${id}/status`, {
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

  const res = await fetch(`${BASE_URL}/user/trades?${query.toString()}`, {
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
  fetch(`${BASE_URL}/user/sse/trades`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    signal: controller.signal,
  }).then(async (res) => {
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
  fetch(`${BASE_URL}/user/sse/autotraders/${id}/trades`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    signal: controller.signal,
  }).then(async (res) => {
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
  const res = await fetch(`${BASE_URL}/user/autotraders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}