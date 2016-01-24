// Places - Hardcoded Data
var myPlaces = [
	{
	name: "Rome",
	lat: 41.902783, 
	lng: 12.496366
	},
	{
	name: "Venice",
	lat: 45.440847, 
	lng: 12.315515
	},
	{
	name: "Florence",
	lat: 43.769560, 
	lng: 11.255814
	},
	{
	name: "Milan",
	lat: 45.465422, 
	lng: 9.185924
	},
	{
	name: "Naples",
	lat: 40.851775, 
	lng: 14.268124
	}
];	

//Google Map
var map;
var infoWindow;

function initMap() {

    var mapContainer = document.getElementById('map');
    var initialLatLng = new google.maps.LatLng(myPlaces[0].lat,myPlaces[0].lng);	
    var mapOptions = {
    zoom: 6,
    center: initialLatLng
    };

    map = new google.maps.Map(mapContainer, mapOptions);
    infoWindow = new google.maps.InfoWindow();
}; 

// Keep center of the map during resizing
google.maps.event.addDomListener(window, 'load', initMap() );
google.maps.event.addDomListener(window, "resize", function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center); 
});

// Place - Model
var Place = function(data) {

	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);

};

// ViewModel
var ViewModel = function() {
	
    var self = this;
	self.placesList = ko.observableArray([]);

	//Add my places to the placesList observable Array
	myPlaces.forEach(function(data) {
		self.placesList.push( new Place(data));
	});
  
  // Render the markers and info window
  self.placesList().forEach(function(data) {
      data.marker = new google.maps.Marker({
              position: {lat: data.lat(), lng: data.lng()},
              map: map,
              title: data.name()
      });
            
      // Click handler for the marker
      data.marker.addListener('click', function(){
          data.marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function () {
          data.marker.setAnimation(null);
      }, 1000); 

  
          
          infoWindow.setContent('<div><h5>'+data.name()+'</h5></div><div>Address: '+data.lat()+'</div><div>Rating: '+data.lng()+'</div>');
          infoWindow.open(map, data.marker);
      });
            
    });
    
    // Binding the list of places with the markers on the map
    self.setPlace = function(data) {
        google.maps.event.trigger(data.marker, 'click');
    };

}; //END View Model

ko.applyBindings(new ViewModel());