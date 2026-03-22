from flask import Blueprint, request, jsonify
from utils.text_processor import process_memories

recap_bp = Blueprint('recap', __name__)

@recap_bp.route('/generate-recap', methods=['POST'])
def generate_recap():
    try:
        data = request.json
        memories = data.get('memories', [])
        
        recap_content = process_memories(memories)
        
        return jsonify(recap_content), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
