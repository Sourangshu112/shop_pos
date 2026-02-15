import { useState } from 'react';
import AddItem from './pages/AddItems';
import Checkout from './pages/Checkout';
import Inventory from './pages/Inventory';

function App() {
  const [activeTab, setActiveTab] = useState('checkout');

  return (
    <div className="h-screen flex flex-col bg-gray-100 text-gray-900 font-sans">
      
      {/* Navigation Bar (Tabs) */}
      <nav className="bg-white shadow-md p-4 flex gap-4">
        <h1 className="text-xl font-bold mr-8 text-blue-600 self-center">Soura POS</h1>
        
        <button 
          onClick={() => setActiveTab('checkout')}
          className={`px-4 py-2 rounded-md font-medium ${activeTab === 'checkout' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Checkout
        </button>
        
        <button 
          onClick={() => setActiveTab('add_item')}
          className={`px-4 py-2 rounded-md font-medium ${activeTab === 'add_item' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Add Item
        </button>
        
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-md font-medium ${activeTab === 'inventory' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Inventory
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'checkout' && <Checkout />}
        {activeTab === 'add_item' && <AddItem />}
        {activeTab === 'inventory' && <Inventory />}
      </main>
      
    </div>
  );
}

export default App;