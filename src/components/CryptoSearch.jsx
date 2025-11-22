import { useState } from 'react';

const CryptoSearch = ({ onAdd, currentCryptos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Lista de criptomonedas populares disponibles
  const availableCryptos = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
    { id: 'ripple', name: 'Ripple', symbol: 'XRP' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
    { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
    { id: 'matic-network', name: 'Polygon', symbol: 'MATIC' },
    { id: 'litecoin', name: 'Litecoin', symbol: 'LTC' },
    { id: 'uniswap', name: 'Uniswap', symbol: 'UNI' },
    { id: 'stellar', name: 'Stellar', symbol: 'XLM' },
    { id: 'monero', name: 'Monero', symbol: 'XMR' },
    { id: 'ethereum-classic', name: 'Ethereum Classic', symbol: 'ETC' },
    { id: 'tron', name: 'TRON', symbol: 'TRX' },
    { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'SHIB' },
    { id: 'cosmos', name: 'Cosmos', symbol: 'ATOM' },
    { id: 'near', name: 'NEAR Protocol', symbol: 'NEAR' }
  ];

  const filteredCryptos = availableCryptos.filter(crypto => {
    const alreadyAdded = currentCryptos.includes(crypto.id);
    if (alreadyAdded) return false;

    const matchesSearch =
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleAdd = (crypto) => {
    onAdd(crypto);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  return (
    <div className="crypto-search">
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar criptomoneda (ej: Bitcoin, ETH)..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {searchTerm && (
          <button
            className="clear-search-btn"
            onClick={() => {
              setSearchTerm('');
              setShowSuggestions(false);
            }}
          >
            ×
          </button>
        )}
      </div>

      {showSuggestions && searchTerm && filteredCryptos.length > 0 && (
        <div className="search-suggestions">
          {filteredCryptos.slice(0, 8).map(crypto => (
            <div
              key={crypto.id}
              className="suggestion-item"
              onClick={() => handleAdd(crypto)}
            >
              <span className="suggestion-name">{crypto.name}</span>
              <span className="suggestion-symbol">{crypto.symbol}</span>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && searchTerm && filteredCryptos.length === 0 && (
        <div className="search-suggestions">
          <div className="no-results">
            No se encontraron criptomonedas
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoSearch;
