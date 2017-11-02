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
		return findJouneyModule.metroSearch({origin,destination},function(data){
			console.log('inside callback :P ');
			try{
				var obj = Object.assign({message: "added"},data)
				// first_mile_metro_details: data.first_mile_metro_details,
				// 	first_mile_duration: data.first_mile_duration,
				// 	first_mile_solo_fare: data.first_mile_solo_fare,
				// 	first_mile_share_fare: data.first_mile_share_fare,
					
				// 	transit_lines_text: data.transit_lines_text,
				// 	transit_stops: data.transit_stops,
				// 	transit_duration_number: data.transit_duration_number,
				// 	transit_duration_text: data.transit_duration_text,
				// 	metro_fare: data.metro_fare,
				// 	last_mile_metro_details: data.last_mile_metro_details,
				// 	last_mile_duration: data.last_mile_duration,
				// 	last_mile_solo_fare: data.last_mile_solo_fare,
				// 	last_mile_share_fare: data.last_mile_share_fare,
				// 	destination_end_time_text: data.destination_end_time_text,
				// 	total_solo_fare : data.total_solo_fare ,
				// 	total_share_fare : data.total_share_fare,
				// 	mode_active: data.mode_active,
				
				event.data.ref.set(obj, {merge: true});
				
			}catch(e){
				console.log('eeeeeerrr', err)
			}
			

		});
	}catch(e){
		console.log(e);
	}
	
	

	});





const rtdb = admin.database();
const firestore = admin.firestore();

// const calculateRideToDemandRatio = require("./rideQuants")
// exports.rideRatios = functions.https.onRequest((req, res) => {
// 	rideRatios.handler(req, res, database, firestore);
// });



// const writeSurvey = require("./writeSurvey")
var db = admin.firestore();


const plivo = require('plivo');
var p = plivo.RestAPI({
  authId: 'MANTNHZTC1Y2M3MWY0OT',
  authToken: 'YmRhMThjYzBiNDY3MjNhMGViZWFjYTdmNDc4ZjJl'
});

exports.surveymail = functions.firestore.document('beta-users-survey/{documentId}').onCreate((event) => {
	var userData ={
		name: event.data.get('name'),
		email : event.data.get('email'),
		phone : event.data.get('phone'),
		otp : Math.floor(Math.random()*8999 + 1000),
		freeRides: 3
	}

	var params = {
		'src': '+917905902397',
		'dst' : userData.phone,
		'text' : "Hi " +userData.name+", thank you for participating in TapRoute Survey. You can login to our pilot beta on http://taproute.io/rider"
	};
	p.send_message(params, function (status, response) {
		console.log('Status: ', status);
		console.log('API Response:\n', response);
	});
	
	db.collection('survey_register').add(userData).then(ref =>{
		console.log("Survey Data Saved");
		return ref.id;
	});

	return event.eventId;
});