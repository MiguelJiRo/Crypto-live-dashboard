// Vercel Serverless Function - Proxy para CoinGecko historical data
export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id, vs_currency, days, interval } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing required parameter: id' });
  }

  const params = new URLSearchParams({
    vs_currency: vs_currency || 'usd',
    days: days || '1',
    interval: interval || 'daily'
  });

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying CoinGecko history API:', error);
    res.status(500).json({ error: 'Failed to fetch from CoinGecko' });
  }
}
