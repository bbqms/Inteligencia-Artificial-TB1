function iniciarMap(){
    var coord = {lat: -28.024, lng: 140.887};

    var  marcadores = [];
    
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    // Inicializando el mapa
     var map = new google.maps.Map(document.getElementById('map'),
    {
        zoom:15,
        center: new google.maps.LatLng(-12.077118280948193, -77.09347695659221)
    });

  
    directionsDisplay.setMap(map);
    var button = document.getElementById("ordenar");
    var btnGenerarRuta = document.getElementById("generarRuta");
    var btnEnviar = document.getElementById("enviar");

     button.onclick = function(){
      var bounds = new google.maps.LatLngBounds();
      
      
      for (i = 0; i < marcadores.length; i++) {
        var aux = new google.maps.LatLng(marcadores[i].lat,marcadores[i].lng)
      bounds.extend(aux)
      }
      map.fitBounds(bounds);
    }

    //Icono de la Caja
    var iconBox = {
      url: "caja.png", 
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(10,10) // anchor
      };

    //Icono del camion  
    var iconTruck = {
      url: "camion.png", 
      scaledSize: new google.maps.Size(70,50), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(10, 10)
      }


     var icons = {
     caja : iconBox,
     camion: iconTruck
     }



    // Agregar marcadores con un click
    map.addListener('click', function(e) {
      if(marcadores.length == 0){
        placeMarkerTruck(e.latLng, map);
      }
      else{
        placeMarkerBox(e.latLng, map);
      }
      
      var aux = { lat: e.latLng.lat(), lng: e.latLng.lng()}
      marcadores.push(aux);
      console.log(marcadores)
    });

    // El primer click sera el camion
    function placeMarkerTruck(position, map) {
      var marker = new google.maps.Marker({
          position: position,
          map: map,
          icon: iconTruck
      });
      
      map.panTo(position);
    }
    // Los demas clicks sera el camion
    function placeMarkerBox(position, map) {
    var marker = new google.maps.Marker({
        position: position,
        map: map,
        icon: iconBox
    });
    
    map.panTo(position);
    }
    
    
      var features = [
          {
            position: new google.maps.LatLng(-33.91721, 151.22630),
            type: 'camion',
            title : '1'
          }, {
            position: new google.maps.LatLng(-33.91539, 151.22820),
            type: 'caja'
          }, {
            position: new google.maps.LatLng(-33.91747, 151.22912),
            type: 'caja'
          }, {
            position: new google.maps.LatLng(-33.91910, 151.22907),
            type: 'caja'
          }, {
            position: new google.maps.LatLng(-33.91725, 151.23011),
            type: 'caja'
          }, {
            position: new google.maps.LatLng(-33.91872, 151.23089),
            type: 'caja'
          }, {
            position: new google.maps.LatLng(-33.91784, 151.23094),
            type: 'caja'
          }, {
            position: new google.maps.LatLng(-33.91682, 151.23149),
            type: 'caja'
          }, {
            position: new google.maps.LatLng(-33.91790, 151.23463),
            type: 'caja'
          }, {
            position: new google.maps.LatLng(-33.91666, 151.23468),
            type: 'caja'
          }, {
            position: new google.maps.LatLng(-33.916988, 151.233640),
            type: 'caja'
          }, {
            position: new google.maps.LatLng(-33.91662347903106, 151.22879464019775),
            type: 'caja'
          }, {
            position: new google.maps.LatLng(-33.916365282092855, 151.22937399734496),
            type: 'caja'
          }, {
            position: new google.maps.LatLng(-33.91665018901448, 151.2282474695587),
            type: 'caja'
          }, {
            position: new google.maps.LatLng(-33.919543720969806, 151.23112279762267),
            type: 'caja'
          }, {
            position: new google.maps.LatLng(-33.91608037421864, 151.23288232673644),
            type: 'caja'
          }, {
            position: new google.maps.LatLng(-33.91851096391805, 151.2344058214569),
            type: 'caja',
            title: "17"
          }, {
            position: new google.maps.LatLng(-33.91818154739766, 151.2346203981781),
            type: 'caja',
            title: "18"
          }, {
            position: new google.maps.LatLng(-33.91727341958453, 151.23348314155578),
            type: 'caja',
            title: "19"
          }
      ];

      // Dibujando marcadores de features
      /*for (var i = 0; i < features.length; i++) {
        var marker = new google.maps.Marker({
          position: features[i].position,
          icon: icons[features[i].type],
          map: map,
          title: features[i].title
        });
      };*/

        console.log("hola")
        console.log(marcadores)
        console.log(features.length)
   

        //var waypts = [];

        /*for (var i = 1; i < features.length-2; i++){
            waypts.push({ location: { lat: features[i].position.lat(), lng: features[i].position.lng() }, stopover: true })
        }*/
        



        btnGenerarRuta.onclick = function(){

          var waypts = [];

          for (var i = 1; i < marcadores.length; i++){
            waypts.push({ location: { lat: marcadores[i].lat, lng: marcadores[i].lng }, stopover: true})
         }

          directionsService.route({
            origin: { lat: marcadores[0].lat, lng: marcadores[0].lng },//db waypoint start
            destination: { lat: marcadores[0].lat, lng: marcadores[0].lng },//db waypoint end
            waypoints: waypts,
            travelMode: google.maps.TravelMode.DRIVING
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Ha fallat la comunicació amb el mapa a causa de: ' + status);
            }
        });
          
        }

        btnEnviar.onclick = function(){
          var url = 'http://localhost:5000/';
          var data = marcadores
          console.log(data);
          console.log(JSON.stringify(data))
          fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json'
            }
          }).then(res => res.json())
          .catch(error => console.error('Error:', error))
          .then(response => console.log('Success:', response));
          
        }

      

      /*directionsService.route({
        origin: { lat: features[0].position.lat(), lng: features[0].position.lng() },//db waypoint start
        destination: { lat: features[features.length-1].position.lat(), lng: features[features.length-1].position.lng() },//db waypoint end
        waypoints: waypts,
        travelMode: google.maps.TravelMode.WALKING
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Ha fallat la comunicació amb el mapa a causa de: ' + status);
        }
    });*/
}



//document.getElementById('lat').innerHTML = "aver"