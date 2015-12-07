
var map;

function initMap() {


  var mapContainer = document.getElementById('map');
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644)
  };

  map = new google.maps.Map(mapContainer, mapOptions);
}

google.maps.event.addDomListener(window, 'load', initMap() );
