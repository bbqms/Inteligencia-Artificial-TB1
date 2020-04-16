from typing import List, TypedDict

class Coordinate(TypedDict):
    id: int
    lon: float
    lat: float

Route = List[Coordinate]