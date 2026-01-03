from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

# Minimal abusive word list (expand later)
ABUSIVE_WORDS = {
    "fuck", "shit", "bitch", "asshole", "bastard",
    "slut", "whore", "nigger", "chutiya", "madarchod",
    "behenchod", "bsdk", "harami"
}

def find_abusive_words(text):
    text = text.lower()
    words = re.findall(r"\b\w+\b", text)
    found = [w for w in words if w in ABUSIVE_WORDS]
    return list(set(found))  # unique words

@app.route("/check-text", methods=["POST"])
def check_text():
    data = request.json

    if not data:
        return jsonify({"message": "No data received"}), 400

    name = data.get("name", "")
    description = data.get("description", "")

    combined_text = f"{name} {description}"

    abusive_found = find_abusive_words(combined_text)

    return jsonify({
        "clean": len(abusive_found) == 0,
        "abusive_words": abusive_found
    })

if __name__ == "__main__":
    app.run(port=7001, debug=True)
