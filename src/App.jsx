import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState("Connecting to Python...")

  useEffect(() => {
    // Fetch data from your local Python server
    fetch('http://127.0.0.1:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setStatus("Connected! ✅")
      })
      .catch(err => setStatus("Failed to connect ❌ (Check console)"))
  }, [])

  return (
    <div className="App">
      <h1>Soura POS System</h1>
      <p>Backend Status: <strong>{status}</strong></p>
      
      <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
            <h3>{p.name}</h3>
            <p>Price: ₹{p.price}</p>
            <p>Stock: {p.stock}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App