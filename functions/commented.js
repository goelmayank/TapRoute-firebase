/**
 * Triggers when a user approaches a metro station.
 *
 * Name of approaching metro station saved as destination_station_approaching : <Station Name> when geolocation service called at second last station.
 */
//  exports.sendFollowerNotification = functions.database.ref('/trips/{tripID}/destination_station_approaching/{stationName}').onWrite(event => {
//  	const tripID = event.params.tripID;
//  	const stationName = event.params.stationName;

//   // Get the list of device notification tokens.
//   const getDeviceTokensPromise = admin.database().ref(`/users/${tripID}/notificationTokens`).once('value');

//   return Promise.all([getDeviceTokensPromise]).then(results => {
//   	const tokensSnapshot = results[0];

//     // Check if there are any device tokens.
//     if (!tokensSnapshot.hasChildren()) {
//     	return console.log('There are no notification tokens to send to.');
//     }
//     console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');

//     // Notification details.
//     const payload = {
//     	notification: {
//     		title: 'Destination approaching!',
//     		body: `You are about to reach your destination, ${stationName}`,
//     	}
//     };

//     // Listing all tokens.
//     const tokens = Object.keys(tokensSnapshot.val());

//     // Send notifications to all tokens.
//     return admin.messaging().sendToDevice(tokens, payload).then(response => {
//       // For each message check if there was an error.
//       const tokensToRemove = [];
//       response.results.forEach((result, index) => {
//       	const error = result.error;
//       	if (error) {
//       		console.error('Failure sending notification to', tokens[index], error);
//           // Cleanup the tokens who are not registered anymore.
//           if (error.code === 'messaging/invalid-registration-token' ||
//           	error.code === 'messaging/registration-token-not-registered') {
//           	tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
//       }
//   }
// });
//       return Promise.all(tokensToRemove);
//   });
// });
// });

//push notification
// exports.sendMessageNotification = functions.database.ref('conversations/{conversationID}/messages/{messageID}').onWrite(event => {
// 	if (event.data.previous.exists()) {
// 		return;
// 	}

// 	firebase.database().ref('messages').child(event.params.messageID).once('value').then(function(snap) {
// 		var messageData = snap.val();

// 		var topic = 'notifications_' + messageData.receiverKey;
// 		var payload = {
// 			notification: {
// 				title: "You got a new Message",
// 				body: messageData.content,
// 			}
// 		};

// 		admin.messaging().sendToTopic(topic, payload)
// 		.then(function(response) {
// 			console.log("Successfully sent message:", response);
// 		})
// 		.catch(function(error) {
// 			console.log("Error sending message:", error);
// 		});
// 	});
// });

// calculate driver's rating
// exports.calculateRating = functions.database.ref('/trips/{tripId}').onWrite(function (event) {
// 	// Exit when the data is deleted.
// 	if (!event.data.exists()) {
// 		return;
// 	}

// 	// Grab the current value of what was written to the Realtime Database
// 	const original = event.data.val();

// 	// validate data
// 	if (!original.rating) {
// 		return;
// 	}

// 	admin.database().ref('/trips').orderByChild('driverId').equalTo(original.driverId).once('value', function (snap) {
// 		var stars = 0;
// 		var count = 0;

// 		snap.forEach(function(trip) {
// 			if (trip.val().rating) {
// 				stars += parseInt(trip.val().rating);
// 				count++
// 			}
// 		});

// 		// calculate avg
// 		var rating = stars / count;
// 		admin.database().ref('/drivers/' + original.driverId).update({
// 			rating: rating.toFixed(1)
// 		});
// 	});
// });

// // calculate driver report
// exports.makeReport = functions.database.ref('/trips/{tripId}').onWrite(function (event) {
// 	// Exit when the data is deleted.
// 	if (!event.data.exists()) {
// 		return;
// 	}

// 	// Grab the current value of what was written to the Realtime Database
// 	const original = event.data.val();

// 	// get old status
// 	const oldStatus = event.data.child('status').previous.val();

// 	if ((original.status == TRIP_STATUS_FINISHED) && (oldStatus == TRIP_STATUS_GOING)) {
// 		var date = new Date();
// 		var fee = parseFloat(original.fee);

// 		// total sale
// 		admin.database().ref('reports/' + original.driverId + '/total').once('value').then(function (snapshot) {
// 			var snapshotVal = snapshot.val() ? parseFloat(snapshot.val()) : 0;
// 			admin.database().ref('reports/' + original.driverId + '/total').set(parseFloat(snapshotVal) + fee);
// 		});

// 		// by year
// 		var yearPath = 'reports/' + original.driverId + '/' + date.getFullYear();
// 		admin.database().ref(yearPath + '/total').once('value').then(function (snapshot) {
// 			var snapshotVal = snapshot.val() ? parseFloat(snapshot.val()) : 0;
// 			admin.database().ref(yearPath + '/total').set(parseFloat(snapshotVal) + fee);
// 		});

// 		// by month
// 		var monthPath = yearPath + '/' + (date.getMonth() + 1);
// 		admin.database().ref(monthPath + '/total').once('value').then(function (snapshot) {
// 			var snapshotVal = snapshot.val() ? parseFloat(snapshot.val()) : 0;
// 			admin.database().ref(monthPath + '/total').set(parseFloat(snapshotVal) + fee);
// 		});

// 		// by date
// 		var datePath = monthPath + '/' + date.getDate();
// 		admin.database().ref(datePath + '/total').once('value').then(function (snapshot) {
// 			var snapshotVal = snapshot.val() ? parseFloat(snapshot.val()) : 0;
// 			admin.database().ref(datePath + '/total').set(parseFloat(snapshotVal) + fee);
// 		});
// 	}
// });

// const detectIfMetroModule = require("./detectIfMetro")
// exports.detectIfMetro = functions.database.ref('/gps_feed/users/{userId}').onWrite((e)=>{
// 	detectIfMetroModule.handler(e,console.log)
// function(res){
// 		admin.database().ref('log/123').set(res);
// 	})
// });

// var dist = require("./getDistance");
// var data = {};
// data.origin="33.71468353,73.06603241";
// data.destination="33.71468443,73.06603432";
// dist.getDistanceBetweenTwoPoints(data,function(err,success) {
// 	console.log(err);
// 	console.log(success);
// });

// console.log('finding journey...')
// require("./findJourney").fullRide({origin: '12.9913, 77.6521', destination: '12.9719, 77.6412'}, function(res){
// 	console.log('**********find_journey************\n', res)
// });
