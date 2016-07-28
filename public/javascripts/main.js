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

fetchJson('/api/path').then(function(points) {
  for(var boat of Object.keys(points)) {
    addPolylineToMap(points[boat].map(function(point) { return point.point}), {});
  }
  // ToDo display depth graph
});

fetchJson('/api/transect').then(function(points) {
  addPolylineToMap(points.planned, { color: 'green' });
  addPolylineToMap(points.limitEast, { color: 'red' });
  addPolylineToMap(points.limitWest, { color: 'red' });
});

fetchJson('/api/data').then(function(data) {
  // ToDo
});

