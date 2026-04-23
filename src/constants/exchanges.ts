export interface ExchangeMeta {
  exchange_name: string
  exchange_thumbnail: string
}

export const EXCHANGES: ExchangeMeta[] = [
  {
    exchange_name: 'GATE',
    exchange_thumbnail: 'https://assets.coingecko.com/markets/images/60/large/Frame_1.png?1747795534',
  },
  {
    exchange_name: 'OKX',
    exchange_thumbnail: 'https://assets.coingecko.com/markets/images/96/large/WeChat_Image_20220117220452.png?1706864283',
  },
  {
    exchange_name: 'HYPERLIQUID',
    exchange_thumbnail: 'https://assets.coingecko.com/markets/images/1571/large/PFP.png?1714470912',
  },
  {
    exchange_name: 'TOKOCRYPTO',
    exchange_thumbnail: 'https://assets.coingecko.com/markets/images/501/large/toko.png?1706864476',
  },
  {
    exchange_name: 'BITGET',
    exchange_thumbnail: 'https://assets.coingecko.com/markets/images/540/large/2023-07-25_21.47.43.jpg?1706864507',
  },
  {
    exchange_name: 'MEXC',
    exchange_thumbnail: 'https://assets.coingecko.com/markets/images/409/large/logo_new.png?1743600043',
  },
  {
    exchange_name: 'BITMART',
    exchange_thumbnail: 'https://assets.coingecko.com/markets/images/239/large/Bitmart.png?1706864341',
  },
]

export function getExchangeThumbnail(exchangeName: string): string | null {
  if (!exchangeName) return null

  const normalized = exchangeName.trim().toUpperCase()
  const compact = normalized.replace(/\s+/g, '')

  const exactMatch = EXCHANGES.find((exchange) => exchange.exchange_name === normalized)
  if (exactMatch) return exactMatch.exchange_thumbnail

  const compactMatch = EXCHANGES.find((exchange) => exchange.exchange_name === compact)
  if (compactMatch) return compactMatch.exchange_thumbnail

  const containsMatch = EXCHANGES.find((exchange) => compact.includes(exchange.exchange_name))
  if (containsMatch) return containsMatch.exchange_thumbnail

  return null
}
