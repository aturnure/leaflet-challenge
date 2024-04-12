// Creating the map object 
let myMap = L.map("map", {
    center: [40.09, -98.71],
    zoom: 5
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the GeoJSON data.
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the data with d3
d3.json(geoData).then(function(data) {

    // Call the createFeatures function with the earthquake data
    createFeatures(data.features);

    // Call to create the legend
    createLegend();
});

// Define the function to create earthquake markers for each quake in the data
function createFeatures(earthquakeData) {

    // Define a function to determine the color of the marker
    function getColor(depth) {
        if (depth >-10 && depth < 10) {
            return "#008000";
        } else if (depth < 30) {
            return "#FFFF00";
        } else if (depth < 50) {
            return "#FFD700";
        } else if (depth < 70) {
            return "#FFA500";
        } else if (depth < 90) {
            return "#FF6347";
        } else {
            return "#FF0000";
        }
    }

    // Loop through each piece of earthquake data and create marker
    earthquakeData.forEach(function(feature) {

        // Find depth in 3rd coordinate
        let depth = feature.geometry.coordinates[2];
        let color = getColor(depth);
        let size = Math.sqrt(feature.properties.mag) * 6
        
        // Create and format marker
        let marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: size,
            fillColor: color, 
            color: "black", 
            opacity: 0.75,
            weight: 0.5,
            fillOpacity: 0.75  
        });
        
        // Give each feature a popup that describes location, magnitude, and time
        marker.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p><p>${new Date(feature.properties.time)}</p>`);

        // Add marker to the map
        marker.addTo(myMap);
    })
}

// Define a function to create the legend
function createLegend() {
    let legend = L.control({position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let depthArray = [-10, 10, 30, 50, 70, 90];
        let colors = ["#008000", "#FFFF00", "#FFD700", "#FFA500", "#FF6347", "#FF0000"];

        // Add legend title
        div.innerHTML += "<h3>Depth</h3>";

        // Add depth range labels with colors
        for (let i = 0; i < depthArray.length; i++) {
            div.innerHTML +=
            '<span style="background:' + colors[i] + '"></span>' +
            depthArray[i] + (depthArray[i + 1] ? '&ndash;' + depthArray[i + 1] + '<br>' : '+');
        }

        return div;
    };

    // Adding the legend to the map
    legend.addTo(myMap);
}
    