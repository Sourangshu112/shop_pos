# backend/app.py
from flask import Flask, jsonify
from flask_cors import CORS
import sys

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # This is CRITICAL. It allows React (port 3000) to talk to Python (port 5000)

# A sample "Inventory" endpoint for your POS
@app.route('/api/products', methods=['GET'])
def get_products():
    # In the future, this will come from your SQLite DB
    data = [
        {"id": 1, "name": "Maggi Noodles", "price": 12.00, "stock": 50},
        {"id": 2, "name": "Coke (500ml)", "price": 40.00, "stock": 20},
        {"id": 3, "name": "Dairy Milk Silk", "price": 80.00, "stock": 15},
    ]
    return jsonify(data)

@app.route('/')
def hello():
    return "Python Backend is Live!"

if __name__ == "__main__":
    # Run on port 5000
    app.run(host='127.0.0.1', port=5000)