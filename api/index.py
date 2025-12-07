from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

def scrape_lerobert(word):
    url = f"https://dictionnaire.lerobert.com/definition/{word}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        return {"error": f"Failed to fetch page: {str(e)}"}
    
    soup = BeautifulSoup(response.text, 'lxml')
    
    result = {
        "word": word,
        "definitions": [],
        "synonyms": [],
        "examples": []
    }
    
    title_elem = soup.find('h1', class_='b')
    if title_elem:
        result["word"] = title_elem.get_text(strip=True)
    
    word_type_elem = soup.find('span', class_='d_cat')
    if word_type_elem:
        result["type"] = word_type_elem.get_text(strip=True)
    
    definitions = soup.find_all('span', class_='d_dfn')
    for i, defn in enumerate(definitions):
        def_text = defn.get_text(strip=True)
        if def_text:
            result["definitions"].append({
                "number": i + 1,
                "text": def_text
            })
    
    examples = soup.find_all('span', class_='d_xpl')
    for ex in examples[:5]:
        ex_text = ex.get_text(strip=True)
        if ex_text:
            result["examples"].append(ex_text)
    
    syn_links = soup.find_all('a', class_='d_rvh')
    for syn in syn_links[:10]:
        syn_text = syn.get_text(strip=True)
        if syn_text and syn_text not in result["synonyms"]:
            result["synonyms"].append(syn_text)
    
    if not result["definitions"]:
        return {"error": "No definitions found for this word", "word": word}
    
    return result

@app.route('/recherche', methods=['GET'])
def recherche():
    word = request.args.get('dico', '').strip()
    
    if not word:
        return jsonify({"error": "Missing 'dico' parameter"}), 400
    
    result = scrape_lerobert(word)
    
    response = jsonify(result)
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Access-Control-Allow-Origin'] = '*'
    
    if "error" in result and "No definitions" in result.get("error", ""):
        return response, 404
    elif "error" in result:
        return response, 500
    
    return response, 200

@app.route('/')
def index():
    return '''
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>French Dictionary API</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            h1 { color: #333; }
            code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
            pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        </style>
    </head>
    <body>
        <h1>French Dictionary API</h1>
        <p>Welcome to the French Dictionary API powered by Le Robert.</p>
        <h2>Usage</h2>
        <p>Make a GET request to:</p>
        <pre>GET /recherche?dico=&lt;word&gt;</pre>
        <h3>Example</h3>
        <pre>GET /recherche?dico=bonjour</pre>
        <h3>Response Format</h3>
        <pre>{
    "word": "bonjour",
    "type": "nom masculin",
    "definitions": [
        {"number": 1, "text": "..."}
    ],
    "examples": ["..."],
    "synonyms": ["..."]
}</pre>
    </body>
    </html>
    '''

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
