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
	try{
		findJouneyModule.metroSearch({origin,destination},function(data){
			console.log('inside callback :P ', data);
			try{
				event.data.ref.set({
					message: "added",
					first_mile_metro_details: data.first_mile_metro_details,
					first_mile_duration: data.first_mile_duration,
					first_mile_solo_fare: data.first_mile_solo_fare
					// first_mile_share_fare: data.first_mile_share_fare,
					// mode_active: data.mode_active,
					// transit_lines_text: data.transit_lines_text,
					// transit_stops: data.transit_stops,
					// transit_duration_number: data.transit_duration_number,
					// transit_duration_text: data.transit_duration_text,
					// metro_fare: data.metro_fare,
					// last_mile_metro_details: data.last_mile_metro_details,
					// last_mile_duration: data.last_mile_duration,
					// last_mile_solo_fare: data.last_mile_solo_fare,
					// last_mile_share_fare: data.last_mile_share_fare,
					// destination_end_time_text: data.destination_end_time_text,
					// total_solo_fare : data.total_solo_fare ,
					// total_share_fare : data.total_share_fare
				}
				, {merge: true});
			}catch(e){
				console.log('eeeeeerrr', err)
			}
		});
	}catch(e){
		console.log(e);
	}
	return "fff";
		

	});





// const rtdb = admin.database();
// const firestore = admin.firestore();

// const calculateRideToDemandRatio = require("./rideQuants")
// exports.rideRatios = functions.https.onRequest((req, res) => {
// 	rideRatios.handler(req, res, database, firestore);
// });



// const writeSurvey = require("./writeSurvey")
var db = admin.firestore();
const bodyParse = require('body-parser');
exports.pilot = functions.https.onRequest((req, res) => {
	console.log(bodyParse.toString((req.body)));

	db.collection('survey').add(req.body).then(ref=> {
		console.log(ref.id);
	});
	res.status(200, "added");
	return "ABC"
});