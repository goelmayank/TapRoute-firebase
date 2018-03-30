'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();
const QRCode = require('qrcode');
var rp = require('request-promise');
var hypertrack = require('hypertrack-node').hypertrack('sk_test_d82656ada82f4b5c2133e1789328330721a47454');
var GeoJSON = require('geojson');
// import the module
// var request = require('request');

function CreatePlacesAndActions(busStops, busNumber, userID) {
		var returnArr = [];
		var i=0;
		busStops.forEach(function(busStop) {
				var updating = false;
				var item = busStop.val();
				var create_action = function(hypertrack_id){
					hypertrack.actions.create({
												"user_id": userID,
												"collection_id": busNumber,
												"type": "stop",
												"expected_place_id": hypertrack_id,
												"autocomplete_rule": {
													 "type": "geofence",
													 "place_label": "expected_place"
												}
											})
							.then(function(action) {
								console.log(action);
								//Actions are automatically assigned to user
							});
				}
				try {
					var item_id = busNumber+"_"+busStop.key;
					if(!item.hasOwnProperty("hypertrack_id") || item.hypertrack_id==0){
						updating = true;
						hypertrack.places
							.create({
									"name":item.Stop,
									"unique_id":item_id,
									"location": {
											"type": "Point",
											"coordinates": [
												item.Longitude, item.Latitude
											]
									},
							}).then(function(place) {
								//place props: id,name,location,address,locality,landmark,zip_code,city,state,country,lookup_id,unique_id,display_text
								console.log("Place of Stop "+ item.Stop + " is "+place.name + "," + place.address + "," + place.id + "," + place.unique_id);
								//set hypertrack_id in firebase database
								admin.database().ref('busStops').child(busNumber).child(busStop.key).update({
									"hypertrack_id": place.id,
									"unique_id": place.unique_id
								});
								create_action(place.id);
							});
					}
					i+=1;
					if(!updating) 
						create_action(item.hypertrack_id);
				} catch (e){
					console.log(e);
				}
		});
};

exports.ActionsAllocationAPI = functions.https.onRequest((req, res) => {
			console.log("req: " + req);
			var busNumber = "764";
			var user_id = "db418cbe-3fed-437b-8790-f3a36bfb8b05";//data.userId
			try {
				var data = req.query;
				console.log("Inside handler, data: ", user_id);
				admin.database().ref('busStops').child(busNumber).once('value')
				.then(function(busStops) {
					try {
						//TODO: We can set rules to autocreate actions: https://docs.hypertrack.com/api/entities/rules.html#rules-to-autocreate-actions
						//Don't want to learn how to do that abhi, the documentation is pretty messed up.
						CreatePlacesAndActions(busStops, busNumber, user_id);
						res.status(200).json({posts: busStops.val()});
					} catch (err){
						console.log(err);
						res.status(401).send({error: err.toString()});
					}
				});
			} catch (e) {
					console.log(e);
					res.status(401).send({error: 'Server error occured. Retry after some time'});
			}



		});

//<!--------------------------ignore------------------------------------>
exports.qrAPI = functions.https.onRequest((req, res) => {
	var doc_id = "13cfas554656hshg77887";
	console.log("req: " + req);
	try {
		var data = req.query;
		console.log("Inside handler, data: ", data);
		db.collection("journey").add(data)
		.then(function(docRef) {
				console.log("Document written with ID: ", docRef.id);
				doc_id = docRef.id;
				console.log("doc_id :" + doc_id)
				var options = {
						uri: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='+doc_id,
						headers: {
								'User-Agent': 'Request-Promise',
								'Content-Type': 'application/json',
						},
						method: 'GET',
						encoding : null,
						resolveWithFullResponse: true,
						rejectUnauthorized: false
				};

				rp(options).then(function (response) {
					 res.writeHead(200, {'Cpacth': 'kjdsb'});
					 res.end(response.body);
				})
				.catch(function (err) {
						// API call failed...
						res.status(401).send({error: 'Server error occured. Retry after some time'});

				});
		})
		.catch(function(error) {
				console.error("Error adding document: ", error);
				res.status(401).send({error: 'Server error occured. Retry after some time'});
		});
	} catch (e) {
			console.log(e);
			res.status(401).send({error: 'Server error occured. Retry after some time'});
	}
});

exports.addOTP = functions.firestore
.document('user/{userId}')
.onCreate((event) => {
		const data = event.data.data();
		const id = data.id;
		const otp = id.substring(0, 4);
		try {

				var obj = Object.assign({
						otp: otp
				}, data);


				event.data.ref.set(obj, {
						merge: true
				});

		} catch (e) {
				console.log(e);
		}
});
<!--------------------------ignore------------------------------------>
