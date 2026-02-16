import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Inventory() {
  const [items, setItems] = useState([]);

  const refreshData = () => {
    fetch('http://127.0.0.1:5000/api/inventory')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Current Inventory</h2>
        <button onClick={refreshData} className="text-sm text-blue-500 underline">Refresh</button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden grow overflow-y-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Barcode</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-right">Price</th>
              <th className="py-3 px-6 text-center">Stock</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-md">
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-left">{item.barcode}</td>
                <td className="py-3 px-6 text-left font-medium">{item.name}</td>
                <td className="py-3 px-6 text-right">₹{item.price.toFixed(2)}</td>
                <td className="py-3 px-6 text-center">
                  <span className={`${item.stock < 5 ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"} py-1 px-3 rounded-full text-xs`}>
                    {item.stock}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}