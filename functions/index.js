const functions = require('firebase-functions');
const admin = require('firebase-admin');
var dist = require("./getDistance");

// init app
admin.initializeApp(functions.config().firebase);

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

var dist = require("./getDistance");
var data = {};
data.origin="33.71468353,73.06603241";
data.destination="33.71468443,73.06603432";
dist.getDistanceBetweenTwoPoints(data,function(err,success) {
    console.log(err);
    console.log(success);
});	
