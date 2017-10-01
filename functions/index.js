'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

/**
 * Triggers when a user gets a new follower and sends a notification.
 *
 * Followers add a flag to `/followers/{followedUid}/{followerUid}`.
 * Users save their device notification tokens to `/users/{followedUid}/notificationTokens/{notificationToken}`.
 */
 exports.sendFollowerNotification = functions.database.ref('/followers/{followedUid}/{followerUid}').onWrite(event => {
 	const followerUid = event.params.followerUid;
 	const followedUid = event.params.followedUid;
  // If un-follow we exit the function.
  if (!event.data.val()) {
  	return console.log('User ', followerUid, 'un-followed user', followedUid);
  }
  console.log('We have a new follower UID:', followerUid, 'for user:', followerUid);

  // Get the list of device notification tokens.
  const getDeviceTokensPromise = admin.database().ref(`/users/${followedUid}/notificationTokens`).once('value');

  // Get the follower profile.
  const getFollowerProfilePromise = admin.auth().getUser(followerUid);

  return Promise.all([getDeviceTokensPromise, getFollowerProfilePromise]).then(results => {
  	const tokensSnapshot = results[0];
  	const follower = results[1];

    // Check if there are any device tokens.
    if (!tokensSnapshot.hasChildren()) {
    	return console.log('There are no notification tokens to send to.');
    }
    console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');
    console.log('Fetched follower profile', follower);

    // Notification details.
    const payload = {
    	notification: {
    		title: 'You have a new follower!',
    		body: `${follower.displayName} is now following you.`,
    		icon: follower.photoURL
    	}
    };

    // Listing all tokens.
    const tokens = Object.keys(tokensSnapshot.val());

    // Send notifications to all tokens.
    return admin.messaging().sendToDevice(tokens, payload).then(response => {
      // For each message check if there was an error.
      const tokensToRemove = [];
      response.results.forEach((result, index) => {
      	const error = result.error;
      	if (error) {
      		console.error('Failure sending notification to', tokens[index], error);
          // Cleanup the tokens who are not registered anymore.
          if (error.code === 'messaging/invalid-registration-token' ||
          	error.code === 'messaging/registration-token-not-registered') {
          	tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
      }
  }
});
      return Promise.all(tokensToRemove);
  });
});
});

/**
 * Triggers when a user approaches a metro station.
 *
 * Name of approaching metro station saved as destination_station_approaching : <Station Name> when geolocation service called at second last station.
 */
 exports.sendFollowerNotification = functions.database.ref('/trips/{tripID}/destination_station_approaching/{stationName}').onWrite(event => {
 	const tripID = event.params.tripID;
 	const stationName = event.params.stationName;
  // If un-follow we exit the function.

  // Get the list of device notification tokens.
  const getDeviceTokensPromise = admin.database().ref(`/users/${tripID}/notificationTokens`).once('value');

  return Promise.all([getDeviceTokensPromise]).then(results => {
  	const tokensSnapshot = results[0];

    // Check if there are any device tokens.
    if (!tokensSnapshot.hasChildren()) {
    	return console.log('There are no notification tokens to send to.');
    }
    console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');

    // Notification details.
    const payload = {
    	notification: {
    		title: 'Destination approaching!',
    		body: `You are about to reach your destination, ${stationName}`,
    	}
    };

    // Listing all tokens.
    const tokens = Object.keys(tokensSnapshot.val());

    // Send notifications to all tokens.
    return admin.messaging().sendToDevice(tokens, payload).then(response => {
      // For each message check if there was an error.
      const tokensToRemove = [];
      response.results.forEach((result, index) => {
      	const error = result.error;
      	if (error) {
      		console.error('Failure sending notification to', tokens[index], error);
          // Cleanup the tokens who are not registered anymore.
          if (error.code === 'messaging/invalid-registration-token' ||
          	error.code === 'messaging/registration-token-not-registered') {
          	tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
      }
  }
});
      return Promise.all(tokensToRemove);
  });
});
});

//push notification
exports.sendMessageNotification = functions.database.ref('conversations/{conversationID}/messages/{messageID}').onWrite(event => {
	if (event.data.previous.exists()) {
		return;
	}

	firebase.database().ref('messages').child(event.params.messageID).once('value').then(function(snap) {
		var messageData = snap.val();

		var topic = 'notifications_' + messageData.receiverKey;
		var payload = {
			notification: {
				title: "You got a new Message",
				body: messageData.content,
			}
		};

		admin.messaging().sendToTopic(topic, payload)
		.then(function(response) {
			console.log("Successfully sent message:", response);
		})
		.catch(function(error) {
			console.log("Error sending message:", error);
		});
	});
});

// calculate driver's rating
exports.calculateRating = functions.database.ref('/trips/{tripId}').onWrite(function (event) {
	// Exit when the data is deleted.
	if (!event.data.exists()) {
		return;
	}

	// Grab the current value of what was written to the Realtime Database
	const original = event.data.val();

	// validate data
	if (!original.rating) {
		return;
	}

	admin.database().ref('/trips').orderByChild('driverId').equalTo(original.driverId).once('value', function (snap) {
		var stars = 0;
		var count = 0;

		snap.forEach(function(trip) {
			if (trip.val().rating) {
				stars += parseInt(trip.val().rating);
				count++
			}
		});

		// calculate avg
		var rating = stars / count;
		admin.database().ref('/drivers/' + original.driverId).update({
			rating: rating.toFixed(1)
		});
	});
});

// calculate driver report
exports.makeReport = functions.database.ref('/trips/{tripId}').onWrite(function (event) {
	// Exit when the data is deleted.
	if (!event.data.exists()) {
		return;
	}

	// Grab the current value of what was written to the Realtime Database
	const original = event.data.val();

	// get old status
	const oldStatus = event.data.child('status').previous.val();

	if ((original.status == TRIP_STATUS_FINISHED) && (oldStatus == TRIP_STATUS_GOING)) {
		var date = new Date();
		var fee = parseFloat(original.fee);

		// total sale
		admin.database().ref('reports/' + original.driverId + '/total').once('value').then(function (snapshot) {
			var snapshotVal = snapshot.val() ? parseFloat(snapshot.val()) : 0;
			admin.database().ref('reports/' + original.driverId + '/total').set(parseFloat(snapshotVal) + fee);
		});

		// by year
		var yearPath = 'reports/' + original.driverId + '/' + date.getFullYear();
		admin.database().ref(yearPath + '/total').once('value').then(function (snapshot) {
			var snapshotVal = snapshot.val() ? parseFloat(snapshot.val()) : 0;
			admin.database().ref(yearPath + '/total').set(parseFloat(snapshotVal) + fee);
		});

		// by month
		var monthPath = yearPath + '/' + (date.getMonth() + 1);
		admin.database().ref(monthPath + '/total').once('value').then(function (snapshot) {
			var snapshotVal = snapshot.val() ? parseFloat(snapshot.val()) : 0;
			admin.database().ref(monthPath + '/total').set(parseFloat(snapshotVal) + fee);
		});

		// by date
		var datePath = monthPath + '/' + date.getDate();
		admin.database().ref(datePath + '/total').once('value').then(function (snapshot) {
			var snapshotVal = snapshot.val() ? parseFloat(snapshot.val()) : 0;
			admin.database().ref(datePath + '/total').set(parseFloat(snapshotVal) + fee);
		});
	}
});

// Make external request
exports.sendExternalRequest = functions.database.ref('/journey').onWrite(function(event) {
	request('https://taproute-python.herokuapp.com/readData', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('Success');
		}
	});
});

var dist = require("./getDistance");
var data = {};
data.origin="33.71468353,73.06603241";
data.destination="33.71468443,73.06603432";
dist.getDistanceBetweenTwoPoints(data,function(err,success) {
	console.log(err);
	console.log(success);
});

// Moments library to format dates.
const moment = require('moment');
// CORS Express middleware to enable CORS Requests.
const cors = require('cors')({origin: true});
// [END additionalimports]

// [START all]
/**
 * Returns the server's date. You must provide a `format` URL query parameter or `format` vaue in
 * the request body with which we'll try to format the date.
 *
 * Format must follow the Node moment library. See: http://momentjs.com/
 *
 * Example format: "MMMM Do YYYY, h:mm:ss a".
 * Example request using URL query parameters:
 *   https://us-central1-<project-id>.cloudfunctions.net/date?format=MMMM%20Do%20YYYY%2C%20h%3Amm%3Ass%20a
 * Example request using request body with cURL:
 *   curl -H 'Content-Type: application/json' /
 *        -d '{"format": "MMMM Do YYYY, h:mm:ss a"}' /
 *        https://us-central1-<project-id>.cloudfunctions.net/date
 *
 * This endpoint supports CORS.
 */
// [START trigger]
exports.date = functions.https.onRequest((req, res) => {
// [END trigger]
  // [START sendError]
  // Forbidding PUT requests.
  if (req.method === 'PUT') {
    res.status(403).send('Forbidden!');
  }
  // [END sendError]

  // [START usingMiddleware]
  // Enable CORS using the `cors` express middleware.
  cors(req, res, () => {
  // [END usingMiddleware]
    // Reading date format from URL query parameter.
    // [START readQueryParam]
    let format = req.query.format;
    // [END readQueryParam]
    // Reading date format from request body query parameter
    if (!format) {
      // [START readBodyParam]
      format = req.body.format;
      // [END readBodyParam]
    }
    // [START sendResponse]
    const formattedDate = moment().format(format);
    console.log('Sending Formatted date:', formattedDate);
    res.status(200).send(formattedDate);
    // [END sendResponse]
  });
});
// [END all]

exports.bigben = functions.https.onRequest((req, res) => {
  const hours = (new Date().getHours() % 12) + 1; // london is UTC + 1hr;
  // [START_EXCLUDE silent]
  // [START cachecontrol]
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  // [END cachecontrol]
  // [START vary]
  res.set('Vary', 'Accept-Encoding, X-My-Custom-Header');
  // [END vary]
  // [END_EXCLUDE]
  res.status(200).send(`<!doctype html>
    <head>
      <title>Time</title>
    </head>
    <body>
      ${'BONG '.repeat(hours)}
    </body>
  </html>`);
});
