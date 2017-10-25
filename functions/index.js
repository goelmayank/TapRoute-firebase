'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const findJouneyModule = require("./findJourney")
// Listen for updates to any `user` document.
exports.updateJourney = functions.firestore
.document('journey/{journeyId}')
.onCreate((event) => {

	const data = event.data.data();
	const origin =  data.origin;
	const destination = data.destination;
	findJouneyModule.metroSearch({origin,destination},function(data){
		return event.data.ref.set({
			message: "added",
			first_mile_metro_details: data.first_mile_metro_details,
			first_mile_duration: data.first_mile_duration,
			first_mile_solo_fare: data.first_mile_solo_fare,
			first_mile_share_fare: data.first_mile_share_fare,
			mode_active: "FIRST_MILE",
			transit_lines_text: data.transit_lines_text,
			transit_stops: data.transit_stops,
			transit_duration_number: data.transit_duration_number,
			transit_duration_text: data.transit_duration_text,
			metro_fare: data.metro_fare,
			last_mile_metro_details: data.last_mile_metro_details,
			last_mile_duration: data.last_mile_duration,
			last_mile_solo_fare: data.last_mile_solo_fare,
			last_mile_share_fare: data.last_mile_share_fare,
			destination_end_time_text: data.destination_end_time_text,
			total_solo_fare : data.total_solo_fare ,
			total_share_fare : data.total_share_fare ,
			trip_confirmed: data.trip_confirmed

		}, {merge: true});
	});


});
