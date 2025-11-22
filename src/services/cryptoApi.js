import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Lista de criptomonedas populares para mostrar
export const CRYPTO_IDS = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana', 'ripple'];

// Rangos de tiempo disponibles
export const TIME_RANGES = {
  'LIVE': { label: 'En vivo', days: null, interval: null },
  '24H': { label: '24 Horas', days: 1, interval: 'hourly' },
  '7D': { label: '7 Días', days: 7, interval: 'daily' },
  '30D': { label: '30 Días', days: 30, interval: 'daily' },
  '1Y': { label: '1 Año', days: 365, interval: 'daily' }
};

export const getCryptoPrices = async (cryptoIds = CRYPTO_IDS) => {
  try {
    const response = await axios.get(`${BASE_URL}/simple/price`, {
      params: {
        ids: cryptoIds.join(','),
        vs_currencies: 'usd',
        include_24hr_change: true
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return null;
  }
};

// Función para generar un color aleatorio vibrante
export const generateRandomColor = () => {
  const colors = [
    '#F7931A', '#627EEA', '#F3BA2F', '#3498DB', '#14F195', '#00AAE4',
    '#E74C3C', '#9B59B6', '#1ABC9C', '#F39C12', '#E67E22', '#16A085',
    '#8E44AD', '#2ECC71', '#3498DB', '#F1C40F', '#E74C3C', '#95A5A6',
    '#D35400', '#27AE60', '#2980B9', '#C0392B', '#7F8C8D'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Obtener datos históricos de una criptomoneda
export const getCryptoHistoricalData = async (id, days) => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
        interval: days === 1 ? 'hourly' : 'daily'
      }
    });

    // Formatear los datos para que sean más fáciles de usar
    return response.data.prices.map(([timestamp, price]) => ({
      time: new Date(timestamp).toLocaleString('es-ES', {
        month: 'short',
        day: 'numeric',
        ...(days === 1 ? { hour: '2-digit', minute: '2-digit' } : {})
      }),
      price: price,
      timestamp: timestamp
    }));
  } catch (error) {
    if (error.message && error.message.includes('Network Error')) {
      console.error(`Error de red/CORS para ${id}:`, error);
      throw new Error('CORS');
    } else if (error.response && error.response.status === 429) {
      console.error(`Rate limit excedido para ${id}`);
      throw new Error('RATE_LIMIT');
    }
    console.error(`Error fetching historical data for ${id}:`, error);
    return null;
  }
};

// Función auxiliar para agregar delay entre peticiones
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Obtener datos históricos de todas las criptomonedas con delay para evitar rate limit
export const getAllCryptosHistoricalData = async (days) => {
  const data = {};

  // Hacer peticiones secuenciales con delay para evitar rate limit
  for (let i = 0; i < CRYPTO_IDS.length; i++) {
    const id = CRYPTO_IDS[i];
    try {
      const result = await getCryptoHistoricalData(id, days);
      data[id] = result;

      // Agregar delay de 2 segundos entre peticiones (excepto la última)
      if (i < CRYPTO_IDS.length - 1) {
        await delay(2000);
      }
    } catch (error) {
      console.error(`Error al obtener datos para ${id}:`, error.message);
      // Si es error CORS o rate limit, lanzar el error para que lo maneje el componente
      if (error.message === 'CORS' || error.message === 'RATE_LIMIT') {
        throw error;
      }
      // Para otros errores, continuar con la siguiente criptomoneda
      data[id] = null;
    }
  }

  return data;
};

export const getCryptoInfo = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false
      }
    });
    return {
      name: response.data.name,
      symbol: response.data.symbol,
      price: response.data.market_data.current_price.usd
    };
  } catch (error) {
    console.error(`Error fetching info for ${id}:`, error);
    return null;
  }
};
