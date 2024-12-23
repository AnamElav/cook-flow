## Flask entry point
from flask import Flask, request, jsonify
from flask_cors import CORS
from scrapers.recipe_scraper import scrape_recipe

app = Flask(__name__)
CORS(app)

@app.route('/api/scrape', methods=['POST'])
def scrape():
    try:
        data = request.json
        url = data.get('url')
        if not url:
            return jsonify({'error': 'URL is required'}), 400

        recipe_data = scrape_recipe(url)
        if 'error' in recipe_data:
            return jsonify({'error': recipe_data['error']}), 400
        
        return jsonify(recipe_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)