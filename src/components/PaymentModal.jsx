export default function PaymentModal({ isOpen, onClose, onConfirm, total, itemsCount }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-96 p-6 transform transition-all scale-100">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Confirm Payment?</h2>
          <p className="text-gray-600 mt-2 text-xl font-bold">Total Items: {itemsCount}</p>
        </div>

        {/* Big Total Display */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center mb-6">
          <span className="text-sm text-blue-600 uppercase font-bold tracking-wider">Total Amount</span>
          <div className="text-4xl font-extrabold text-blue-700 mt-1">
            ₹{total.toFixed(2)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg hover:shadow-green-500/30 transition"
          >
            Confirm & Print
          </button>
        </div>

      </div>
    </div>
  );
}