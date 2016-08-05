var API_ENDPOINT = 'http://www.projetpoissonpilote.com';

var boats = {
  'boat-1': { color: 'blue',   name: 'Fortitude II' },
  'boat-2': { color: 'blue',   name: 'Kinga' },
  'sub':    { color: 'yellow', name: 'Pilot Fish'}
};

var mymap = L.map('mapid').setView([49.975, -4.00], 9);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'clementd42.0cjjgi7e',
    accessToken: 'pk.eyJ1IjoiY2xlbWVudGQ0MiIsImEiOiJjaXBjaWZ4ZHowMDJvdXRrc20zZ2kxdG5xIn0.ztrBd2MJhdRFveAwFDK8Ew'
}).addTo(mymap);

var addPolylineToMap = function(points, options) {
  var segment = points.map(function(point) {
    return [ point.x, point.y ];
  });

  var polyline = L.polyline(segment, options);
  polyline.addTo(mymap);
};

var fetchJson = function(path) {
  return fetch(path).then(function(r) { return r.json(); });
};

fetchJson(API_ENDPOINT + '/api/path').then(function(points) {
  Object.keys(points).forEach(function(boat) {
    var boatPoints = points[boat];
    var lastPoint = boatPoints[boatPoints.length - 1];
    var boatData = boats[boat];
    addPolylineToMap(boatPoints.map(function(point) { return point.point}),  { color: boatData.color });
    var marker = L.marker([lastPoint.point.x, lastPoint.point.y]).addTo(mymap);
    if(boat == 'sub') {
      marker.bindPopup(boatData.name).openPopup();
    } else {
      marker.bindPopup(boatData.name);
    }
  })
  // ToDo display depth graph
});

fetchJson(API_ENDPOINT + '/api/transect').then(function(points) {
  addPolylineToMap(points.planned, { color: 'green' });
  addPolylineToMap(points.limitEast, { color: 'red' });
  addPolylineToMap(points.limitWest, { color: 'red' });
});

fetchJson(API_ENDPOINT + '/api/data').then(function(data) {
  // ToDo
});

