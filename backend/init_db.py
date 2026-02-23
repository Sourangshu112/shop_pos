import sqlite3

def init_db(DB_NAME):
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
            discount REAL,
            final_price REAL,
            date TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS purchases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            barcode TEXT,
            name TEXT,
            quantity INTEGER,
            date TEXT
            )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            invoice_id TEXT PRIMARY KEY,
            date TEXT,
            total_amount REAL,
            items_count INTEGER
        )
    """)

    conn.commit()
    conn.close()