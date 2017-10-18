// Initialize Firebase
var config = {
  apiKey: "AIzaSyD-TqyWR5ctQrVE2CwoH1ZVFRWFiy32RnM",
  authDomain: "taproute-168910.firebaseapp.com",
  projectId: "taproute-168910",

};

firebase.initializeApp(config);
var db = firebase.firestore();

// function save(message,collection, callback = null){

// 	db.collection(collection).add({
// 	  pin:message,
// 	  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
// 	}).then(function(docRef) {
// 	  console.log("Document written with ID: ", docRef.id);
// 	  if(callback)
// 	  	callback();
// 	})
// 	.catch(function(error) {
// 	  console.error("Error adding document: ", error);

// 	});
// }

function set(pin,obj,collection){
	
	checkIfExits(pin, collection).then((b)=>{
		if(!b){
			db.collection(collection).doc(pin).set(obj).then(function() {
			  get(pin, collection)
			}).catch(e => {
				console.log(e);
			})
		}
		
		db.collection(collection).doc(pin).update(obj).then(function(){
			get(pin, collection)
		}).catch(e => {
				console.log(e);
			})
		
	})
	
}

function get(pin,collection){

	return db.collection(collection).doc(pin).get().then(function(doc) {
		if (doc.exists) {
			return doc;
			
		} else {
			console.log("No such document!");
			return null;
		}
	}).catch(function(error) {
		console.log("Error getting document:", error);
		return error
	});

}
function getOrigin(pin, collection){
	return get(pin, collection).then(doc=>{
		if(!doc)return "-1";
		return doc.data().origin?doc.data().origin:"-1";
	})
}

function checkIfExits(pin,collection){

	return db.collection(collection).doc(pin).get().then(function(doc) {
		if (doc.exists) {
			return doc.ref.id == pin;
			
		} else {
			return null;
		}
	}).catch(function(error) {
		console.log("Error getting document:", error);
	});

}