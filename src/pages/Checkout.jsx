import { useState } from 'react';

export default function Checkout() {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);

  const addToCart = async () => {
    if (!search) return;

    // Fetch item from Python backend
    const res = await fetch(`http://127.0.0.1:5000/api/search?q=${search}`);
    
    if (res.ok) {
      const item = await res.json();
      if (item.stock > 0) {
        setCart([...cart, item]);
        setSearch(''); // Clear search box
      } else {
        alert(`${item.name} is out of stock!`);
      }
    } else {
      alert("Item not found in inventory.");
    }
  };

  // Calculate Total
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-8 flex flex-col h-screen">
      
      {/* Top Section: Search */}
      <div className="flex gap-4 mb-6">
        <input 
          type="text"
          placeholder="Enter Barcode or Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addToCart()} 
          className="flex-1 p-4 border rounded-lg text-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button 
          onClick={addToCart}
          className="bg-green-600 text-white px-8 rounded-lg font-bold text-lg shadow-md hover:bg-green-700"
        >
          ADD
        </button>
      </div>

      {/* Middle Section: Cart Display (Split View) */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Cart Items List */}
        <div className="flex-1 bg-white shadow-inner border rounded-lg p-4 overflow-y-auto">
           {cart.length === 0 ? (
             <p className="text-gray-400 text-center mt-10">Cart is empty...</p>
           ) : (
             cart.map((item, index) => (
               <div key={index} className="flex justify-between border-b py-2 text-lg">
                 <span>{item.name}</span>
                 <span>₹{item.price.toFixed(2)}</span>
               </div>
             ))
           )}
        </div>

        {/* Totals Section */}
        <div className="w-1/3 bg-gray-800 text-white p-6 rounded-lg shadow-xl flex flex-col justify-center items-center">
          <h3 className="text-gray-400 text-xl uppercase">Total Amount</h3>
          <h1 className="text-5xl font-bold mt-2">₹{total.toFixed(2)}</h1>
          
          <button className="mt-8 w-full bg-blue-500 py-4 rounded-lg font-bold text-xl hover:bg-blue-600">
            PRINT RECEIPT
          </button>
        </div>
      </div>
    </div>
  );
}