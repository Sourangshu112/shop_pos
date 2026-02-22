import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import os
import json
from werkzeug.utils import secure_filename
import subprocess

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
            invoice_id TEXT,
            barcode TEXT,
            name TEXT,
            quantity INTEGER,
            total_price REAL,
            date TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            invoice_id TEXT PRIMARY KEY,
            date TEXT,
            total_amount REAL,
            items_count INTEGER,
            pdf_path TEXT
        )
    """)

    conn.commit()
    conn.close()

    if not os.path.exists("invoices"):
        os.makedirs("invoices")


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
    
@app.route('/api/analytics/sales-per-item', methods=['GET'])
def get_sales_per_item_analytics():
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')

    if not start_date or not end_date:
        return jsonify({
            "error": "Missing parameters", 
            "message": "Both startDate and endDate are required"
        }), 400
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT name, SUM(quantity) as total_sold 
        FROM sales 
        WHERE date BETWEEN ? AND ?
        GROUP BY name 
        ORDER BY total_sold DESC
    """, (start_date, end_date))
    rows = cursor.fetchall()
    conn.close()
    
    # Format for Recharts: [{name: 'Maggi', sales: 50}, ...]
    data = [{"name": row[0], "sales": row[1]} for row in rows]
    return jsonify(data)

@app.route('/api/analytics/revenue-per-day', methods=['GET'])
def get_revenue_per_day_analytics():
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')

    if not start_date or not end_date:
        return jsonify({
            "error": "Missing parameters", 
            "message": "Both startDate and endDate are required"
        }), 400
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT date, SUM(total_price) as daily_revenue 
        FROM sales
        WHERE date BETWEEN ? AND ? 
        GROUP BY date 
        ORDER BY date DESC 
    """, (start_date, end_date))

    trend_data = [{"date": row[0], "revenue": row[1]} for row in cursor.fetchall()]
    # Reverse so it flows left-to-right (Oldest -> Newest)
    trend_data.reverse() 

    conn.close()
    
    return jsonify({
        "trend": trend_data
    })

@app.route('/api/checkout-with-pdf', methods=['POST'])
def checkout_with_pdf():
    # 1. GET DATA FROM FORM
    try:
        cart_data = request.form.get('cart')
        pdf_file = request.files.get('invoice_pdf')
        invoice_id = request.form.get('invoice_id')
        grand_total = request.form.get('total_amount')
        total_items = request.form.get('total_items')

        if not cart_data or not pdf_file:
            return jsonify({"error": "Missing cart or PDF file"}), 400

        cart = json.loads(cart_data) # Convert string back to JSON list
    except Exception as e:
        return jsonify({"error": f"Bad data: {str(e)}"}), 400

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    try:
        # Generate Invoice ID        
        today = datetime.now().strftime("%Y-%m-%d")

        # ... (Keep your Stock Update & Sales Logic exactly the same) ...
        try:
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
                    INSERT INTO sales (invoice_id, barcode, name, quantity, total_price, date) VALUES (?, ?, ?, ?, ?, ?)""", 
                    (invoice_id, barcode, item_name, quantity_sold, item['price'] * quantity_sold, today))
    
        except Exception as e:
            conn.rollback()
            return jsonify({"error": str(e)}), 500


        # 2. SAVE THE PDF FILE
        filename = f"{invoice_id}.pdf"
        save_path = os.path.join("invoices", filename)
        pdf_file.save(save_path) # <--- SAVING THE FILE FROM REACT

        # 3. SAVE TRANSACTION RECORD
        cursor.execute("""
            INSERT INTO transactions (invoice_id, date, total_amount, items_count, pdf_path)
            VALUES (?, ?, ?, ?, ?)
        """, (invoice_id, today, grand_total, total_items, save_path))

        conn.commit()
        return jsonify({"message": "Success", "invoice_id": invoice_id}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/history', methods=['GET'])
def get_history():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions ORDER BY date DESC")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route('/api/history-search', methods=['GET'])
def search_history():
    id = request.args.get("id")
    if not id:
        return jsonify({
            "error": "Missing parameters", 
            "message": "Both startDate and endDate are required"
        }), 400
    
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions WHERE invoice_id = ?",(id,))
    row = cursor.fetchone()
    conn.close()
    return jsonify([dict(row)])

@app.route('/api/history-date', methods=['GET'])
def date_history():
    date = request.args.get("date")
    if not date:
        return get_history()
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions WHERE date = ? ORDER BY date DESC",(date,))
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


# 5. OPEN PDF ENDPOINT (Uses system default viewer)
@app.route('/api/open-invoice/<path:invoice_id>', methods=['GET'])
def open_invoice(invoice_id):
    # This relies on Windows 'start' command or Mac 'open'
    path = os.path.abspath(f"invoices/{invoice_id}.pdf")
    if os.path.exists(path):
        if os.name == 'nt': # Windows
            os.startfile(path)
        else: # Mac/Linux
            subprocess.call(('open', path))
        return jsonify({"message": "Opened"}), 200
    return jsonify({"error": "File not found"}), 404

@app.route('/api/open-items/<item_id>', methods=['GET'])
def get_item(item_id):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sales WHERE invoice_id = ?",(item_id,))
    data_raw = cursor.fetchall()
    data = [{"name" : i[3], "quantity": i[4], "total": i[5]} for i in data_raw]
    # Flask automatically passes 'item_id' as an argument
    return jsonify({
        "invoice_id": item_id,
        "date" : data_raw[0][-1],
        "data" : data,
    })

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)