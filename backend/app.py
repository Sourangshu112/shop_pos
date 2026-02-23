from flask import Flask
from flask_cors import CORS

from path import DB_NAME
from init_db import init_db
from inventory import inventory
from checkout import checkout
from add_item import add_item
from analytics import analytics
from history import history
from purchase import purchase

app = Flask(__name__)
CORS(app)

# Initialize DB on start
init_db(DB_NAME)

# --- 2. INVENTORY ENDPOINT ---
app.register_blueprint(inventory)


# --- 3. CHECKOUT ENDPOINT ---
app.register_blueprint(checkout)
    
# --- 4.ADD ITEM ENDPOINT ---
app.register_blueprint(add_item)

# --- 5. ANALYTICS ---
app.register_blueprint(analytics)

# --- 6. HISTORY ---
app.register_blueprint(history)

# --- 7. PURCHASE ---
app.register_blueprint(purchase)


if __name__ == "__main__":
    app.run(host='127.0.0.1',debug=True, port=5000)