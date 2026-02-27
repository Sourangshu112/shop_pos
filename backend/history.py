import sqlite3
from flask import Blueprint,jsonify,request
import os

from path import DB_NAME,INVOICE_PATH

history= Blueprint('history',__name__)


@history.route('/api/history', methods=['GET'])
def get_history():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions ORDER BY date DESC LIMIT 100")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@history.route('/api/history-search', methods=['GET'])
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



@history.route('/api/history-date', methods=['GET'])
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
@history.route('/api/open-invoice/<invoice_id>', methods=['GET'])
def open_invoice(invoice_id):
    # This relies on Windows 'start' command or Mac 'open'
    path = os.path.join(INVOICE_PATH,f"{invoice_id}.pdf")
    full_path = os.path.abspath(path)
    if os.path.exists(full_path):
        if os.name == 'nt': # Windows
            os.startfile(full_path)
        return jsonify({"message": "Opened"}), 200
    return jsonify({"error": "File not found"}), 404

@history.route('/api/open-items/<item_id>', methods=['GET'])
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