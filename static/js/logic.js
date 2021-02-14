

// var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   tileSize: 512,
//   maxZoom: 18,
//   zoomOffset: -1,
//   id: "mapbox/satellite-v9",
//   accessToken: API_KEY
// });

// var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   tileSize: 512,
//   maxZoom: 18,
//   zoomOffset: -1,
//   id: "mapbox/outdoors-v11",
//   accessToken: API_KEY
// });





// Our AJAX call retrieves our earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {






  // Here we make an AJAX call to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(platedata) {


      //create a variable for the map
      var map = L.map("map", {
        center: [45.7128, -110.0059],
        zoom: 4
      });


      //set map parameters
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(map);

//create legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ["<10", "10-30", "30-50", "50-70", "70-90", "90+"];
    var colors = ["#006699", "#33707a", "#667a5c", "#99853d", "#cc8f1f", "#ff9900"];
    var labels = ["Epicenter Depth (km) "];

    
    //create the html for the legend
    limits.forEach(function(limit, index) {
      labels.push("<b style=\"background-color: " + colors[index] + "\">&nbsp;" + limits[index] + "&nbsp;</b>");
    });
    div.innerHTML += "<b>" + labels.join("") + "</b>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(map);

  

      //get coordinates for plate boundaries
      var platesData = platedata.features;
      var platePoly = platesData.map(d =>d.geometry.coordinates);
      

      //reverse the order of the coordinates
      var platePolyFixed = platePoly.map(function(line) {
        return(line.map(function(d) {
          var latLng = [d[1], d[0]];
          return (latLng)
        })
        )
      });

      //assign data for earthquakes to a new dictionary
      var quakeData = data.features;
      var quakes = quakeData.map(function(d) {
        return({
          "lat": d.geometry.coordinates[1],
          "lng": d.geometry.coordinates[0],
          "depth": d.geometry.coordinates[2],
          "magnitude": d.properties.mag
        });
      });

      //build circles for each earthquake
      quakes.forEach(function(d) {
        //create color variable
        var color;

        //conditionals to determine circle color
        if (d.depth < 10) {
          color = "#006699"
        }
        else if (d.depth < 30) {
          color = "#33707a"
        }
        else if (d.depth < 50) {
          color = "#667a5c"
        }
        else if (d.depth < 70) {
          color = "#99853d"
        }
        else if (d.depth < 90) {
          color = "#cc8f1f"
        }
        else {
          color = "#ff9900"
        }


        //create a variable for circle radius based on magnitude
        var rad = (d.magnitude ** 3)* 1000;  //magnitude cubed for more dramatic effect
        
        //create a circle responsive to depth and magnitude, and bind pop-up information
        L.circle([d.lat, d.lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.75,
          radius: rad
        }).bindPopup("<b>Magnitude: " + d.magnitude + "</b> <hr> <b>Depth: " + d.depth + "</b>").addTo(map);


        //create a small circle to locate epicenter, and bind pop-up information
        L.circle([d.lat, d.lng], {
          color: color,
          fillColor: color,
          fillOpacity: 1,
          radius: 100
        }).bindPopup("<p>Magnitude: " + d.magnitude + "</p> <hr> <p>Depth: " + d.depth + "</p>").addTo(map);
      });

      //draw the tectonic plates
      platePolyFixed.forEach(function(d) {
        L.polyline(d, {
          color: "#7DA38E"
        }).addTo(map);
      });

      

    })})