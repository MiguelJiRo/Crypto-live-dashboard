import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CryptoChart = ({ data, name, symbol, color }) => {
  const lastDataPoint = data && data.length > 0 ? data[data.length - 1] : null;
  const firstDataPoint = data && data.length > 1 ? data[0] : null;
  const hasValidData = lastDataPoint && lastDataPoint.price != null;

  return (
    <div className="crypto-chart">
      <div className="chart-header">
        <h3>{name} ({symbol.toUpperCase()})</h3>
        {hasValidData && (
          <div className="price-info">
            <span className="current-price">${lastDataPoint.price.toFixed(2)}</span>
            {firstDataPoint && firstDataPoint.price != null && (
              <span className={`price-change ${lastDataPoint.price >= firstDataPoint.price ? 'positive' : 'negative'}`}>
                {((lastDataPoint.price - firstDataPoint.price) / firstDataPoint.price * 100).toFixed(2)}%
              </span>
            )}
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="time"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value) => `$${value.toFixed(2)}`}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoChart;
