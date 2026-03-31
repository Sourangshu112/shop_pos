from flask import Blueprint, request, jsonify

# Import the 2D list from the newly created python file
from data_output import data

add_data = Blueprint('add_data', __name__)

def get_item_by_code(search_code):
    for row in data[1:]:
        # row[0] is CODE, row[1] is NAME, row[2] is WEIGHT-1
        if str(row[0]) == str(search_code):
            name = row[1]
            weight = row[2]

            # If name is None (originally NaN in pandas), return None
            if name is None:
                return None

            # If weight is None, just return the name
            if weight is None:
                return f"{name}"
            else:
                return f"{name}-{weight}"
                
    # If the loop finishes without finding a match, return None
    return None
    
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