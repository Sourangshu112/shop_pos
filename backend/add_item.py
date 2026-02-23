import sqlite3
from flask import Blueprint,jsonify,request
from datetime import datetime

from path import DB_NAME

add_item = Blueprint('add_item',__name__)

   
@add_item.route('/api/add-items-bulk', methods=['POST'])
def add_items_bulk():
    data = request.json.get('items')
    today = datetime.now().strftime("%Y-%m-%d")
    
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

        purchase_query = """
        INSERT INTO purchases (barcode, name, quantity, date)
        VALUES (?, ?, ?, ?)
        """
        purchase_params = [
            (i['barcode'], i['name'], i['stock'], today) 
            for i in data
        ]

        cursor.executemany(purchase_query, purchase_params)

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