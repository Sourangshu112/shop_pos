import sqlite3
from flask import Blueprint,jsonify,request

from path import DB_NAME

analytics = Blueprint('analytics',__name__)

    
@analytics.route('/api/analytics/sales-per-item', methods=['GET'])
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
        LIMIT 100
    """, (start_date, end_date))
    rows = cursor.fetchall()
    conn.close()
    
    # Format for Recharts: [{name: 'Maggi', sales: 50}, ...]
    data = [{"name": row[0], "sales": row[1]} for row in rows]
    return jsonify(data)

@analytics.route('/api/analytics/revenue-per-day', methods=['GET'])
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
        SELECT date, SUM(final_price) as daily_revenue 
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


@analytics.route('/api/analytics/item-wise-sales', methods=['GET'])
def get_sales_item_wise_analytics():
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')

    if not start_date or not end_date:
        return jsonify({
            "error": "Missing parameters", 
            "message": "Both startDate and endDate are required"
        }), 400
    
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
        s.name,
        SUM(s.quantity) as total_qty,
        SUM(s.total_price) as total_price,
        SUM(s.discount) as total_discount,
        SUM(s.final_price) as total_revenue
        FROM sales s
        WHERE s.date BETWEEN ? AND ?
        GROUP BY s.barcode
        ORDER BY total_revenue DESC
    """,(start_date,end_date))

    sales_data_item_wise = [dict(row) for row in cursor.fetchall()]
    conn.close
    return jsonify(sales_data_item_wise)


@analytics.route('/api/analytics/date-wise-sales', methods=['GET'])
def get_sales_date_wise_analytics():
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')

    if not start_date or not end_date:
        return jsonify({
            "error": "Missing parameters", 
            "message": "Both startDate and endDate are required"
        }), 400
    
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("""
            SELECT 
                s.date,
                s.name, 
                SUM(s.quantity) as total_qty,
                SUM(s.total_price) as total_price,
                SUM(s.discount) as total_discount,
                SUM(s.final_price) as total_revenue
            FROM sales s
            WHERE s.date BETWEEN ? AND ?
            GROUP BY s.date, s.barcode
            ORDER BY s.date DESC, total_revenue DESC
    """,(start_date,end_date))

    sales_data_item_wise = [dict(row) for row in cursor.fetchall()]
    conn.close
    return jsonify(sales_data_item_wise)