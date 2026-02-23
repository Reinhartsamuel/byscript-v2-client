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
  const user_id = JSON.parse(localStorage.getItem('user') || '{}')?.id;
  const res = await fetch(`${BASE_URL}/user/accounts`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  })
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error: ${res.statusText}`);
  return data;
}