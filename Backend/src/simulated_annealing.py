import random
import math
from model import Coordinate, RouteController,Route,Dictionary

class SimulatedAnnealing:
    def __init__(self,destinations,initial_temperature = 1000,cooling_rate = 0.003):
        self.dictionary = {}
        self.route_controller = destinations
        self.route = Route(destinations)
        self.route.generate_route()
        self.best = self.route
        self.temperature = initial_temperature
        self.cooling_rate = cooling_rate
        self.iterations = 0
    def acceptance_function(self,energy_delta):
        if energy_delta < 0:
            return True
        elif random.random() <= math.exp(-(energy_delta)/self.temperature):
            return True
        return False
    def new_route(self):
        new_route = Route(self.route_controller,self.route)

        pos1 = random.randint(1,self.route.route_lenght() - 1)
        pos2 = random.randint(1,self.route.route_lenght() - 1)

        cord1 = new_route.get_cord(pos1)
        cord2 = new_route.get_cord(pos2)
        new_route.set_Coordinate(pos2,cord1)
        new_route.set_Coordinate(pos1,cord2)

        actual_energy = self.route.get_distance(self.dictionary)
        new_energy = new_route.get_distance(self.dictionary)

        delta = new_energy - actual_energy

        if self.acceptance_function(delta):
            self.route = new_route
        if new_route.get_distance(self.dictionary) < self.best.get_distance(self.dictionary):
            self.best = new_route
            print(new_route.get_distance())
    def run(self):
        print("Corriendo algoritmo")
        while self.temperature > 1:
            self.iterations = self.iterations + 1
            self.new_route()
            self.temperature *= 1 - self.cooling_rate
        print("La cantidad de iteraciones que dio es de : ",self.iterations)
        self.resetDictionary()
        print("Termino algoritmo")
    def resetDictionary(self):
        self.dictionary = {}

def main():
    destinations = RouteController()
    ciudad1 = Coordinate(-12.095266834590417,-77.0542065585971,'Lima')
    destinations.add_cord(ciudad1)
    ciudad1 = Coordinate(-12.08264894268049, -77.04563370491826, 'Argentina')
    destinations.add_cord(ciudad1)
    ciudad2 = Coordinate(-12.092396932744766,-77.03341079647996,'Brasil')
    destinations.add_cord(ciudad2)
    ciudad3 = Coordinate(-12.071923319293719, -77.0513069176675, 'Bolivia')
    destinations.add_cord(ciudad3)
    ciudad4 = Coordinate(-12.064787751282571, -77.03733650569475, 'Paraguay')
    destinations.add_cord(ciudad4)

    sa = SimulatedAnnealing(destinations,initial_temperature=1000,cooling_rate=0.0000003)
    print(sa.route.show())
    print(sa.route.get_distance(sa.dictionary))
    sa.run()

    print(sa.route.show())
    print(sa.route.get_distance(sa.dictionary))
    print("Termino el algoritmo con %i vueltas" % sa.iterations)


