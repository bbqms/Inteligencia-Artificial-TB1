import requests
from model import Coordinate
class ServiceClient:
    def compute_distance(coordA,coordB):
        res = requests.post(
            'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+str(coordA.lat)+','+str(coordA.long)+'&destinations='+str(coordB.lat)+','+str(coordB.long)+'&mode=driving&language=es-ES&units=metric&key=AIzaSyAkSoqQ9v3nMJ9Tv60ZSwkZcgjoNkCGBsw')
        if res.ok:
            print(res.json())
            r = res.json()
            return(r['rows'][0]['elements'][0]['distance']['value'])
        return 99999999


print(ServiceClient.compute_distance(Coordinate(-33.9196631120698,151.233391073654768,'A'),Coordinate(-33.908896455944124,151.2365632263835,'B')))

