import { useState } from 'react';

export default function AddItem() {
  const [form, setForm] = useState({ barcode: '', name: '', price: '', stock: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveItem = async () => {
    if (!form.barcode || !form.name || !form.price || !form.stock) {
      alert("All fields are required");
      return;
    }

    const res = await fetch('http://127.0.0.1:5000/api/add-item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert(`${form.name} added to database!`);
      setForm({ barcode: '', name: '', price: '', stock: '' }); // Clear inputs
    } else {
      alert("Error saving item");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Item</h2>
      
      {/* Grid Layout mimicking your ctk.grid() */}
      <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        
        <input 
          name="barcode" placeholder="Barcode" value={form.barcode} onChange={handleChange}
          className="p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input 
          name="name" placeholder="Item Name" value={form.name} onChange={handleChange}
          className="p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input 
          name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange}
          className="p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input 
          name="stock" type="number" placeholder="Stock Quantity" value={form.stock} onChange={handleChange}
          className="p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button 
          onClick={saveItem}
          className="col-span-2 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Save to Inventory
        </button>
      </div>
    </div>
  );
}