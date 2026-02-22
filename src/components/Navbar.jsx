import { Info, ShoppingCart, PlusCircle, Package, BarChart3, History } from 'lucide-react';

export default function Navbar({activeTab, setActiveTab}) {
    return(
        <nav className="bg-white shadow-md p-4 flex gap-4">
        <h1 className="text-xl font-bold mr-8 text-blue-600 self-center">SyntaxLab POS</h1>
        
        <button 
          onClick={() => setActiveTab('shopDetails')}
          className={`px-4 py-2 rounded-md font-medium flex gap-2 ${activeTab === 'shopDetails' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Info size={24} />
          Details
        </button>

        <button 
          onClick={() => setActiveTab('checkout')}
          className={`px-4 py-2 rounded-md font-medium flex gap-2 ${activeTab === 'checkout' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <ShoppingCart size={24} />
          Checkout
        </button>
        
        <button 
          onClick={() => setActiveTab('add_item')}
          className={`px-4 py-2 rounded-md font-medium flex gap-2 ${activeTab === 'add_item' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <PlusCircle size={24} />
          Add Item
        </button>
        
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-md font-medium flex gap-2 ${activeTab === 'inventory' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Package size={24} />
          Inventory
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-md font-medium flex gap-2 ${activeTab === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <BarChart3 size={24} />
          Analytics
        </button>

        <button 
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-md font-medium flex gap-2 ${activeTab === 'history' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}

        >
          <History size={24} />
          History
        </button>
      </nav>
    )
}