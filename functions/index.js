const functions = require('firebase-functions');
const admin = require('firebase-admin');
var request = require("request");

// init app
admin.initializeApp(functions.config().firebase);

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

exports.getDistanceBetweenTwoPoints = functions.database.ref('/journey').onWrite(function (event) {
	// Exit when the data is deleted.
	if (!event.data.exists()) {
		return;
	}

	// Grab the current value of what was written to the Realtime Database
	const data = event.data.val();
	var apiKey = 'AIzaSyAaXO23aeFwBmXlSRweQhCdEUYoAW1OPYk';
	var origin = data.transit_origin;
	var destination = data.transit_destination;
	var url  = "https://maps.googleapis.com/maps/api/directions/json?origin="+origin+"&destination="+destination+"&key="+apiKey+"&units=imperial";
	console.log(url);
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			var dis = json.routes[0].legs[0].distance.text.split(" ");
			var  distNt= Math.ceil(dis[0] * 10) / 10;
			if(dis[1]=='ft') {

				distNt = dis[0] / 5280;
				distNt= Math.ceil(distNt * 10) / 10;

			}
			var distance  = distNt+" Mile";
			console.log("routes == ",json.routes[0]);
			var duration=json.routes[0].legs[0].duration.text;
			var start_address=json.routes[0].legs[0].start_address;
			var end_address=json.routes[0].legs[0].end_address;

			if(distance =='' ) { distance =" 0 Mile"; }
			if(duration =='' ) { distance =" 0"; }
			if(start_address =='' ) { distance =""; }
			if(end_address =='' ) { distance =""; }

			data = {};
			data.distance=distance;
			data.duration=duration;
			data.start_address=start_address;
			data.end_address=end_address;
			cb(null,data)
		}
	});
});