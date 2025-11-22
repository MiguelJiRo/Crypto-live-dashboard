# Crypto Live Dashboard

Dashboard completo para visualizar precios históricos y en tiempo real de las criptomonedas más populares.

## Características Principales

### Visualización de Datos
- **Gráficas individuales**: Cada criptomoneda en su propia gráfica detallada
- 6 criptomonedas populares incluidas:
  - Bitcoin (BTC)
  - Ethereum (ETH)
  - Binance Coin (BNB)
  - Cardano (ADA)
  - Solana (SOL)
  - Ripple (XRP)

### Características Adicionales
- Interfaz moderna con gradientes y efectos glassmorphism
- Indicadores de cambio de precio (positivo/negativo)
- Gráficas interactivas con tooltips detallados
- Diseño completamente responsivo
- Loading spinner durante la carga de datos
- Selector de rango de tiempo intuitivo

## Tecnologías utilizadas

- **React** - Librería de UI
- **Vite** - Build tool y dev server
- **Recharts** - Librería de gráficas
- **Axios** - Cliente HTTP para API calls
- **CoinGecko API** - Fuente de datos de criptomonedas

## API

Este proyecto utiliza la API gratuita de CoinGecko. No se requiere autenticación para el uso básico.

API Endpoint: `https://api.coingecko.com/api/v3`

## Detalles Técnicos

### Modo En Vivo
- Actualización automática cada 10 segundos
- Muestra los últimos 20 puntos de datos
- Ideal para monitoreo en tiempo real

### Modo Histórico
- Datos extraídos de la API de CoinGecko
- Diferentes intervalos según el rango:
  - 1H y 24H: Datos horarios
  - 7D - Todo: Datos diarios
- Carga bajo demanda al cambiar de rango

### Características Visuales
- Cada criptomoneda tiene su propio color distintivo
- Tooltips interactivos con información detallada
- Indicadores visuales de cambio de precio
- Animaciones suaves y transiciones
- Diseño adaptativo para móviles y tablets
