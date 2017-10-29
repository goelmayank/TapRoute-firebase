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
		res.json({rsult: 'Survey with ID: ${ref.id} add'});
	});
});

const nodemailer = require('nodemailer');
const mailTransport = nodemailer.createTransport({
	host: 'smtpout.gmail.com',
	port: 465,
	secure: true,
	auth:{
		email: 'teamtaproute@gmail.com',
		pass: 'L00pm0bility'
	}
});


exports.surveymail = functions.firestore.document('subway/{documentId}').onCreate((event) => {
	var userData ={
		name: event.data.get('name'),
		email : event.data.get('email'),
		phno : event.data.get('phno'),
		otp : Math.floor(Math.random()*8999 + 1000),
		freeRides: 3
	}
	db.collection('sregister').add(userData).then(ref =>{
		console.log("Survey Data Saved");
		const mailOption = {
			form: '"Team TapRoute" <teamtaproute@gmail.com>',
			to: userData.email,
			subject: "Thanks for participating in our Survey",
			text:'Your OTP: ${userData.otp}\nThanks a lot for your time in filling up our survey. We know personal data is precious, we promise to take good care of it.\nAs a token of appreciation and goodwill please use the OTP to avail three free rides.'
		}
		mailTransport.sendMail(mailOption);
		return ref.id;
	});
	return event.eventId;
});