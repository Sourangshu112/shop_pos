import { useState } from 'react';
import toast from 'react-hot-toast';
import PaymentModal from '../components/PaymentModal';

export default function Checkout({cart, setCart}) {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    setIsModalOpen(true); // <--- Open the non-blocking modal
  };

  // 2. The Real Transaction (Called by Modal)
  const processTransaction = async () => {
    setIsModalOpen(false); // Close modal first
    const loadingToast = toast.loading("Processing Transaction...");

    try {
      const res = await fetch('http://127.0.0.1:5000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cart })
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success("Transaction Complete! ✅");
        
        setCart([]); // Clear cart
        localStorage.removeItem("pos_cart");
        
        // TRIGGER PRINTING HERE LATER
      } else {
        toast.dismiss(loadingToast);
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Server connection failed");
    }
  };

  const checkStock = (item,qty) => {
    if (item.stock < qty){
      toast.error("Not enough stock... Update stock");
      return false
    }
    else
      return true
  }

  const updateQuantity = (barcode, newQuantity) => {
  setCart(cart.map((item) => 
    (item.barcode === barcode && checkStock(item,newQuantity))
      ? { ...item, quantity: newQuantity, total: parseFloat(item.price) * (parseInt(newQuantity)) } // Create new object with updated qty
      : item // Keep other items same
  ));
  };

  const addToCart = async () => {
    if (!search) return;

    const existingItemOnBarcode = cart.find((i) => i.barcode === search);
    const existingItemOnName = cart.find((i) => i.name === search);
    if (existingItemOnBarcode) {
      setCart(cart.map(item => 
        (item.barcode === search && checkStock(item,item.quantity + 1))
          ? { ...item, quantity: item.quantity + 1, total: parseFloat(item.price) * (parseInt(item.quantity || 0) + 1) } // Increase Qty
          : item
      ));
      setSearch('');
      return
    }
    if (existingItemOnName) {
      setCart(cart.map(item => 
        (item.name === search && checkStock(item,item.quantity + 1))
          ? { ...item, quantity: item.quantity + 1, total: parseFloat(item.price) * (parseInt(item.quantity || 0) + 1) } // Increase Qty
          : item
      ));
      setSearch('');
      return
    }

    // Fetch item from Python backend
    const res = await fetch(`http://127.0.0.1:5000/api/search?q=${search}`);
    
    if (res.ok) {
      const item = await res.json();
      console.log(item);
      if (checkStock(item,1)) {
        setCart([...cart, {...item,quantity: 1, total: item.price}]);
        setSearch(''); // Clear search box
      } else {
        toast.error(`${item.name} is out of stock!`);
      }
    } else {
      toast.error("Item not found in inventory.");
    }
  };

  return (
    
    <div className="p-8 flex flex-col h-full">
      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={processTransaction}
        total={totalAmount}
        itemsCount={totalItems}
      />
      
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
        <div className="flex-1 bg-white shadow-inner border rounded-lg flex flex-col overflow-hidden">
  
              {/* Scrollable Table Area */}
              <div className="flex-1 overflow-y-auto">
                <table className="min-w-full leading-normal">
                  <thead className="bg-gray-100 sticky top-0 shadow-sm">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sl. No.</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-10 text-gray-400 italic">Cart is empty...</td>
                      </tr>
                    ) : (
                      cart.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-blue-50 transition duration-150">
                          <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-700">
                            <input type="number" min="0" className="w-18 p-2 bg-gray-50 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" value={item.quantity} onChange={(e) => updateQuantity(item.barcode, parseInt(e.target.value) || 0)}/>
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-700">₹{item.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">₹{item.total.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
                  
              {/* Fixed Grand Total Footer */}
              {cart.length > 0 && (
                <div className="bg-gray-50 border-t border-gray-300 p-4 flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold text-gray-700 uppercase">Grand Total: </span>
                    <span className="text-2xl font-bold text-blue-700">
                      ₹{totalAmount}
                    </span>
                  </div>
                  <button className="w-50 bg-blue-500 py-4 rounded-lg font-bold text-xl hover:bg-blue-600" onClick={handleCheckoutClick}>
                    CONFIRM
                  </button>
                </div>
              )}
</div>

        {/* Bill Section */}
        <div className="sm:w-1/3 md:w-1/4 bg-gray-800 text-white p-6 rounded-lg shadow-xl flex flex-col justify-center items-center">
          <h3 className="text-gray-400 text-xl uppercase">Total Amount</h3>
          <h1 className="text-5xl font-bold mt-2">₹{totalAmount.toFixed(2)}</h1>
        </div>
      </div>
    </div>
  );
}