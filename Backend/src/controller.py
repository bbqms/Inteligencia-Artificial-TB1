from flask import Flask, request, jsonify
from flask_cors import CORS
from simulated_annealing import SimulatedAnnealing
from model import Coordinate, Route,RouteController

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def findRoutes():
    body = request.get_json(force=True)

    print(body)
    #TODO
    #destinations = RouteController()

    #sa = SimulatedAnnealing(destinations, initial_temperature=1000, cooling_rate=0.03)
    #sa.run()
    #return jsonify(sa.best)
    return 'HOLA'

if __name__ == '__main__':
    app.run(debug=True)