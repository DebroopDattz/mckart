from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

def is_blurry(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    variance = cv2.Laplacian(gray, cv2.CV_64F).var()
    return variance < 100  # threshold

@app.route("/check-image", methods=["POST"])
def check_image():
    if "image" not in request.files:
        return jsonify({"message": "No image uploaded"}), 400

    file = request.files["image"]
    image = Image.open(io.BytesIO(file.read()))
    image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    blurry = is_blurry(image)

    return jsonify({
        "clear": not blurry,
        "message": "Image is clear" if not blurry else "Image is blurry"
    })

if __name__ == "__main__":
    app.run(port=7002, debug=True)
