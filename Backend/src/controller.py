from flask import Flask, request, jsonify
from flask_cors import CORS

from model import Coordinate, Route

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def findRoutes():
    body = request.json

    print(body)
    #TODO

    result: Route = []
    return jsonify([{ 'msg': 'GAAAA'}, {'msg': 'TEST'}])

if __name__ == '__main__':
    app.run(debug=True)