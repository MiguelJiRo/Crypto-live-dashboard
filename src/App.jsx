import { useState, useEffect } from 'react'
import CryptoChart from './components/CryptoChart'
import CryptoSummaryBar from './components/CryptoSummaryBar'
import CryptoSearch from './components/CryptoSearch'
import TimeRangeSelector from './components/TimeRangeSelector'
import Footer from './components/Footer'
import { getCryptoPrices, getAllCryptosHistoricalData, generateRandomColor, CRYPTO_IDS, TIME_RANGES } from './services/cryptoApi'
import './App.css'

// Configuración inicial de colores y nombres
const INITIAL_CRYPTO_COLORS = {
  bitcoin: '#F7931A',
  ethereum: '#627EEA',
  binancecoin: '#F3BA2F',
  cardano: '#3498DB',
  solana: '#14F195',
  ripple: '#00AAE4'
};

const CRYPTO_NAMES_MAP = {
  bitcoin: 'Bitcoin',
  ethereum: 'Ethereum',
  binancecoin: 'Binance Coin',
  cardano: 'Cardano',
  solana: 'Solana',
  ripple: 'Ripple',
  polkadot: 'Polkadot',
  dogecoin: 'Dogecoin',
  'avalanche-2': 'Avalanche',
  chainlink: 'Chainlink',
  'matic-network': 'Polygon',
  litecoin: 'Litecoin',
  uniswap: 'Uniswap',
  stellar: 'Stellar',
  monero: 'Monero',
  'ethereum-classic': 'Ethereum Classic',
  tron: 'TRON',
  'shiba-inu': 'Shiba Inu',
  cosmos: 'Cosmos',
  near: 'NEAR Protocol'
};

function App() {
  // Cargar criptos seleccionadas desde localStorage o usar las predeterminadas
  const loadSelectedCryptos = () => {
    const saved = localStorage.getItem('selectedCryptos');
    return saved ? JSON.parse(saved) : CRYPTO_IDS;
  };

  const loadCryptoColors = () => {
    const saved = localStorage.getItem('cryptoColors');
    return saved ? JSON.parse(saved) : INITIAL_CRYPTO_COLORS;
  };

  const [selectedCryptos, setSelectedCryptos] = useState(loadSelectedCryptos);
  const [cryptoColors, setCryptoColors] = useState(loadCryptoColors);
  const [cryptoData, setCryptoData] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedRange, setSelectedRange] = useState('LIVE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentPrices, setCurrentPrices] = useState({});

  // Guardar en localStorage cuando cambian las criptos seleccionadas
  useEffect(() => {
    localStorage.setItem('selectedCryptos', JSON.stringify(selectedCryptos));
  }, [selectedCryptos]);

  useEffect(() => {
    localStorage.setItem('cryptoColors', JSON.stringify(cryptoColors));
  }, [cryptoColors]);

  // Efecto para datos en vivo
  useEffect(() => {
    if (selectedRange !== 'LIVE') return;

    // Inicializar datos para cada criptomoneda
    const initialData = {};
    selectedCryptos.forEach(id => {
      initialData[id] = [];
    });
    setCryptoData(initialData);

    // Función para obtener y actualizar precios
    const fetchPrices = async () => {
      const prices = await getCryptoPrices(selectedCryptos);
      if (prices) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        // Guardar precios actuales para la barra de resumen
        setCurrentPrices(prices);

        setCryptoData(prev => {
          const updated = { ...prev };
          selectedCryptos.forEach(id => {
            if (prices[id]) {
              const newData = {
                time: timeString,
                price: prices[id].usd,
                timestamp: now.getTime()
              };
              // Mantener solo los últimos 20 puntos de datos
              updated[id] = [...(prev[id] || []), newData].slice(-20);
            }
          });
          return updated;
        });

        setLastUpdate(now);
      }
    };

    // Obtener datos iniciales
    fetchPrices();

    // Actualizar cada 10 segundos
    const interval = setInterval(fetchPrices, 10000);

    return () => clearInterval(interval);
  }, [selectedRange, selectedCryptos]);

  // Efecto para datos históricos
  useEffect(() => {
    if (selectedRange === 'LIVE') return;

    const fetchHistoricalData = async () => {
      setLoading(true);
      setError(null);
      setLoadingProgress(0);

      try {
        const days = TIME_RANGES[selectedRange].days;
        const data = await getAllCryptosHistoricalData(days);

        if (data) {
          setCryptoData(data);
          setLastUpdate(new Date());
          setError(null);
        } else {
          setError('No se pudieron cargar los datos. Por favor, intenta de nuevo.');
        }
      } catch (err) {
        console.error('Error:', err);
        if (err.message === 'CORS') {
          setError('La API está bloqueando las peticiones (CORS). Usa el modo "En vivo" que funciona sin problemas.');
        } else if (err.message === 'RATE_LIMIT') {
          setError('Has excedido el límite de peticiones. Espera 1-2 minutos antes de intentar de nuevo, o usa el modo "En vivo".');
        } else {
          setError('Error al cargar los datos históricos. Usa el modo "En vivo" o intenta más tarde.');
        }
      } finally {
        setLoading(false);
        setLoadingProgress(100);
      }
    };

    fetchHistoricalData();
  }, [selectedRange]);

  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  const handleAddCrypto = (crypto) => {
    if (!selectedCryptos.includes(crypto.id)) {
      setSelectedCryptos(prev => [...prev, crypto.id]);

      // Asignar color si no existe
      if (!cryptoColors[crypto.id]) {
        setCryptoColors(prev => ({
          ...prev,
          [crypto.id]: generateRandomColor()
        }));
      }
    }
  };

  const handleRemoveCrypto = (cryptoId) => {
    // No permitir eliminar si solo queda una cripto
    if (selectedCryptos.length <= 1) {
      alert('Debe haber al menos una criptomoneda seleccionada');
      return;
    }

    setSelectedCryptos(prev => prev.filter(id => id !== cryptoId));

    // Limpiar datos de esa cripto
    setCryptoData(prev => {
      const updated = { ...prev };
      delete updated[cryptoId];
      return updated;
    });
  };

  // Preparar datos para la barra de resumen
  const summaryData = selectedCryptos.map(id => ({
    id,
    name: CRYPTO_NAMES_MAP[id] || id,
    symbol: id.replace(/-/g, ' ').split(' ').map(w => w[0]).join('').toUpperCase(),
    price: currentPrices[id]?.usd,
    change24h: currentPrices[id]?.usd_24h_change
  }));

  return (
    <>
      <div className="app">
        <header className="header">
          <h1>Crypto Live Dashboard</h1>
          <p className="subtitle">Visualización de precios históricos y en tiempo real</p>
          {lastUpdate && (
            <p className="last-update">
              {selectedRange === 'LIVE'
                ? `Última actualización: ${lastUpdate.toLocaleTimeString('es-ES')}`
                : `Datos cargados: ${lastUpdate.toLocaleTimeString('es-ES')}`
              }
            </p>
          )}
        </header>

      {/* Barra de resumen */}
      <CryptoSummaryBar
        cryptos={summaryData}
        colors={cryptoColors}
        onRemove={handleRemoveCrypto}
      />

      <div className="controls-section">
        <div className="controls-wrapper">
          <TimeRangeSelector
            selectedRange={selectedRange}
            onRangeChange={handleRangeChange}
          />
          <CryptoSearch
            onAdd={handleAddCrypto}
            currentCryptos={selectedCryptos}
          />
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <div className="error-banner-content">
            <div className="error-banner-message">
              <span className="error-icon">⚠️</span>
              <div className="error-text">
                <strong>Error:</strong> {error}
              </div>
            </div>
            <div className="error-actions">
              <button
                className="back-to-live-btn"
                onClick={() => setSelectedRange('LIVE')}
              >
                Modo En vivo
              </button>
              <button
                className="error-dismiss-btn"
                onClick={() => setError(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando datos históricos...</p>
          <p className="loading-hint">Esto puede tardar unos segundos debido a los límites de la API</p>
        </div>
      ) : (
        <div className="charts-grid">
          {selectedCryptos.map(id => (
            <CryptoChart
              key={id}
              data={cryptoData[id] || []}
              name={CRYPTO_NAMES_MAP[id] || id}
              symbol={id}
              color={cryptoColors[id]}
            />
          ))}
        </div>
      )}
      </div>

      <Footer />
    </>
  )
}

export default App
