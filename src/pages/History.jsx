import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import InvoiceHistoryModal from '../components/InvoiceHistoryModal';
import { Search } from 'lucide-react';
import { today } from '../utils/DateTime';

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [billHistory, setBillHistory] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState(today());

  const getHistory = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/history');
      
      // Check if the server actually returned a 200 OK
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to load history:", err);
      toast.error("Failed from get");
    }
  };

  const getHistoryOfDate = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/history-date?date=${filterDate}`);
      
      // Check if the server actually returned a 200 OK
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to load history:", err);
      toast.error("Failed from date");
    }
  };
  
  useEffect(() => {
  if (!searchTerm) {
    if (filterDate) {
      getHistoryOfDate();
    } else {
      getHistory();
    }
  }
}, [filterDate, searchTerm]);

  const searchHistory = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/history-search?id=${searchTerm}`);
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      console.log(data);
      setTransactions(data);
      toast.success("Success in finding");
      setFilterDate("")
    }
    catch (err) {
      console.error("Failed to load history:", err);
      toast.error("Failed");
    }
  };

  const openPdf = async (invoiceId) => {
    const loading = toast.loading("Opening PDF...");
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/open-invoice/${invoiceId}`);
      if(res.ok) {
        toast.dismiss(loading);
        toast.success("Invoice Opened");
      } else {
        toast.dismiss(loading);
        toast.error("File missing!");
      }
    } catch (e) {
      toast.dismiss(loading);
    }
  };

  const openItem = async (invoiceId) => {
    const loading = toast.loading("Opening ...");
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/open-items/${invoiceId}`);
      if(res.ok) {
        toast.dismiss(loading);
        toast.success("Success");
        const data = await res.json();
        setBillHistory(data)
        setIsModalOpen(true);
      } else {
        toast.dismiss(loading);
        toast.error("Failed");
      }
    } catch (e) {
      toast.dismiss(loading);
    }

  }

  return (
    <div className="p-8 h-full bg-gray-50 flex flex-col">
      <InvoiceHistoryModal billData={billHistory} onClose={() => setIsModalOpen(false)} isOpen={isModalOpen} />
      <div className='flex justify-between items-center mb-6 gap-4'>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Transactions</h2>
        <div className='flex gap-1'>
          <input 
          type="text"
          placeholder="Search by Invoice-Id"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {e.key === 'Enter' && searchHistory()}}
          className="flex-1 max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button className='bg-blue-500 p-2 rounded-md' onClick={searchHistory}><Search size={24} color='white' /></button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Date:</label>
          <input
            type={filterDate ? "date" : "text"} 
            onFocus={(e) => (e.target.type = "date")} 
            onBlur={(e) => !e.target.value && (e.target.type = "text")} 
            placeholder="All Date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none w-40 text-center placeholder-black"
            />
            {(filterDate && <button 
              onClick={() => setFilterDate("")} 
              className="text-md font-bold text-blue-900 hover:underline bg-blue-200 px-6 py-3 rounded-2xl"
            >
              Clear Date
            </button>)}
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden flex-1 overflow-y-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-bold sticky top-0">
              <th className="px-5 py-3 text-left">Date / Time</th>
              <th className="px-5 py-3 text-left">Invoice ID</th>
              <th className="px-5 py-3 text-center">Items</th>
              <th className="px-5 py-3 text-right">Total Amount</th>
              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
               <tr><td colSpan="5" className="text-center py-10 text-gray-400">No transactions yet.</td></tr>
            ) : (
              transactions.map((txn) => (
                <tr key={txn.invoice_id} className="border-b border-gray-200 hover:bg-blue-50">
                  <td className="px-5 py-4 text-sm text-gray-700">{txn.date}</td>
                  <td className="px-5 py-4 text-sm font-mono text-gray-600">{txn.invoice_id}</td>
                  <td className="px-5 py-4 text-sm text-center">{txn.items_count}</td>
                  <td className="px-5 py-4 text-sm text-right font-bold text-gray-800">
                    ₹{txn.total_amount.toFixed(2)}
                  </td>
                  <td className="pl-5 py-4 gap-2 text-center">
                    <button 
                      onClick={() => openItem(txn.invoice_id)}
                      className="bg-red-100 text-green-600 hover:bg-red-200 px-3 py-1 rounded text-xs font-bold border border-red-200 transition mx-2"
                    >
                      📄 VIEW ITEMS
                    </button>
                    <button 
                      onClick={() => openPdf(txn.invoice_id)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded text-xs font-bold border border-red-200 transition mx-2"
                    >
                      📄 VIEW PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}