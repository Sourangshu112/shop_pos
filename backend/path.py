import os

def get_db_path():
    # This creates a folder in C:\Users\YourName\AppData\Roaming\SyntaxLabPOS
    app_data_dir = os.path.join(os.environ['APPDATA'], 'SyntaxLab_POS')
    
    # Create the folder if it doesn't exist
    if not os.path.exists(app_data_dir):
        os.makedirs(app_data_dir)
        
    return os.path.join(app_data_dir, 'pos.db')

def get_invoice_path():
    # This creates a folder in C:\Users\YourName\AppData\Roaming\SyntaxLabPOS
    app_data_dir = os.path.join(os.environ['APPDATA'], 'SyntaxLab_POS')
    invoice_path = os.path.join(app_data_dir,"invoices")
    # Create the folder if it doesn't exist
    if not os.path.exists(app_data_dir):
        os.makedirs(app_data_dir)

    if not os.path.exists(invoice_path):
        os.makedirs(invoice_path)
        
    return invoice_path

DB_NAME = get_db_path()
INVOICE_PATH = get_invoice_path()