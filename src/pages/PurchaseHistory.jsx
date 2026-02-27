import { useEffect, useState, } from 'react';
import { PackageOpen, Calendar, Truck } from 'lucide-react';
import { formattedDate } from '../utils/DateTime';

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/purchase-history');
      const data = await res.json();
      setPurchases(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch purchase records:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div className="p-8 h-full flex flex-col bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <PackageOpen className="text-blue-600" /> Purchase & Restock Ledger
          </h2>
          <p className="text-gray-500 text-sm">Track all incoming inventory from suppliers</p>
        </div>
        <button 
          onClick={fetchPurchases}
          className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          Refresh Data
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 grow">
        <div className="overflow-y-auto h-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Item Details</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">Qty Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {purchases.length > 0 ? (
                purchases.map((record) => (
                  <tr key={record.id} className="hover:bg-blue-50/30 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {formattedDate(record.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{record.name}</div>
                      <div className="text-xs text-gray-400">Barcode: {record.barcode}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">
                        +{record.quantity}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-gray-400 italic">
                    {loading ? "Loading records..." : "No purchase history found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}