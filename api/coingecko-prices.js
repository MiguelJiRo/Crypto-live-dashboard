// Vercel Serverless Function - Proxy para CoinGecko simple/price
export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { ids, vs_currencies, include_24hr_change, include_24hr_vol, include_market_cap } = req.query;

  const params = new URLSearchParams({
    ids: ids || '',
    vs_currencies: vs_currencies || 'usd',
    include_24hr_change: include_24hr_change || 'true',
    include_24hr_vol: include_24hr_vol || 'true',
    include_market_cap: include_market_cap || 'true'
  });

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying CoinGecko API:', error);
    res.status(500).json({ error: 'Failed to fetch from CoinGecko' });
  }
}
