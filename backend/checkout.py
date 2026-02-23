import sqlite3
from flask import Blueprint,jsonify,request
from datetime import datetime
import os
import json
import subprocess

from path import DB_NAME,INVOICE_PATH

checkout = Blueprint('chekcout',__name__)

@checkout.route('/api/search', methods=['GET'])
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
    

@checkout.route('/api/checkout-with-pdf', methods=['POST'])
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
                    INSERT INTO sales (invoice_id, barcode, name, quantity, total_price, discount, final_price, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)""", 
                    (invoice_id, barcode, item_name, quantity_sold, item['total'],item['discount'],item['finalprice'], today))
    
        except Exception as e:
            conn.rollback()
            return jsonify({"error": str(e)}), 500


        # 2. SAVE THE PDF FILE
        filename = f"{invoice_id}.pdf"
        save_path = os.path.join(INVOICE_PATH, filename)
        pdf_file.save(save_path) 

        # 3. SAVE TRANSACTION RECORD
        cursor.execute("""
            INSERT INTO transactions (invoice_id, date, total_amount, items_count)
            VALUES (?, ?, ?, ?)
        """, (invoice_id, today, grand_total, total_items))

        conn.commit()
        print_receipt_pdf(save_path)
        return jsonify({"message": "Success", "invoice_id": invoice_id}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

print_enabled = True

def print_receipt_pdf(pdf_path):
    if not print_enabled:
        return
    
    sumatra_path = "SumatraPDF.exe"
    command = [sumatra_path, '-print-to-default', '-silent', '-print-settings', 'shrink', pdf_path]
    try:
        subprocess.run(command, check=True, creationflags=subprocess.CREATE_NO_WINDOW)
    except subprocess.CalledProcessError as e:
        return (f"Failed to Print {e}")


@checkout.route('/api/toggle-print', methods=['GET'])
def toggle_print():
    global print_enabled
    value = request.args.get('value')
    if not value:
        return jsonify({"error": "Missing 'value' parameter"}), 400
    if value.lower() == "true":
        print_enabled = True
    else:
        print_enabled = False
    return jsonify({"success": True, "print_enabled": print_enabled}), 200
