from flask import Flask, request, jsonify
from model import Coordinate, Route


app = Flask(__name__)

@app.route('/', methods=['GET'])
def findRoutes():
    body = request.json

    print(body)
    #TODO

    result: Route = []
    return jsonify([{ 'msg': 'GAAAA'}, {'msg': 'TEST'}])

if __name__ == '__main__':
    app.run(debug=True)