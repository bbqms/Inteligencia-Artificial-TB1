from typing_extensions import TypedDict
from typing import List
from service_client import ServiceClient
import random
import math

class Coordinate:
    def __init__(self, lat, long, id):
        self.long = long
        self.lat = lat
        self.id = id

    def distance(self, coordB):
        dist = ServiceClient.compute_distance(self.lat,self.long,coordB.lat,coordB.long)
        return dist

    def get_name_Coordinate(Coordinate):
        return Coordinate.id


class RouteController:
    destination_list = []

    def add_cord(self, coordinate):
        self.destination_list.append(coordinate)

    def get_cord(self, index):
        return self.destination_list[index]

    def lenght(self):
        return len(self.destination_list)


class Route:
    def __init__(self, route_controller, route=None):
        self.route_controller = route_controller
        self.route = []
        self.distance = 0
        if route is not None:
            self.route = list(route)
        else:
            for i in range(0, self.route_controller.lenght()):
                self.route.append(None)

    def __getitem__(self, index):
        return self.route[index]

    def generate_route(self):
        self.distance = 0
        for indice in range(0, self.route_controller.lenght()):
            self.set_Coordinate(indice, self.route_controller.get_cord(indice))
        random.shuffle(self.route)

    def get_cord(self, position):
        return self.route[position]

    def set_Coordinate(self, indice, Coordinate):
        self.route[indice] = Coordinate

    def route_lenght(self):
        return len(self.route)

    def get_distance(self):
        route_distance = 0
        for indice in range(0, self.route_lenght()):
            start_coordinate = self.get_cord(indice)
            if indice + 1 < self.route_lenght():
                goal_coordinate = self.get_cord(indice + 1)
            else:
                goal_coordinate = self.get_cord(0)
            route_distance += start_coordinate.distance(goal_coordinate)
        self.distance = route_distance
        return self.distance

    def show(self):
        for i in range(0, self.route_lenght()):
            print(Coordinate.get_name_Coordinate(self.get_cord(i)))

#class Coordinate(TypedDict):
#    id: int
#    lon: float
#    lat: float

#Route = List[Coordinate]