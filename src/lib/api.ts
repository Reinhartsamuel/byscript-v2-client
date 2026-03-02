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