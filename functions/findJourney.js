var request = require("request");
let baseUrl = 'https://maps.googleapis.com/maps/api/';
let apiKey = 'AIzaSyAaXO23aeFwBmXlSRweQhCdEUYoAW1OPYk';

var gMapsClient = require('@google/maps').createClient(
{
	key: apiKey
});

function metroSearch({origin,destination},callback){
	var self = {};
	Promise.all([
		(getNearbyMetro(self.origin.location, self)),
		(getNearbyMetro(self.destination.location, self))
		]).subscribe(results => {
			self.first_mile_metro_details = results[0];
			self.last_mile_metro_details = results[1];


			tripFare(self.origin.location,{lat: self.first_mile_metro_details.geometry.location.lat(), lng: self.first_mile_metro_details.geometry.location.lng()},"", function(duration, fare, route){

				self.first_mile_solo_fare = fare;
				self.first_mile_share_fare = Math.trunc(fare*0.6);

				self.first_mile_duration = duration;
				self.total_time += parseInt(duration)

				self.total_solo_fare += self.first_mile_solo_fare;
				self.total_share_fare += self.first_mile_share_fare;

				self.origin_end_time = addSeconds(self.origin_start_time, route.legs[0].duration.value);

				metroFare(self.first_mile_metro_details.place_id, self.last_mile_metro_details.place_id, "&departure_time="+ Math.floor(self.origin_end_time.getTime()/1000), function(route){


					var next = (new Date()).getTime();


					if(route){
						self.metro_fare = route.fare.value;
						self.total_solo_fare += self.metro_fare;
						self.total_share_fare += self.metro_fare;

						self.transit_end_time = addSeconds(self.origin_end_time, route.legs[0].duration.value);
						next = Math.floor(self.transit_end_time.getTime()/1000);

						self.transit_duration = route.legs[0].duration.text;
						self.transit_duration_number = self.transit_duration.split(' ')[0];
						self.transit_duration_text = self.transit_duration.split(' ')[1];

						self.total_time += parseInt(self.transit_duration.split(' ')[0]);

						self.transit_info = route.legs[0].steps;
						var lines = [];
						for(var i in self.transit_info){
							if(self.transit_info[i].travel_mode == "TRANSIT"){
								lines.push(self.transit_info[i].transit_details.line.short_name);
								self.transit_stops += self.transit_info[i].transit_details.num_stops;
							}
						}
						self.transit_lines_text = lines.join(" > ");
						self.transit_first_line = lines[0];
						if(lines[1])
							self.transit_second_line = lines[1];

						if(self.transit_end_time.getMinutes() < 10)
							self.transit_end_time_text = self.transit_end_time.getHours() +":0" + self.transit_end_time.getMinutes()
						else
							self.transit_end_time_text = self.transit_end_time.getHours() +":" + self.transit_end_time.getMinutes()
					}

					tripFare(self.destination.location,{lat: self.last_mile_metro_details.geometry.location.lat(), lng: self.last_mile_metro_details.geometry.location.lng()},"&departure_time="+ next, function(duration, fare, route){

						self.last_mile_solo_fare = fare;
						self.last_mile_share_fare = Math.trunc(fare*0.6);

						self.total_solo_fare += self.last_mile_solo_fare;
						self.total_share_fare += self.last_mile_share_fare;

						self.last_mile_duration = duration;
						self.total_time += parseInt(duration);
						self.destination_end_time = addSeconds((self.transit_end_time || self.origin_end_time), route.legs[0].duration.value);
						if(self.destination_end_time.getMinutes() < 10)
							self.destination_end_time_text = self.destination_end_time.getHours() +":0" +self.destination_end_time.getMinutes()
						else
							self.destination_end_time_text = self.destination_end_time.getHours() +":" +self.destination_end_time.getMinutes()

						callback(self);
					});
				});

			});

		})

	}

	function getNearbyMetro(position_latlong: any, env:any){
		var self = env;
		console.log('getNearbyMetro for', position_latlong);

		var location = position_latlong.lat + "," + position_latlong.lng;

		var request = {
			location: location,
			rankBy: gMapsClient.places.RankBy.DISTANCE,
			types: ["subway_station"]
		}

		return (new Promise(function(resolve, rejected){

			gMapsClient.places(request, callback);

			function callback(data, status){
				if (status == "OK") {
					resolve(data[0]);
				}else{
					rejected(status);
				}
			}
		}))
	}

	function tripFare(latlng1,latlng2,custom, callback){

		return gMapsClient.directions(latlng1.lat + ',' + latlng1.lng, latlng2.lat + ',' + latlng2.lng, "driving").subscribe(r => {
			if(r){
			// console.log('milefare', r.routes[0].legs[0])
			var distance = r.routes[0].legs[0].distance;
			var duration = r.routes[0].legs[0].duration;
			var fare = Math.round(this.base_fare + (distance.value/1000)*this.per_km_fare);
			// console.log(fare)
			callback(duration.text.match(/\d+/), fare, r.routes[0])
		}
	});
	}


	function addSeconds(start, seconds){
		return new Date((start || (new Date())).getTime() + seconds*1000);
	}

	function metroFare(id1, id2, custom, callback){
	// console.log("metro fare called")
	// var name1 = latlng1.lat.toString() + ',' + latlng1.lng.toString();
	// var name2 = latlng2.lat.toString() + ',' + latlng2.lng.toString();
	return gMapsClient.directions('place_id:' +id1, 'place_id:'+id2, "transit", '&alternatives=true'+ custom).subscribe(r => {
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
	});
}