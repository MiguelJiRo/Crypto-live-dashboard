const CryptoSummaryBar = ({ cryptos, colors, onRemove }) => {
  return (
    <div className="crypto-summary-bar">
      <div className="summary-scroll">
        {cryptos.map(({ id, name, symbol, price, change24h }) => {
          const isPositive = change24h >= 0;

          return (
            <div key={id} className="summary-card" style={{ borderTopColor: colors[id] }}>
              <div className="summary-header">
                <div className="summary-name-section">
                  <span className="summary-name-main">{name}</span>
                </div>
                {onRemove && (
                  <button
                    className="remove-crypto-btn"
                    onClick={() => onRemove(id)}
                    title="Eliminar"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="summary-price">
                ${price ? price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'}
              </div>

              <div className={`summary-change ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? '↑' : '↓'} {change24h ? Math.abs(change24h).toFixed(2) : '--'}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CryptoSummaryBar;
