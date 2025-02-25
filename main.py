from flask import Flask, request, jsonify

app = Flask(__name__)

items = []  

@app.route('/upload', methods=['POST'])
def upload():
    name = request.form['name']
    category = request.form['category']
    image_url = "uploaded_image_url"  # Save the image properly
    items.append({"name": name, "category": category, "image": image_url})
    return jsonify({"message": "Item uploaded"})

@app.route('/items', methods=['GET'])
def get_items():
    return jsonify(items)

if __name__ == '__main__':
    app.run(debug=True)
