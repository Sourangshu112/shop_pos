import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import AddItem from './pages/AddItems';
import Checkout from './pages/Checkout';
import Inventory from './pages/Inventory';
import Analytics from './pages/Analytics';
import ShopDetails from './pages/ShopDetails';
import History from './pages/History';
import PurchaseHistory from './pages/PurchaseHistory';
import Navbar from './components/Navbar';

function App() {
  const [activeTab, setActiveTab] = useState('checkout');
  const [cart, setCart] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [shopDetails, setShopDetails] = useState(() => {
    const saved = localStorage.getItem("pos_shop");
    return saved ? JSON.parse(saved) : { name: "", address: "", gst: "", phone: "" };
  });

  useEffect(() => {
    localStorage.setItem("pos_shop", JSON.stringify(shopDetails));
  }, [shopDetails]);

  return (
    <div className="h-screen flex flex-col bg-gray-100 text-gray-900 font-sans">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      {/* Navigation Bar (Tabs) */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'shopDetails' && <ShopDetails shopDetails={shopDetails} setShopDetails={setShopDetails} />}
        {activeTab === 'checkout' && <Checkout cart={cart} setCart={setCart} shopDetails={shopDetails} />}
        {activeTab === 'add_item' && <AddItem itemsList={itemsList} setItemsList={setItemsList}  />}
        {activeTab === 'inventory' && <Inventory />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'purchase' && <PurchaseHistory />}
        {activeTab === 'history' && <History />}
      </main>
      
    </div>
  );
}

export default App;