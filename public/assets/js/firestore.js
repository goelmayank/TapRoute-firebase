// Initialize Firebase
var config = {
  apiKey: "AIzaSyD-TqyWR5ctQrVE2CwoH1ZVFRWFiy32RnM",
  authDomain: "taproute-168910.firebaseapp.com",
  projectId: "taproute-168910",

};

firebase.initializeApp(config);
var db = firebase.firestore();

function save(message,collection){

	db.collection(collection).add({
	  pin:message,
	  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
	}).then(function(docRef) {
	  console.log("Document written with ID: ", docRef.id);
	})
	.catch(function(error) {
	  console.error("Error adding document: ", error);

	});
}

function set(pin,obj,collection){
	obj = Object.assign(obj, {timestamp: firebase.firestore.FieldValue.serverTimestamp(),});
	db.collection(collection).doc(pin).set(obj).then(function(docRef) {
	  console.log("Document written with ID: ", docRef.id);
	})
	.catch(function(error) {
	  console.error("Error adding document: ", error);

	});
}

function get(pin,collection){

	db.collection(collection).doc(pin).get().then(function(doc) {
		if (doc.exists) {
			console.log("Document data:", doc.data());
		} else {
			console.log("No such document!");
		}
	}).catch(function(error) {
		console.log("Error getting document:", error);
	});

}