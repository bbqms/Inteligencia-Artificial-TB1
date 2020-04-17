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
    lista = list(body)

    if len(lista) < 2:
        return []

    destinations = RouteController()
    for i in lista:
        destinations.add_cord(Coordinate(i['lat'],i['lng'],'A'))
    #TODO
    sa = SimulatedAnnealing(destinations, initial_temperature=1000, cooling_rate=0.45)
    sa.run()
    response = []
    for i in sa.best:
        response.append({'lat':i.lat,'lng':i.long})
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)