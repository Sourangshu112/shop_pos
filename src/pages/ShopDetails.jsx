export default function ShopDetails({shopDetails, setShopDetails}){
    return (
        <div className="p-10  mx-50 bg-white rounded-lg shadow mt-10">
            <h2 className="text-2xl font-bold mb-4">Shop Details</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Shop Name</label>
              <input 
                value={shopDetails.name} 
                onChange={(e) => setShopDetails({...shopDetails, name: e.target.value})}
                className="shadow appearance-none border rounded w-full h-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Phone No.</label>
              <input 
                value={shopDetails.phone} 
                onChange={(e) => setShopDetails({...shopDetails, phone: e.target.value})}
                className="shadow appearance-none border rounded w-full h-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">GST No.</label>
              <input 
                value={shopDetails.gst} 
                onChange={(e) => setShopDetails({...shopDetails, gst: e.target.value})}
                className="shadow appearance-none border rounded w-full h-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
              <textarea 
                value={shopDetails.address} 
                onChange={(e) => setShopDetails({...shopDetails, address: e.target.value})}
                className="shadow appearance-none border rounded w-full h-30 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              />
            </div>
        </div>
    )
}