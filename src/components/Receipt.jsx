const Receipt = ({items, cart, total, shopDetails, orderId, date }) => {
  return (
    <div className="p-2 bg-white text-black font-mono text-sm leading-tight h-full">
      
      {/* 1. HEADER */}
      <div className="text-center mb-2">
        <h1 className="text-xl font-bold uppercase">{shopDetails.name}</h1>
        <p className="text-xs">{shopDetails.address}</p>
        <p className="text-xs">Phone No.: {shopDetails.phone}</p>
        {shopDetails.gst ? <p className="text-xs">GST No.: {shopDetails.gst}</p> : <></>}
        <div className="my-2 border-b border-black border-dashed"></div>
      </div>

      {/* 2. INVOICE INFO */}
      <div className="text-xs mb-2">
        <p>Date: {date}</p>
        <p>Inv: #{orderId}</p>
      </div>

      <div className="border-b border-black border-dashed"></div>

      {/* 3. ITEMS TABLE (Fixed Width Columns) */}
      <table className="w-full text-xs text-left mb-2">
        <thead className="border-b border-black border-dashed">
          <tr>
            <th className="w-[45%] py-1 ">Item</th>
            <th className="w-[15%] py-1 ">Qty</th>
            <th className="w-[15%] py-1  text-center">Price</th>
            <th className="w-[25%] py-1  text-center">Amt</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (<>
            <tr key={index} >
              <td className="w-[45%] py-1 align-top pr-5 max-w-30">{item.name}</td>
              <td className="w-[15%] py-1 align-top">{item.quantity}</td>
              <td className="w-[15%] py-1 align-top text-center">{item.price}</td>
              <td className="w-[25%] py-1 align-top text-center">
                {(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td className="w-[25%] py-1 align-top text-center">-{item.discount}</td>
            </tr>
            </>
          ))}
        </tbody>
      </table>
      
      <div className="border-b border-black border-dashed"></div>

      {/* 4. TOTALS */}
      <div className="flex justify-between text-md font-bold py-2">
        <div><span>Items : {items}</span></div>
        <div><span>TOTAL : ₹{total.toFixed(2)}</span></div>
      </div>
      
      <div className="border-b border-black border-dashed"></div>

      {/* 5. FOOTER */}
      <div className="text-center text-xs">
        <p>Thank you for visiting!</p>
        <p></p>
        <p className="mt-2 text-[10px]">Powered by SyntaxLabPOS</p>
      </div>

    </div>
  );
};

export default Receipt;