import { useState, useEffect, useRef } from 'react'; // Import useRef
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function AddItem({itemsList, setItemsList}) {
  const [form, setForm] = useState({ barcode: '', name: '', price: '', stock: '', lock: false });
  const [items, setItems] = useState([]);
  
  // NEW: State to lock fields if item exists
  const [isLocked, setIsLocked] = useState(false);

  // NEW: Refs for auto-focusing
  const nameInputRef = useRef(null);
  const stockInputRef = useRef(null);
  const barcodeInputRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/inventory');

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- NEW: BARCODE SCAN LOGIC ---
  const handleBarcodeKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === "Tab") {
      e.preventDefault(); // Stop form submission if any
      
      const scannedBarcode = form.barcode.trim();
      if (!scannedBarcode)
        return;

      if (itemsList.find(i => i.barcode === scannedBarcode)){
        toast.error("Item already in list... Make change in List");
        setForm({ barcode: '', name: '', price: '', stock: '' });
        return
      }

      // Check if item exists in the database
      const foundItem = items.find(i => i.barcode === scannedBarcode);

      if (foundItem) {
        setForm({
          ...form,
          name: foundItem.name,
          price: foundItem.price,
          lock: true,
          stock: ''
        });
        setIsLocked(true);
        toast.success("Item found! Enter stock quantity.");
        stockInputRef.current.focus();
      } else {
        setIsLocked(false);
        setForm({...form, name: '', price: '', stock: '', lock: false })
        toast("New Item. Please enter details.", { icon: '🆕' });
        setTimeout(() => {
        nameInputRef.current?.focus();
        }, 0);
      }
    }
  };

  const updateItem = (id, field, value) => {
    setItemsList(itemsList.map(item => 
      item.tempId === id ? { ...item, [field]: value } : item
    ));
  };

  const handleChange = (e) => {
    if (e.target.name === "barcode") {
      setIsLocked(false);
      setForm({barcode: e.target.value, name: '', price: '', stock: '', lock: false });
      return;
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addToTable = () => {
    if (!form.barcode || !form.name || !form.price || !form.stock) {
      toast.error("All fields are required");
      return;
    }

    const newItem = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      tempId: Date.now() 
    };

    if (isNaN(newItem.price) || isNaN(newItem.stock)) {
      toast.error("Price and Stock must be numbers");
      return;
    }

    setItemsList([...itemsList, newItem]);
    
    // RESET EVERYTHING FOR NEXT ITEM
    setForm({ barcode: '', name: '', price: '', stock: '', lock: false });
    setIsLocked(false); // <--- Unlock for next scan
    barcodeInputRef.current.focus(); // Go back to start
  };

  const removeItem = id => setItemsList(itemsList.filter(item => item.tempId !== id));

  const saveAllToDatabase = async () => {
    if (itemsList.length === 0) {
      toast.error("List is empty!");
      return;
    }

    const loadingToast = toast.loading("Saving to Inventory...");

    try {
      // We will send the WHOLE list to Python
      const res = await fetch('http://127.0.0.1:5000/api/add-items-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsList })
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success(`Successfully added ${itemsList.length} items!`);
        setItemsList([]); // Clear the table
      } else {
        toast.dismiss(loadingToast);
        toast.error(`Error: ${data.error}`);
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Server connection failed");
    }
  };


  return (
    <div className="p-8 mx-auto h-full flex flex-col">
       {/* ... Header ... */}
      
      {/* --- INPUT SECTION --- */}
      <div className="grid grid-cols-12 gap-4 bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <div className="col-span-3">
          <label className="text-xs font-bold text-gray-500 uppercase">Barcode</label>
          <input 
            ref={barcodeInputRef} // Attach Ref
            name="barcode" 
            placeholder="Scan & Hit Enter..." 
            value={form.barcode} 
            onChange={handleChange}
            onKeyDown={handleBarcodeKeyDown} // <--- Attach Handler
            autoFocus
            className="w-full mt-1 p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="col-span-4">
          <label className="text-xs font-bold text-gray-500 uppercase">Item Name</label>
          <input 
            ref={nameInputRef} // Attach Ref
            name="name" 
            placeholder="Product Name" 
            value={form.name}
            onFocus={handleBarcodeKeyDown}
            onChange={handleChange}
            disabled={isLocked} // <--- DISABLED IF FOUND
            className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLocked ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-50'}`} 
          />
        </div>
        
        <div className="col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Price</label>
          <input 
            name="price" 
            type="number" 
            placeholder="0.00" 
            value={form.price} 
            onChange={handleChange} 
            disabled={isLocked} // <--- DISABLED IF FOUND
            className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLocked ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-50'}`}
          />
        </div>
        
        <div className="col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Stock</label>
          <input 
            ref={stockInputRef} // Attach Ref
            name="stock" 
            type="number" 
            placeholder="0" 
            value={form.stock} 
            onChange={handleChange} 
            onKeyDown={(e) => e.key === 'Enter' && addToTable()} 
            className="w-full mt-1 p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          onClick={addToTable}
          className="col-span-1 mt-6 h-12.5 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-800 transition flex justify-center items-center text-xl"
        >
          ADD
        </button>
      </div>
      <div className="flex-1 bg-white shadow-inner border rounded-lg flex flex-col overflow-hidden mb-4">
        {/* ... table code ... */}
         <div className="flex-1 overflow-y-auto">
          <table className="min-w-full leading-normal">
            <thead className="bg-gray-100 sticky top-0 shadow-sm">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Barcode</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-5 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-5 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {itemsList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-400 italic">No items queued yet...</td>
                </tr>
              ) : (
                itemsList.map((item) => (
                  <tr key={item.tempId} className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-5 py-2 text-sm text-gray-700">{item.barcode}</td>
                    <td className="px-5 py-2 text-sm font-medium text-gray-900">
                      <input 
                        className= {`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${item.lock ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                        value={item.name} onChange={(e) => updateItem(item.tempId, 'name', e.target.value)}
                        disabled={item.lock}
                        />
                    </td>
                    <td className="px-5 py-2 text-sm text-center text-gray-700">
                      <div className="flex items-center justify-center">
                        <span className="mr-1">₹</span>
                        <input 
                        type="number" 
                        className= {`w-16 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${item.lock ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                        value={item.price} onChange={(e) => updateItem(item.tempId, 'price', parseFloat(e.target.value) || 0)}
                        disabled={item.lock}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-2 text-sm text-center text-gray-700">
                      <input type="number" className="w-20 p-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 outline-none" value={item.stock} onChange={(e) => updateItem(item.tempId, 'stock', parseInt(e.target.value) || 0)}/>
                    </td>
                    <td className="px-5 py-2 text-center">
                      <button onClick={() => removeItem(item.tempId)} className="text-red-500 text-sm hover:text-red-700 font-bold px-3 py-1 rounded-full hover:bg-red-100 transition">
                        <Trash2 size={24} color='red' />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
       {itemsList.length > 0 && (
        <button 
          onClick={saveAllToDatabase}
          className="w-full py-4 bg-green-600 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-green-700 active:scale-99 transition"
        >
          SAVE ALL TO INVENTORY ({itemsList.length})
        </button>
      )}
    </div>
  );
}