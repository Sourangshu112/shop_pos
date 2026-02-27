from flask import Blueprint, request, jsonify
import pandas as pd

df = pd.read_csv('collected_data.csv',encoding='latin1')
add_data = Blueprint('add_data',__name__)

def get_item_by_code(search_code):
    match = df[df['CODE'].astype(str) == str(search_code)]
    
    if match.empty:
        return None 
        
    row = match.iloc[0]
    name = row['NAME']
    weight = row['WEIGHT-1']

    if pd.isna(name):
        return None

    if pd.isna(weight):
        return f"{name}"
    else:
        return f"{name}-{weight}"
    
@add_data.route('/api/get-item', methods=['GET'])
def get_item():
    search_code = request.args.get('code')    
    if not search_code:
        return jsonify({"error": "No code provided"}), 400

    formatted_name = get_item_by_code(search_code)

    if formatted_name is not None:
        return jsonify({"success": True, "formatted_name": formatted_name}), 200
    else:
        return jsonify({"success": False, "error": "Data not found"}), 404

