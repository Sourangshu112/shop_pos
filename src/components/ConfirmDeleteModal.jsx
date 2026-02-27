const ConfirmDeleteModal = ({ isOpen, message, onConfirm, onCancel }) => {
  // If isOpen is false, don't render anything
  if (!isOpen) return null;

  return (
    // Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      
      // Modal Box
      <div className="bg-white p-6 rounded-lg shadow-lg text-center min-w-75">
        <p className="mb-6 text-lg text-gray-800 font-medium">{message}</p>
        
        {/* Buttons Container */}
        <div className="flex justify-center gap-4">
          <button 
            className="px-6 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 transition-colors"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button 
            className="px-6 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600 transition-colors"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>

    </div>
  );
};

export default ConfirmDeleteModal