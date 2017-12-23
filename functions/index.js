'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();

const findJouneyModule = require("./findJourney")
const QRCode = require('qrcode');
// export.updateJourney = functions.firestore
//     .document('journey/{journeyId}')
//     .onCreate((event) => {
//         const data = event.data.data();
//         const origin = data.origin;
//         const destination = data.destination;
//         try {
//             return findJouneyModule.metroSearch({ origin, destination }, function(data) {
//                 console.log('inside callback :P ');
//                 try {
//                     var obj = Object.assign({ message: "added" }, data)
//                     event.data.ref.set(obj, { merge: true });

//                 } catch (e) {
//                     console.log('eeeeeerrr', err)
//                 }


//             });
//         } catch (e) {
//             console.log(e);
//         }



//     });

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

    exports.qrAPI = functions.https.onRequest((req, res) => {
      var doc_id = "13cfas554656hshg77887";
      try {
        var data = req.body;
        // var obj = {
        //     "userId":data.userId
            // "origin":"Name",
            // "destination":"Name",
            // "less_walking":0/1,
            // "first_mile":{
            //     "mode":"bus/auto",
            //     "fare":"bus/metro",
            //     "start_time":"in_ms",
            //     "end_time":"in_ms"
            // },
            // "transit":{
            //     "num_changes":"bus/auto",
            //     "num_stations":"bus/metro"
            // },
            // "last_mile":{
            //     "mode":"bus/auto",
            //     "fare":"bus/metro",
            //     "start_time":"in_ms",
            //     "end_time":"in_ms"
            // }
        // };
        console.log("Inside handler, data: ", data);
        //TODO : put the required data into qrinfo/type_a/<userID> doc.
        // Firestore listens to this event and creates qrcodes/type_a/<userID>.
        // The app listens to this doc and retrieves the value

        db.collection("qrCode").add(data)
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            doc_id = docRef.id;
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
      } catch (e) {
          console.log(e);
      }
      res.send({"qrCode_id": doc_id});
    });
