maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element in which the SDK will render the map
  style: maptilersdk.MapStyle.STREETS,
  center: [72.8777, 19.0760 ], // starting position [lng, lat]
  zoom: 14 // starting zoom
});