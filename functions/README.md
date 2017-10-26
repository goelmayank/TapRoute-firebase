## Understanding Google Maps Client for NodeJS

```bash
googlemaps distanceMatrix --origins '[[28.478865, 77.086249], [28.478802, 77.086266], [28.478666, 77.086732]]' --destinations '[[28.478632, 77.008778]]' --traffic_model 'pessimistic' --departure_time 'now' --transit_mode '["subway"]'
```
returned this as reponse
```json
{
    "destination_addresses": [
        "558, Dhanwapur Rd, Laxman Vihar, Sector 3A, Gurugram, Haryana 122006, India"
    ],
    "origin_addresses": [
        "18, Maruti Housing Colony, Sector 28, Gurugram, Haryana 122022, India",
        "18, Maruti Housing Colony, Sector 28, Gurugram, Haryana 122022, India",
        "A-40/1, Chakkarpur, Sector 28, Gurugram, Haryana 122022, India"
    ],
    "rows": [
        {
            "elements": [
                {
                    "distance": {
                        "text": "11.0 km",
                        "value": 10974
                    },
                    "duration": {
                        "text": "30 mins",
                        "value": 1800
                    },
                    "duration_in_traffic": {
                        "text": "25 mins",
                        "value": 1525
                    },
                    "status": "OK"
                }
            ]
        },
        {
            "elements": [
                {
                    "distance": {
                        "text": "11.0 km",
                        "value": 10980
                    },
                    "duration": {
                        "text": "30 mins",
                        "value": 1801
                    },
                    "duration_in_traffic": {
                        "text": "25 mins",
                        "value": 1526
                    },
                    "status": "OK"
                }
            ]
        },
        {
            "elements": [
                {
                    "distance": {
                        "text": "11.1 km",
                        "value": 11139
                    },
                    "duration": {
                        "text": "31 mins",
                        "value": 1843
                    },
                    "duration_in_traffic": {
                        "text": "26 mins",
                        "value": 1564
                    },
                    "status": "OK"
                }
            ]
        }
    ],
    "status": "OK"
}
```

We have to look into documentation of Google Maps APIs and start creating code per requirement, the part to understand is that `googlemaps` services each require special params which needs to be sent for getting the data out. The [documentation can be found at here](https://googlemaps.github.io/google-maps-services-js/docs/GoogleMapsClient.html) and the meaning of the params can be [found here](https://developers.google.com/maps/documentation/distance-matrix/intro#https-or-http).
