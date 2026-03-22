from flask import Flask
from flask_cors import CORS
from routes.generate_recap import recap_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(recap_bp)

@app.route('/')
def home():
    return {'message': 'YearWrap AI Service'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
