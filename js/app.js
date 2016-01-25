
"use strict";

//Places - Hardcoded Data
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

//Initialize Google Map
var map,
	infowindow;

function initMap() {

    var mapContainer = document.getElementById('map');
    var initialLatLng = new google.maps.LatLng(myPlaces[2].lat,myPlaces[2].lng);	
    var mapOptions = {
		zoom: 6,
		center: initialLatLng
    };

    map = new google.maps.Map(mapContainer, mapOptions);

    //Center the map on risize
	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center); 
	});

    ko.applyBindings(new ViewModel());
}

//Place Constructor - Model
var Place = function(data) {

	this.name = data.name;
	this.lat = data.lat;
	this.lng = data.lng;
	this.marker = data.marker;
};

//ViewModel
var ViewModel = function() {
	
	var self = this;
	self.placesList = ko.observableArray([]);
	infowindow = new google.maps.InfoWindow();

	//Markers and InfoWindow
	myPlaces.forEach(function(placeItem) {

	  	//Markers
		var markerOptions = {
		  map: map,
		  position: {lat: placeItem.lat, lng: placeItem.lng},
		  animation: google.maps.Animation.DROP,
		};
		placeItem.marker = new google.maps.Marker(markerOptions);

		//Get Wiki data
		getWikiData(placeItem);

		//Add listener for marker and open infowindow with content based on location
	  	placeItem.marker.addListener('click', (function(markerClicked) { 
			return function() {
			
				//add animation (bounce effect) for marker
				placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
				
				//set animation time to one bounce sequence
				setTimeout(function () {
				placeItem.marker.setAnimation(null);
				}, 700); 	
				
				//display infowindow
				infowindow.setContent(placeItem.content);
				infowindow.open(map, markerClicked);
			};
	  	})(placeItem.marker));

	   //Add Places to the locationLists array
	   	self.placesList.push(new Place(placeItem) );
	});

	//Binding the list of places with the click handler and the markers on the map
	self.setPlace = function(placeItem) {

		google.maps.event.trigger(placeItem.marker, 'click');
	};

	//Get Wikipedia article based on place name
	function getWikiData(placeItem) {

		var wikiData;
		var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='+placeItem.name+'&callback=wikiCallback';
	   	// Wikipedia Error Handler
		var wikiRequestTimeout = setTimeout(function() {
    		$("#warning").addClass("alert-danger").text("Failed to load Wikipedia Data. Please try again later.");
    		$("#warning").css("display", "block");
    	}, 3000);

	    $.ajax({
			url: wikiUrl,
			dataType: 'jsonp',
			success: function(response) {
				clearTimeout(wikiRequestTimeout);
				placeItem.content = ('<div>' +  '<h3>' + response[0] + '</h3>'
					+ '<p>' + response[2] + '</p>'
					+ '</div>');
			}
	    });
	   
	}

	//Filter the places - Credit: http://codepen.io/prather-mcs/pen/KpjbNN?editors=001
	self.filteredPlaces = ko.observableArray([]);

	myPlaces.forEach(function (placeItem) {
		self.filteredPlaces.push(new Place(placeItem) );
	});

	self.query = ko.observable('');

	self.filterPlaces = function(placeItem)  {

		var userInput = self.query().toLowerCase();
		self.filteredPlaces.removeAll();
		infowindow.close();

		self.placesList().forEach(function(placeItem) {
		placeItem.marker.setVisible(false);

		if (placeItem.name.toLowerCase().indexOf(userInput) !== -1)
			self.filteredPlaces.push(placeItem);
		});

		self.filteredPlaces().forEach(function(placeItem) {
			placeItem.marker.setVisible(true);
		});
	};

}//END of ViewModel