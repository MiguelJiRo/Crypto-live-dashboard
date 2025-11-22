// Vercel Serverless Function - Proxy para CoinGecko markets
export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { ids, vs_currency, order, sparkline } = req.query;

  const params = new URLSearchParams({
    vs_currency: vs_currency || 'usd',
    ids: ids || '',
    order: order || 'market_cap_desc',
    sparkline: sparkline || 'false'
  });

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying CoinGecko markets API:', error);
    res.status(500).json({ error: 'Failed to fetch from CoinGecko' });
  }
}
