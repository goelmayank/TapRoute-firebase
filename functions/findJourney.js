var request = require("request");
let baseUrl = 'https://maps.googleapis.com/maps/api/';
let apiKey = 'AIzaSyAaXO23aeFwBmXlSRweQhCdEUYoAW1OPYk';

var gMapsClient = require('@google/maps').createClient(
{
	key: apiKey
});

// exports.metroSearch = function({origin,destination},callback){
// 	var self = {};
// 	Promise.all([
// 		(getNearbyMetro(origin.location, self)),
// 		(getNearbyMetro(destination.location, self))
// 		]).then(results => {
// 			self.first_mile_metro_details = results[0];
// 			self.last_mile_metro_details = results[1];

// 			// Hardcoded Google Places ID for Baiyappanhalli Metro Station
// 			if (self.first_mile_metro_details.id === '1eadd44c245f7e14adbd0a4379465fa1d096a1d7') {
// 				self.mode_active = 'FIRST_MILE'
// 			}
// 			if (self.last_mile_metro_details.id === '1eadd44c245f7e14adbd0a4379465fa1d096a1d7') {
// 				self.mode_active = 'LAST_MILE'
// 			}

// 			tripFare(origin.location,{lat: self.first_mile_metro_details.geometry.location.lat(), lng: self.first_mile_metro_details.geometry.location.lng()}, new Date().getTime()/1000, function(duration, fare, route){

// 				self.first_mile_solo_fare = fare;
// 				self.first_mile_share_fare = Math.trunc(fare*0.6);

// 				self.first_mile_duration = duration;
// 				self.total_time += parseInt(duration)

// 				self.total_solo_fare += self.first_mile_solo_fare;
// 				self.total_share_fare += self.first_mile_share_fare;

// 				self.origin_end_time = addSeconds(self.origin_start_time, route.legs[0].duration.value);

// 				metroFare(self.first_mile_metro_details.place_id, self.last_mile_metro_details.place_id, "&departure_time="+ Math.floor(self.origin_end_time.getTime()/1000), function(route){


// 					var next = (new Date()).getTime();


// 					if(route){
// 						self.metro_fare = route.fare.value;
// 						self.total_solo_fare += self.metro_fare;
// 						self.total_share_fare += self.metro_fare;

// 						self.transit_end_time = addSeconds(self.origin_end_time, route.legs[0].duration.value);
// 						next = Math.floor(self.transit_end_time.getTime()/1000);

// 						self.transit_duration = route.legs[0].duration.text;
// 						self.transit_duration_number = self.transit_duration.split(' ')[0];
// 						self.transit_duration_text = self.transit_duration.split(' ')[1];

// 						self.total_time += parseInt(self.transit_duration.split(' ')[0]);

// 						self.transit_info = route.legs[0].steps;
// 						var lines = [];
// 						for(var i in self.transit_info){
// 							if(self.transit_info[i].travel_mode == "TRANSIT"){
// 								lines.push(self.transit_info[i].transit_details.line.short_name);
// 								self.transit_stops += self.transit_info[i].transit_details.num_stops;
// 							}
// 						}
// 						self.transit_lines_text = lines.join(" > ");
// 						self.transit_first_line = lines[0];
// 						if(lines[1])
// 							self.transit_second_line = lines[1];

// 						if(self.transit_end_time.getMinutes() < 10)
// 							self.transit_end_time_text = self.transit_end_time.getHours() +":0" + self.transit_end_time.getMinutes()
// 						else
// 							self.transit_end_time_text = self.transit_end_time.getHours() +":" + self.transit_end_time.getMinutes()
// 					}

// 					tripFare(self.destination.location,{lat: self.last_mile_metro_details.geometry.location.lat(), lng: self.last_mile_metro_details.geometry.location.lng()},"&departure_time="+ next, function(duration, fare, route){

// 						self.last_mile_solo_fare = fare;
// 						self.last_mile_share_fare = Math.trunc(fare*0.6);

// 						self.total_solo_fare += self.last_mile_solo_fare;
// 						self.total_share_fare += self.last_mile_share_fare;

// 						self.last_mile_duration = duration;
// 						self.total_time += parseInt(duration);
// 						self.destination_end_time = addSeconds((self.transit_end_time || self.origin_end_time), route.legs[0].duration.value);
// 						if(self.destination_end_time.getMinutes() < 10)
// 							self.destination_end_time_text = self.destination_end_time.getHours() +":0" +self.destination_end_time.getMinutes()
// 						else
// 							self.destination_end_time_text = self.destination_end_time.getHours() +":" +self.destination_end_time.getMinutes()

// 						callback(self);
// 					});
// 				});

// 			});

// 		}).catch(e=>console.log)
// 		}

	    
	    exports.metroSearch = function({origin, destination} = {}, callback){
	    	self = {};
	    	self.origin = origin;
	    	self.destination = destination;
	    	Promise.all([getNearbyMetro(origin.location), getNearbyMetro(destination.location)])
	    	.then(results => {
			self.first_mile_metro_details = results[0];
			self.last_mile_metro_details = results[1];

			// Hardcoded Google Places ID for Baiyappanhalli Metro Station
			if (self.first_mile_metro_details.place_id === '1eadd44c245f7e14adbd0a4379465fa1d096a1d7') {
				self.mode_active = 'FIRST_MILE'
			}
			if (self.last_mile_metro_details.place_id === '1eadd44c245f7e14adbd0a4379465fa1d096a1d7') {
				self.mode_active = 'LAST_MILE'
			}
			console.log('location first mile metro', results[0].geometry.location);
			tripFare(origin.location,{lat: self.first_mile_metro_details.geometry.location.lat, lng: self.first_mile_metro_details.geometry.location.lng}, new Date().getTime()/1000 + 43200, callback)

			}).catch(callback)
	    }
 
		function getNearbyMetro(position_latlong){
			//console.log('getNearbyMetro for', position_latlong);

			var location = position_latlong.lat + "," + position_latlong.lng;

			var request = {
				location: location,
				rankby: "distance",
				type: "subway_station"
			}

			return (new Promise(function(resolve, rejected){
				console.log('-------------- Inside promise ----------');
				gMapsClient.placesNearby(request, callback);

				function callback(err, response){
					if(err)throw err;
					console.log('===============Inside placesNearby callback ==========');
					
					if (response.status == 200) {
						resolve(response.json.results[0]);
					}else{
						rejected(response);
					}
				}
			}))
		}

		function tripFare(latlng1,latlng2,dept, callback){
			var request = {
				origin: latlng1.lat+"," + latlng1.lng,
				destination: latlng2.lat+"," + latlng2.lng,
				mode: "driving",
				departure_time: dept
			};

			return gMapsClient.directions(request, function(r){
				if(r.status == 200 && r.json.status == "OK")
					callback2(r.json.results)
			})
			function callback2(r) {
				console.log('++++++ trip fare callback ++++', r)
				if(r){
				// console.log('milefare', r.routes[0].legs[0])
				var distance = r.routes[0].legs[0].distance;
				var duration = r.routes[0].legs[0].duration;
				var fare = Math.round(this.base_fare + (distance.value/1000)*this.per_km_fare);
				// console.log(fare)
				callback(duration.text.match(/\d+/), fare, r.routes[0])
				}
			}
		}


		function addSeconds(start, seconds){
			return new Date((start || (new Date())).getTime() + seconds*1000);
		}

		function metroFare(id1, id2, dept, callback){
		// console.log("metro fare called")
		// var name1 = latlng1.lat.toString() + ',' + latlng1.lng.toString();
		// var name2 = latlng2.lat.toString() + ',' + latlng2.lng.toString();
		var request = {
				origin: "place_id:"+id1,
				destination: "place_id:"+id2,
				departure_time: dept,
				alternatives: true,
				mode: "transit"
			};
		return gMapsClient.directions(request, function(r){
			if(r.status == 200 && r.json.status == "OK")
				callback2(r.json.results)
		})
		function callback2(r){
			if(r){
				// console.log('transit fastest routes', r);
				var route = this.findRoute(0, r.routes);
				if(route != null){
					// console.log('found Fare B)')
				}else{
					// console.log("finding fare failed")
				}
				callback(route);
			}
		}
}