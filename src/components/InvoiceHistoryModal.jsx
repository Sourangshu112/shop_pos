import React, { useEffect, useRef } from 'react';
import { formattedDate } from '../utils/DateTime';

const InvoiceHistoryModal = ({ billData, onClose, isOpen }) => {
  const modalRef = useRef(null);

  // Focus management for the Enter key fix
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  if (!billData) return null;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      tabIndex="-1"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden outline-none"
      >
        {/* Top Header Section */}
        <div className="bg-slate-50 p-6 border-b border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Invoice Details</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Date Processed</p>
              <p className="text-sm font-medium text-slate-700">{formattedDate(billData.transaction_data.date)}</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ID: {billData.transaction_data.invoice_id}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-0 max-h-100 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Qty</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Initial Price</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Discount</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Final Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {billData.items_data.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 text-center">{item.quantity}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">₹{item.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">₹{item.discount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">₹{item.final_price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Summary */}
        <div className="p-6 border-t border-slate-100 bg-white">
          <div className="flex justify-between items-center">
          <div className="flex justify-between items-center gap-2">
            <span className="text-slate-500 font-medium">Total Items:</span>
            <span className="text-2xl font-black text-blue-600">{billData.transaction_data.total_items.toLocaleString()}</span>
          </div><div className="flex justify-between items-center gap-2">
            <span className="text-slate-500 font-medium">Grand Total</span>
            <span className="text-2xl font-black text-blue-600">₹ {billData.transaction_data.total_amount.toLocaleString()}</span>
          </div>
          </div> 
          <button 
            onClick={onClose}
            className="w-full mt-6 bg-slate-800 text-white py-2 rounded-lg font-medium hover:bg-slate-900 transition-all active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}; 

export default InvoiceHistoryModal;