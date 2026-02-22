import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { getFirstDay,getLastDay } from '../utils/DateTime';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function Analytics() {
  const [salesData, setSalesData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [startDate, setStartDate] = useState(getFirstDay());
  const [endDate, setEndDate] = useState(getLastDay());
  

  const fetchData = async() => {
      try {
        const res1 = await fetch(`http://127.0.0.1:5000/api/analytics/sales-per-item?startDate=${startDate}&endDate=${endDate}`);
        if (res1.ok){
          const data = await res1.json()
          setSalesData(data);
        }
        else throw new Error("Failed in Loading")

        const res2 = await fetch(`http://127.0.0.1:5000/api/analytics/revenue-per-day?startDate=${startDate}&endDate=${endDate}`);
        if(res2.ok){
          const data = await res2.json();
          setTrendData(processChartData(data.trend,startDate, endDate));
        }
         else throw new Error("Failed in Loading")
      }
      catch (error) {
        toast.error("Failed try again")
        console.error("Could not fetch sales data:", error);
      }
    }

  useEffect( () => {
    fetchData()
  }, []);

  const exportToExcel = () => {
    const worksheet1 = XLSX.utils.json_to_sheet(salesData);
    const worksheet2 = XLSX.utils.json_to_sheet(trendData)

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet1, "Sales Record");
    XLSX.utils.book_append_sheet(workbook, worksheet2, "Sales Per Day Record");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `Data_Between_${startDate}_and_${endDate}.xlsx`);
};

  const processChartData = (data, startDate, endDate) => {
  // 1. Create an array of all dates in the range
  const allDates = eachDayOfInterval({
    start: parseISO(startDate),
    end: parseISO(endDate)
  });

  return allDates.map(date => {
    // Check if this specific date exists in your backend data
    const found = data.find(d => isSameDay(parseISO(d.date), date));
    
    return {
      date: format(date, 'yyyy-MM-dd'), // Format x-axis label
      revenue: found ? found.revenue : null // Use existing revenue or default to 0
    };
  });
};

  return (
    <div className="p-8 h-full bg-gray-50 overflow-y-auto">
      <div className='flex justify-between items-center mb-6 gap-4'>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>
        <div className='flex px-2 gap-4'>
          <div className='flex flex-col px-2 gap-1'>
            <label className="text-sm font-semibold text-gray-600 ml-1">Starting Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div className='flex flex-col px-2 gap-1'>
            <label className="text-sm font-semibold text-gray-600 ml-1">End Date</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
            </div>
            <button 
              onClick={fetchData} 
              className="text-md font-bold text-blue-900 border border-blue-900  bg-blue-200  px-6 py-3 rounded-2xl hover:bg-blue-500 hover:text-blue-100"
            >
              Fetch Data
            </button>
            <button 
              onClick={() => exportToExcel()}
              className="bg-green-600 text-white text-md font-bold hover:bg-green-700 transition px-6 py-3 rounded-2xl"
            >
              Export to Excel
            </button>
        </div>
      </div>
      {/* TOP ROW: Trend Chart & Low Stock */}
      {/* BOTTOM ROW: The original Bar Chart */}
      <div className="mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
        <h3 className="text-lg font-semibold text-gray-600 mb-4">Top Selling Items</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData.slice(0, 10)}>
             {/* ... your existing BarChart code ... */}
             <CartesianGrid strokeDasharray="3 3" vertical={false} />
             <XAxis dataKey="name" />
             <YAxis />
             <Tooltip />
             <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>

      {/* 1. REVENUE TREND (Line Chart) takes up 2/3rds */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">Monthly Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  dot={{r: 4}} 
                  activeDot={{r: 8}} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
    </div>
  );
}