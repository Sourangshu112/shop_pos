import { useEffect, useState, useMemo } from 'react';

export default function Inventory() {
  const [items, setItems] = useState([]);
  
  // 1. New State for Search and Sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const refreshData = () => {
    fetch('http://127.0.0.1:5000/api/inventory')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    refreshData();
  }, []);

  // 2. Sorting Handler
  const requestSort = (key) => {
    let direction = 'ascending';
    // If clicking the same column again, toggle direction
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // 3. The "Smart" List: Filtered AND Sorted
  // useMemo ensures we only recalculate this when items, search, or sort changes
  const processedItems = useMemo(() => {
    let filtered = [...items];

    // A. Filter Step
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.barcode.toString().includes(searchTerm)
      );
    }

    // B. Sort Step
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [items, searchTerm, sortConfig]);

  // Helper to render sort arrow
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return "↕"; // Default neutral icon
    return sortConfig.direction === 'ascending' ? "↑" : "↓";
  };

  return (
    <div className="p-8 h-screen flex flex-col">
      
      {/* Header Section with Search */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Current Inventory</h2>
        
        {/* NEW SEARCH BOX */}
        <input 
          type="text"
          placeholder="Search by Name or Barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button onClick={refreshData} className="text-md font-bold text-white bg-blue-400 px-6 py-2 rounded-md hover:bg-blue-500 transition">
          Refresh
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden grow overflow-y-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal sticky top-0">
              
              {/* Clickable Headers */}
              <th 
                className="py-3 px-6 text-left cursor-pointer hover:bg-gray-200 select-none"
                onClick={() => requestSort('barcode')}
              >
                Barcode <span className="ml-1 text-gray-400">{getSortIcon('barcode')}</span>
              </th>

              <th 
                className="py-3 px-6 text-left cursor-pointer hover:bg-gray-200 select-none"
                onClick={() => requestSort('name')}
              >
                Name <span className="ml-1 text-gray-400">{getSortIcon('name')}</span>
              </th>

              <th 
                className="py-3 px-6 text-right cursor-pointer hover:bg-gray-200 select-none"
                onClick={() => requestSort('price')}
              >
                Price <span className="ml-1 text-gray-400">{getSortIcon('price')}</span>
              </th>

              <th 
                className="py-3 px-6 text-center cursor-pointer hover:bg-gray-200 select-none"
                onClick={() => requestSort('stock')}
              >
                Stock <span className="ml-1 text-gray-400">{getSortIcon('stock')}</span>
              </th>

            </tr>
          </thead>
          
          <tbody className="text-gray-600 text-md">
            {processedItems.length > 0 ? (
              processedItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="py-3 px-6 text-left">{item.barcode}</td>
                  <td className="py-3 px-6 text-left font-medium text-gray-900">{item.name}</td>
                  <td className="py-3 px-6 text-right font-mono">₹{item.price.toFixed(2)}</td>
                  <td className="py-3 px-6 text-center">
                    <span className={`${item.stock < 10 ? "bg-red-100 text-red-700 border border-red-200" : "bg-green-100 text-green-700 border border-green-200"} py-1 px-3 rounded-full text-xs font-bold`}>
                      {item.stock}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400 italic">
                  {searchTerm ? "No items match your search." : "Inventory is empty."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}