
            let maptoken = mapToken;
            console.log(maptoken);
            mapboxgl.accessToken = maptoken;
            const map = new mapboxgl.Map({
                container: 'map', // container ID
                center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
                // Kolkata Coordinates 22°34′03″N 88°22′12″E
                zoom: 9 // starting zoom
            });

          

            const marker = new mapboxgl.Marker({ color: 'red' })
            .setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setHTML(
                    `<h4>${listing.title}</h4><p>Exact Location will be provided after booking<p/>`
                )
            )
            .addTo(map);
     