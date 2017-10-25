var request = require("request");
let baseUrl = 'https://maps.googleapis.com/maps/api/';
let apiKey = 'AIzaSyAaXO23aeFwBmXlSRweQhCdEUYoAW1OPYk';

exports.handler = (event, callback)=>{
  return reverseGeocodingModule.handler(event,callback);
}

exports.fullRide = function({origin, destination} = {}, callback){
	var data = {};
	
	Promise.all([getNearbyMetro(origin), getNearbyMetro(destination)]).then(results =>{
		
		data.origin_metro = results[0];
		data.destination_metro = results[1];
		data.trips = [];
		// console.log(data.origin_metro)
		getTripDetails(origin, data.origin_metro.geometry.location.lat +","+ data.origin_metro.geometry.location.lng, "now")
		.then(route =>{
	
			data.trips.push(Object.assign(route,{'name': 'first_mile'}));
			var origin_end = addSeconds(null, route.legs[0].duration.value);
	
			getTransitDetails(data.origin_metro.place_id, data.destination_metro.place_id,  Math.floor(origin_end.getTime()/1000))
			.then(routes =>{
	
				var route = findRoute(0, routes);

				if(route){
					data.transit = route;					
					var transit_end = addSeconds(origin_end, route.legs[0].duration.value);
					
					getTripDetails(data.destination_metro.geometry.location.lat +","+ data.destination_metro.geometry.location.lng,destination, Math.floor(transit_end.getTime()/1000))
					.then(route =>{
						data.trips.push(Object.assign(route,{'name': 'last_mile'}));
						callback(data)						
					})
				}
			}).catch(err=>{
				console.log('transit details err :', err);	
			})			
		}).catch(err=>{
			console.log('origin trip err :', err);
		})

	}).catch(err =>{
		console.log('getNearbyMetro err :', err);
	})
}


function getNearbyMetro(position_cords){
		
		let url = constructUrl('place/nearbysearch/', {
			location: position_cords,
			rankby: 'distance',
			type: "subway_station"
		});


		return (new Promise(function(resolve, reject){
			
			request(url, callback)

			function callback(err, response, body){ 
				if(err) reject(err);
				// console.log('inside request callback', Object.keys(JSON.parse(body).results));
				if (response.statusCode == 200) {
					resolve(JSON.parse(body).results[0]);
				}
			}
		}))
}

function constructUrl(rel_url, config){
	string = baseUrl + rel_url + 'json?key=' + apiKey;
	for(var k in config)
		string += ("&" + k + "=" + config[k]);
	return string;
}



function getTripDetails(position1, position2, departure_time){
	let url = constructUrl('directions/', {
		origin: position1,
		destination: position2,
		mode: "driving",
		departure_time,
	})
	return (new Promise((resolve, reject)=>{

		request(url, callback)

		function callback(err, response, body){ 
				if(err) reject(err);
				if (response.statusCode == 200) {
					console.log(Object.keys(JSON.parse(body)))
					resolve(JSON.parse(body).routes[0]);
				}
			}
	}))
}


function getTransitDetails(place_id1, place_id2, departure_time){
	let url = constructUrl('directions/', {
		origin: 'place_id:' + place_id1,
		destination: 'place_id:' + place_id2,
		mode: "transit",
		departure_time,
		alternatives: 'true',
	});
	return (new Promise((resolve, reject)=>{
		
		request(url, callback)

		function callback(err, response, body){ 
				if(err) reject(err);
				if (response.statusCode == 200) {
					resolve(JSON.parse(body).routes);
				}
			}
	}))
}

function findRoute(i, routes){
		// console.log(i, routes);
		if(i >= routes.length){
			return null;
		}
		if(Object.keys(routes[i]).indexOf("fare") != -1){
			return (routes[i]);
		}
		return this.findRoute(++i,routes);
}


function addSeconds(start, seconds){
	return new Date((start || (new Date())).getTime() + seconds*1000);	
}
