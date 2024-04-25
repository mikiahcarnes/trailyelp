mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/dark-v11", // style URL
  center: trail.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(trail.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${trail.title}</h5><p>${trail.location}</p>`
    )
  )
  .addTo(map);
