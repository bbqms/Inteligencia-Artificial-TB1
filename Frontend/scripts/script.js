const btnEnviar = document.getElementById("enviar");
const btnLimpiar = document.getElementById("limpiar");
const btnImportar = document.getElementById("importar");
const fileSelect = document.getElementById("file-select");
const btnExportar = document.getElementById("exportar");

const stepperEl = document.getElementById('stepper')

let step = 0;
let stepper = undefined;

document.addEventListener('DOMContentLoaded', function () {

  stepper = new Stepper(stepperEl, { linear: false })

  stepperEl.addEventListener('shown.bs-stepper', function (event) {
    step = event.detail.indexStep;
  })
})

let marcador_origen = null;
let marcadores_destino = [];

function iniciarMap() {
  let coord = { lat: -28.024, lng: 140.887 };

  let directionsService = new google.maps.DirectionsService;
  let directionsDisplay = new google.maps.DirectionsRenderer;

  // Inicializando el mapa
  let map = new google.maps.Map(document.getElementById('map'),
    {
      zoom: 15,
      center: new google.maps.LatLng(-12.077118280948193, -77.09347695659221)
    });

  directionsDisplay.setMap(map);

  //Icono de la Caja
  let iconBox = {
    url: "images/caja.png",
    scaledSize: new google.maps.Size(35, 35), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(10, 10) // anchor
  };

  //Icono del camion  
  let iconTruck = {
    url: "images/camion.png",
    scaledSize: new google.maps.Size(49, 35), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(10, 10)
  }

  let icons = {
    caja: iconBox,
    camion: iconTruck
  }

  // Agregar marcadores con un click
  map.addListener('click', function (e) {
    if (step == 0) {
      marcador_origen = placeMarkerTruck(e.latLng, map);
      stepper.next();
    }
    else if (step == 1) {
      marcadores_destino.push(placeMarkerBox(e.latLng, map));
    }
  });

  // En el primer paso, click posicionará el camion
  function placeMarkerTruck(position, map) {
    //si ya hay un camión colocado, no hace nada
    if (marcador_origen != null)
      return;
    let marker = new google.maps.Marker({
      position: position,
      map: map,
      draggable: true,
      icon: iconTruck
    });

    //Se elimina con doble click y vuelve al paso 1
    marker.addListener('dblclick', function () {
      marcador_origen = null;
      marker.setMap(null);
      stepper.to(0);
    })

    map.panTo(position);
    return marker;
  }
  // En el segundo paso, clicks seran cajas
  function placeMarkerBox(position, map) {
    let marker = new google.maps.Marker({
      position: position,
      map: map,
      draggable: true,
      icon: iconBox
    });
    //Se eliminan las cajas con doble click
    marker.addListener('dblclick', function () {
      marcadores_destino.splice(marcadores_destino.indexOf(marker), 1);
      marker.setMap(null)
    })

    map.panTo(position);
    return marker;
  }

  function trazarla(lista) {
    let waypts = [];
    for (let i = 1; i < lista.length; i++) {
      waypts.push({ location: { lat: lista[i].lat, lng: lista[i].lng }, stopover: true })
    }

    directionsService.route({
      origin: { lat: lista[0].lat, lng: lista[0].lng },//db waypoint start
      destination: { lat: lista[0].lat, lng: lista[0].lng },//db waypoint end
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

  function prepareData() {
    let coordenadas = [];
    let aux = null;

    if (marcador_origen == null) {
      throw "No existe punto de origen"
    }

    aux = { lat: marcador_origen.position.lat(), lng: marcador_origen.position.lng() }
    coordenadas.push(aux);

    if (marcadores_destino.length <= 0) {
      throw "No hay puntos de destino"
    }

    for (let i = 0; i < marcadores_destino.length; i++) {
      aux = { lat: marcadores_destino[i].position.lat(), lng: marcadores_destino[i].position.lng() }
      coordenadas.push(aux)
    }
    console.log(JSON.stringify(coordenadas));
    return coordenadas;
  }

  function parseData(data) {
    try {
      let coordenadas = JSON.parse(data);
      let aux_origen = null;
      let aux_destino = [];

      aux_origen = placeMarkerTruck(coordenadas[0], map);
      for (let i = 1; i < coordenadas.length; i++) {
        aux_destino.push(placeMarkerBox(coordenadas[i], map))
      }

      clear();
      marcador_origen = aux_origen;
      marcadores_destino = aux_destino;
      alert("Archivo cargado con exito!")

    } catch (error) {
      throw "El archivo seleccionado no es válido"
    }
  }

  btnEnviar.onclick = function () {
    let url = 'http://localhost:5000/';

    
    let val = document.querySelector('input[name="heuristic"]:checked').value == 1? true : false;
    let args = `?use_heuristic=${val}`;


    //check that data is ready
    let data = null;
    try {
      data = prepareData();
    } catch (error) {
      alert(error);
      return;
    }

    console.log(JSON.stringify(data))
    fetch(`${url+args}`, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => trazarla(response));
  }

  function clear() {
    if (marcador_origen != null) {
      marcador_origen.setMap(null);
      marcador_origen = null;
    }
    for (i = 0; i < marcadores_destino.length; i++) {
      marcadores_destino[i].setMap(null);
    }
    marcadores_destino = [];
    directionsDisplay.setMap(null);
    directionsDisplay = null;
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);
  }

  btnLimpiar.onclick = function () {
    clear();
    stepper.to(0);
  }


  btnImportar.onclick = function () {
    fileSelect.onchange = function (event) {
      var reader = new FileReader();

      reader.onload = function (e) {
        try {
          parseData(e.target.result)
          stepper.to(2);
        } catch (error) {
          alert(error);
        }
      }
      reader.readAsText(event.target.files[0]);
    }

    fileSelect.click();

    fileSelect.value = null;

  }

  btnExportar.onclick = function () {
    //check that data is ready
    let data = null;
    try {
      data = prepareData();
    } catch (error) {
      alert(error);
      return;
    }

    var file = new Blob([JSON.stringify(data)], { type: 'application/json' });

    var a = document.createElement("a");
    url = URL.createObjectURL(file);
    a.href = url;
    a.download = "coordinates.json";

    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

}