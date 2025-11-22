import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CombinedChart = ({ data, cryptoColors, cryptoNames }) => {
  // Combinar todos los datos en un solo array para la gráfica
  const combineData = () => {
    if (!data || Object.keys(data).length === 0) return [];

    // Obtener todas las marcas de tiempo únicas
    const allTimestamps = new Set();
    Object.values(data).forEach(cryptoData => {
      if (cryptoData && cryptoData.length > 0) {
        cryptoData.forEach(point => {
          if (point && point.timestamp) {
            allTimestamps.add(point.timestamp);
          }
        });
      }
    });

    const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

    // Crear un array con todos los puntos de datos
    return sortedTimestamps.map(timestamp => {
      const point = { timestamp };

      Object.keys(data).forEach(cryptoId => {
        const cryptoPoint = data[cryptoId]?.find(p => p.timestamp === timestamp);
        if (cryptoPoint) {
          point[cryptoId] = cryptoPoint.price;
          point.time = cryptoPoint.time;
        }
      });

      return point;
    });
  };

  const combinedData = combineData();

  // Función para formatear el tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0]?.payload?.time || label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {cryptoNames[entry.dataKey]}: ${entry.value?.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="combined-chart">
      <div className="chart-header">
        <h2>Vista General - Todas las Criptomonedas</h2>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="time"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => cryptoNames[value]}
          />
          {Object.keys(cryptoColors).map(cryptoId => (
            <Line
              key={cryptoId}
              type="monotone"
              dataKey={cryptoId}
              stroke={cryptoColors[cryptoId]}
              strokeWidth={2}
              dot={false}
              animationDuration={500}
              name={cryptoNames[cryptoId]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CombinedChart;
