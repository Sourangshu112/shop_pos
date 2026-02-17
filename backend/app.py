import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

DB_NAME = "pos.db"

def init_db():
    """Initialize database if not exists (similar to your setup)"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            barcode TEXT UNIQUE,
            name TEXT,
            price REAL,
            stock INTEGER
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            barcode TEXT,
            name TEXT,
            quantity INTEGER,
            total_price REAL,
            date TEXT  -- Stored as YYYY-MM-DD
        )
    """)

    conn.commit()
    conn.close()


# Initialize DB on start
init_db()

# --- 1. ADD ITEM ENDPOINT ---
@app.route('/api/add-item', methods=['POST'])
def add_item():
    data = request.json
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO inventory (barcode, name, price, stock) VALUES (?, ?, ?, ?)",
            (data['barcode'], data['name'], float(data['price']), int(data['stock']))
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Item added successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- 2. INVENTORY ENDPOINT ---
@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row # Allows accessing columns by name
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM inventory")
    rows = cursor.fetchall()
    conn.close()
    
    # Convert to list of dicts for React
    result = [dict(row) for row in rows]
    return jsonify(result)

# --- 3. CHECKOUT SEARCH ENDPOINT ---
@app.route('/api/search', methods=['GET'])
def search_item():
    query = request.args.get('q')
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Search by Barcode OR Name (logic from your checkout_page.py)
    cursor.execute("SELECT * FROM inventory WHERE barcode=? OR name=?", (query, query))
    item = cursor.fetchone()
    conn.close()
    
    if item:
        return jsonify(dict(item))
    else:
        return jsonify({"error": "Item not found"}), 404
    
# backend/app.py

@app.route('/api/checkout', methods=['POST'])
def checkout():
    cart = request.json.get('cart') # Expecting a list of items
    if not cart:
        return jsonify({"error": "Cart is empty"}), 400

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    try:
        today = datetime.now().strftime("%Y-%m-%d")
        for item in cart:
            barcode = item['barcode']
            quantity_sold = item['quantity']

            cursor.execute("SELECT stock, name FROM inventory WHERE barcode=?", (barcode,))
            row = cursor.fetchone()
            
            if not row:
                raise Exception(f"Item {barcode} not found")
            
            current_stock = row[0]
            item_name = row[1]

            if current_stock < quantity_sold:
                raise Exception(f"Not enough stock for {item_name}. Only {current_stock} left.")

            new_stock = current_stock - quantity_sold
            cursor.execute("UPDATE inventory SET stock=? WHERE barcode=?", (new_stock, barcode))

            cursor.execute("""
                INSERT INTO sales (barcode, name, quantity, total_price, date) VALUES (?, ?, ?, ?, ?)""", 
                (barcode, item_name, quantity_sold, item['price'] * quantity_sold, today))

        conn.commit()
        return jsonify({"message": "Sale successful!", "status": "success"}), 200
    
    

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
    
@app.route('/api/add-items-bulk', methods=['POST'])
def add_items_bulk():
    data = request.json.get('items') # We expect a list called "items"
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    try:
        query = """
        INSERT INTO inventory (barcode, name, price, stock) 
        VALUES (?, ?, ?, ?)
        ON CONFLICT(barcode) 
        DO UPDATE SET stock = inventory.stock + excluded.stock
        """
        params = [(i['barcode'], i['name'], i['price'], i['stock']) for i in data]
        cursor.executemany(query, params)
        conn.commit()
        return jsonify({"message": "Batch upload successful"}), 200

    except sqlite3.IntegrityError:
        conn.rollback()
        return jsonify({"error": "One or more barcodes already exist in database"}), 400
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
        
    finally:
        conn.close()
    
@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Query: Sum of quantity per item (Grouped by Name)
    # You can filter by date here if you want (e.g., WHERE date LIKE '2023-10%')
    cursor.execute("""
        SELECT name, SUM(quantity) as total_sold 
        FROM sales 
        GROUP BY name 
        ORDER BY total_sold DESC 
        LIMIT 10
    """)
    rows = cursor.fetchall()
    conn.close()
    
    # Format for Recharts: [{name: 'Maggi', sales: 50}, ...]
    data = [{"name": row[0], "sales": row[1]} for row in rows]
    return jsonify(data)

@app.route('/api/analytics/advanced', methods=['GET'])
def get_advanced_analytics():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # 1. DAILY TREND (Last 7 days)
    # Group sales by date and sum the total_price
    cursor.execute("""
        SELECT date, SUM(total_price) as daily_revenue 
        FROM sales 
        GROUP BY date 
        ORDER BY date DESC 
        LIMIT 7
    """)
    trend_data = [{"date": row[0], "revenue": row[1]} for row in cursor.fetchall()]
    # Reverse so it flows left-to-right (Oldest -> Newest)
    trend_data.reverse() 

    # 2. LOW STOCK ITEMS
    cursor.execute("SELECT name, stock FROM inventory WHERE stock < 10 ORDER BY stock ASC LIMIT 5")
    low_stock_data = [{"name": row[0], "stock": row[1]} for row in cursor.fetchall()]

    conn.close()
    
    return jsonify({
        "trend": trend_data,
        "low_stock": low_stock_data
    })

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)