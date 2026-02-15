import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS

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
            barcode TEXT,
            name TEXT,
            price REAL,
            stock INTEGER
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

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)