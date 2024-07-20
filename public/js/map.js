mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/streets-v12",
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 8 // starting zoom
});
console.log(coordinates);
// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({color:"red"})
    .setLngLat(coordinates) 
    .setPopup(new mapboxgl.Popup({offset: 25, className: 'my-class'}).setHTML("<p>Exact Location will be shared after Booking!</p>"))
    .addTo(map);
    