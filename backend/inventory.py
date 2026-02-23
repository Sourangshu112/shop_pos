import sqlite3
from flask import Blueprint, jsonify

from path import DB_NAME

inventory = Blueprint('inventory', __name__)

@inventory.route('/api/inventory', methods=['GET'])
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