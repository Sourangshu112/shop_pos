import React from 'react';

// We wrap this in a class to use with the 'react-to-print' library later if needed
// Or just standard CSS printing
export const Receipt = React.forwardRef(({ cart, total, shopDetails, orderId, date }, ref) => {
  return (
    <div ref={ref} className="hidden-on-screen print:block p-2 bg-white text-black font-mono text-sm leading-tight h-full">
      
      {/* 1. HEADER */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold uppercase">{shopDetails.name}</h1>
        <p className="text-xs">{shopDetails.address}</p>
        <p className="text-xs">Phone No.: {shopDetails.phone}</p>
        <div className="my-2 border-b border-black border-dashed"></div>
      </div>

      {/* 2. INVOICE INFO */}
      <div className="flex justify-between text-xs mb-2">
        <span>Date: {date}</span>
        <span>Inv: #{orderId}</span>
      </div>
      <div className="border-b border-black border-dashed mb-2"></div>

      {/* 3. ITEMS TABLE (Fixed Width Columns) */}
      <table className="w-full text-xs text-left mb-2">
        <thead>
          <tr>
            <th className="w-40">Item</th>
            <th className="w-8">Qty</th>
            <th className="text-right">Price</th>
            <th className="text-right">Amt</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td className="align-top pr-5 max-w-30">
                {item.name}
              </td>
              <td className="align-top">{item.quantity}</td>
              <td className="align-top text-right">{item.price}</td>
              <td className="align-top text-right">
                {(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="border-b border-black border-dashed my-2"></div>

      {/* 4. TOTALS */}
      <div className="flex justify-between text-md font-bold">
        <span>TOTAL</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
      

      <div className="border-b border-black border-dashed my-4"></div>

      {/* 5. FOOTER */}
      <div className="text-center text-xs">
        <p>Thank you for visiting!</p>
        <p></p>
        <p className="mt-2 text-[10px]">Powered by SouraPOS</p>
      </div>

    </div>
  );
});

export default Receipt;