import sqlite3
from flask import Blueprint, jsonify

from path import DB_NAME

inventory = Blueprint('inventory', __name__)

@inventory.route('/api/inventory', methods=['GET'])
def get_inventory():
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row # Allows accessing columns by name
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM inventory")
        rows = cursor.fetchall()
        conn.close()

        # Convert to list of dicts for React
        result = [dict(row) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@inventory.route('/api/inventory-delete/<barcode>', methods=['DELETE'])
def delete_from_inventory(barcode):
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM inventory WHERE barcode = ?", (barcode,))
        conn.commit()
        return jsonify({"message":"success"})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()