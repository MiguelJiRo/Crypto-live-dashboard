const MiniSparkline = ({ data, color, isPositive }) => {
  if (!data || data.length < 2) return null;

  // Calcular dimensiones del SVG
  const width = 120;
  const height = 40;
  const padding = 2;

  // Encontrar valores min y max para escalar
  const values = data.filter(v => v != null && !isNaN(v));
  if (values.length === 0) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  // Crear puntos para el path
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * (width - 2 * padding) + padding;
    const y = height - padding - ((value - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(' L ')}`;

  return (
    <svg className="mini-sparkline" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path
        d={`${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
        fill={`url(#gradient-${color})`}
      />
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CryptoSummaryBar = ({ cryptos, colors, onRemove }) => {
  const formatVolume = (volume) => {
    if (!volume) return '--';

    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(2)}K`;
    }
    return `$${volume.toFixed(2)}`;
  };

  return (
    <div className="crypto-summary-bar">
      <div className="summary-scroll">
        {cryptos.map(({ id, name, symbol, price, change24h, volume24h, image, sparklineData }) => {
          const isPositive = change24h >= 0;

          return (
            <div key={id} className="summary-card" style={{ borderTopColor: colors[id] }}>
              <div className="summary-header">
                <div className="summary-name-section">
                  {image && (
                    <img
                      src={image}
                      alt={name}
                      className="crypto-logo"
                    />
                  )}
                  <div className="summary-name-info">
                    <span className="summary-name-main">{name}</span>
                    <span className="summary-symbol">{symbol}</span>
                  </div>
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

              <div className="summary-stats">
                <div className={`summary-change ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? '↑' : '↓'} {change24h ? Math.abs(change24h).toFixed(2) : '--'}%
                </div>
                <div className="summary-volume" title="Volumen 24h">
                  Vol: {formatVolume(volume24h)}
                </div>
              </div>

              {sparklineData && sparklineData.length > 1 && (
                <div className="summary-sparkline">
                  <MiniSparkline
                    data={sparklineData}
                    color={colors[id]}
                    isPositive={isPositive}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CryptoSummaryBar;
