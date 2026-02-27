import sqlite3
from flask import Blueprint, jsonify

from path import DB_NAME

purchase = Blueprint('purchase', __name__)


@purchase.route('/api/purchase-history', methods=['GET'])
def get_purchase_history():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    # Fetch all records from the purchases table, newest first
    cursor.execute("SELECT * FROM purchases ORDER BY date DESC, id DESC LIMIT 100")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])