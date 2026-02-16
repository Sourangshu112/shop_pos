export default function Navbar({activeTab, setActiveTab}) {
    return(
        <nav className="bg-white shadow-md p-4 flex gap-4">
        <h1 className="text-xl font-bold mr-8 text-blue-600 self-center">Soura POS</h1>
        
        <button 
          onClick={() => setActiveTab('shopDetails')}
          className={`px-4 py-2 rounded-md font-medium ${activeTab === 'shopDetails' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Details
        </button>

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
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-md font-medium ${activeTab === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Analytics
        </button>
      </nav>
    )
}