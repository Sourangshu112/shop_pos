import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function Analytics() {
  const [salesData, setSalesData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    // Fetch Top Items
    fetch('http://127.0.0.1:5000/api/analytics')
      .then(res => res.json())
      .then(data => setSalesData(data));

    // Fetch Advanced Metrics
    fetch('http://127.0.0.1:5000/api/analytics/advanced')
      .then(res => res.json())
      .then(data => {
        setTrendData(data.trend);
        setLowStock(data.low_stock);
      });
  }, []);

  return (
    <div className="p-8 h-full bg-gray-50 overflow-y-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>

      {/* TOP ROW: Trend Chart & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* 1. REVENUE TREND (Line Chart) takes up 2/3rds */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-2">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">Weekly Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  dot={{r: 4}} 
                  activeDot={{r: 8}} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. LOW STOCK ALERT (List) takes up 1/3rd */}
        <div className=" p-6 rounded-xl shadow-sm border border-red-100 bg-red-50">
          <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center">
            ⚠️ Low Stock Alerts
          </h3>
          {lowStock.length === 0 ? (
            <p className="text-green-600 font-medium">All stocked up! ✅</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white p-3 rounded shadow-sm border border-red-100">
                  <span className="font-medium text-gray-700 truncate w-32">{item.name}</span>
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM ROW: The original Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
        <h3 className="text-lg font-semibold text-gray-600 mb-4">Top Selling Items</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData}>
             {/* ... your existing BarChart code ... */}
             <CartesianGrid strokeDasharray="3 3" vertical={false} />
             <XAxis dataKey="name" />
             <YAxis />
             <Tooltip />
             <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}