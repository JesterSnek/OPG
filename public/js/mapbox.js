/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);
const plotName = JSON.parse(document.getElementById('name').dataset.name);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiamVzdGVyc25layIsImEiOiJja3hnaWM0bjUwdHFwMm9ucDdjMDl0eHNhIn0._w1c3yKpNUR4X3NdUEVSmA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/jestersnek/ckxgtdnbj377z14mx426ljusl',
  center: locations.coordinates,
  zoom: 12,
  scrollZoom: false,
});

// Create marker
const el = document.createElement('div');
el.className = 'marker';

new mapboxgl.Marker({
  element: el,
  anchor: 'bottom',
})
  .setLngLat(locations.coordinates)
  .addTo(map);

// Create popup
new mapboxgl.Popup({
  offset: 30,
})
  .setLngLat(locations.coordinates)
  .setHTML(`<p>${plotName}</p>`)
  .addTo(map);
