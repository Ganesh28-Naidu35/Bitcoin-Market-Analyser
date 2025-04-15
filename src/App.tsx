import React, { useEffect, useState } from 'react';
import { LineChart, Wallet, TrendingUp, Activity } from 'lucide-react';

interface MarketData {
  price: number;
  features: {
    Market_Sentiment: number;
    Trading_Volume: number;
    Inflation_Rate: number;
    Interest_Rate: number;
    Regulatory_Events: number;
    Mining_Difficulty: number;
    Halving_Impact: number;
    Institutional_Activity: number;
    USD_Index: number;
    Gold_Prices: number;
    Whale_Transactions: number;
    Geopolitical_Events: number;
  };
}

function App() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        const price = data.bitcoin.usd;

        // Simulated features (in a real app, these would come from your Python backend)
        const features = {
          Market_Sentiment: Math.random() * 2 - 1,
          Trading_Volume: Math.floor(Math.random() * 900) + 100,
          Inflation_Rate: 3.2,
          Interest_Rate: 2.5,
          Regulatory_Events: 0,
          Mining_Difficulty: 18.5,
          Halving_Impact: 0,
          Institutional_Activity: 0.3,
          USD_Index: 103.5,
          Gold_Prices: 1925.4,
          Whale_Transactions: 0,
          Geopolitical_Events: 1
        };

        setMarketData({ price, features });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!marketData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <LineChart className="h-10 w-10 text-blue-400" />
            <h1 className="text-3xl font-bold">Bitcoin Market Data Viewer</h1>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
            <Activity className="text-green-400" />
            <span>Live Data</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Price Card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="text-yellow-400" />
              <h2 className="text-xl font-semibold">Current Price</h2>
            </div>
            <p className="text-4xl font-bold text-yellow-400">
              ${marketData.price.toLocaleString()}
            </p>
          </div>

          {/* Market Metrics */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-blue-400" />
              <h2 className="text-xl font-semibold">Key Metrics</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Market Sentiment</span>
                <span className={marketData.features.Market_Sentiment > 0 ? 'text-green-400' : 'text-red-400'}>
                  {marketData.features.Market_Sentiment.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Trading Volume</span>
                <span className="text-blue-400">{marketData.features.Trading_Volume.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Mining Difficulty</span>
                <span>{marketData.features.Mining_Difficulty}</span>
              </div>
            </div>
          </div>

          {/* Economic Indicators */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Economic Indicators</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Inflation Rate</span>
                <span>{marketData.features.Inflation_Rate}%</span>
              </div>
              <div className="flex justify-between">
                <span>Interest Rate</span>
                <span>{marketData.features.Interest_Rate}%</span>
              </div>
              <div className="flex justify-between">
                <span>USD Index</span>
                <span>{marketData.features.USD_Index}</span>
              </div>
              <div className="flex justify-between">
                <span>Gold Price</span>
                <span>${marketData.features.Gold_Prices}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Table */}
        <div className="mt-8 bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">All Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(marketData.features).map(([key, value]) => (
                <div key={key} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm mb-1">{key.replace(/_/g, ' ')}</h3>
                  <p className="text-lg font-semibold">{typeof value === 'number' ? value.toFixed(2) : value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;