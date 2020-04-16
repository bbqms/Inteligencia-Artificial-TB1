import random
import math

class Coordinate:
    def __init__(self,long,lat,id):
        self.long = long
        self.lat = lat
        self.id = id

    def distance(self,Coordinate):
        distanciaX = (Coordinate.long - self.long) * 40000 * math.cos((self.lat + Coordinate.lat)* math.pi / 360)/360
        distanciaY = (self.lat - Coordinate.lat) * 40000 / 360
        distancia = math.sqrt((distanciaX**2) + ( distanciaY ** 2))
        return distancia
    def get_name_Coordinate(Coordinate):
        return Coordinate.id

class RouteController:
    destination_list = []
    
    def add_cord(self,coordinate):
        self.destination_list.append(coordinate)
    def get_cord(self,index):
        return self.destination_list[index]
    def lenght(self):
        return len(self.destination_list)

class Route:
    def __init__(self,route_controller,route = None):
        self.route_controller = route_controller
        self.route = []
        self.distance = 0
        if route is not None:
            self.route = list(route)
        else:
            for i in range(0,self.route_controller.lenght()):
                self.route.append(None)
    def __getitem__(self,index):
        return self.route[index]
    def generate_route(self):
        self.distance = 0
        for indice in range(0,self.route_controller.lenght()):
            self.set_Coordinate(indice,self.route_controller.get_cord(indice))
        random.shuffle(self.route)

    def get_cord(self,position):
        return self.route[position]

    def set_Coordinate(self,indice,Coordinate):
        self.route[indice] = Coordinate

    def route_lenght(self):
        return len(self.route)

    def get_distance(self):
        route_distance = 0
        for indice in range(0,self.route_lenght()):
            start_coordinate = self.get_cord(indice)
            if indice + 1 < self.route_lenght():
                goal_coordinate = self.get_cord(indice + 1)
            else:
                goal_coordinate = self.get_cord(0)
            route_distance += start_coordinate.distance(goal_coordinate)
        self.distance = route_distance
        return self.distance
    def show(self):
        for i in range(0,self.route_lenght()):
            print(Coordinate.get_name_Coordinate(self.get_cord(i)))


class SimulatedAnnealing:
    def __init__(self,destinations,initial_temperature = 1000,cooling_rate = 0.03):
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

        pos1 = random.randrange(self.route.route_lenght())
        pos2 = random.randrange(self.route.route_lenght())

        cord1 = new_route.get_cord(pos1)
        cord2 = new_route.get_cord(pos2)
        new_route.set_Coordinate(pos2,cord1)
        new_route.set_Coordinate(pos1,cord2)

        actual_energy = self.route.get_distance()
        new_energy = new_route.get_distance()

        delta = new_energy - actual_energy

        if self.acceptance_function(delta):
            self.route = new_route
        if new_route.get_distance() < self.best.get_distance():
            self.best = new_route
            print(new_route.get_distance())
    def run(self):
        while self.temperature > 1:
            self.iterations = self.iterations + 1
            self.new_route()
            self.temperature *= 1 - self.cooling_rate

def main():
    destinations = RouteController()
    ciudad1 = Coordinate(-77.0202400,-12.0431800,'Lima')
    destinations.add_cord(ciudad1)
    ciudad1 = Coordinate(-77.0202400, -12.0431800, 'Lima')
    destinations.add_cord(ciudad1)
    ciudad2 = Coordinate(-55.00000000,-10.000000,'Brasil')
    destinations.add_cord(ciudad2)
    ciudad3 = Coordinate(-65.00000000, -17.000000, 'Bolivia')
    destinations.add_cord(ciudad3)
    ciudad4 = Coordinate(-58.00000000, -23.000000, 'Paraguay')
    destinations.add_cord(ciudad4)
    ciudad5 = Coordinate(-71.00000000, -30.000000, 'Chile')
    destinations.add_cord(ciudad5)

    sa = SimulatedAnnealing(destinations,initial_temperature=1000,cooling_rate=0.003)
    print(sa.route.show())
    print(sa.route.get_distance())
    sa.run()

    print(sa.route.show())
    print(sa.route.get_distance())
    print("Termino el algoritmo con %i vueltas" % sa.iterations)


main()