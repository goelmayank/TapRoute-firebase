'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();
const QRCode = require('qrcode');
var request = require("request");

const findJouneyModule = require("./findJourney")

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
      console.log("req: " + req);
      try {
        var data = req.body;
        // var obj = {
        //   "userId": data.userId,
        //   "origin": data.origin,
        //   "destination":data.destination,
        //   "less_walking":data.less_walking,
        //   "first_mile":{
        //       "mode":data.first_mile.mode,
        //       "start_time":data.first_mile.start_time,
        //       "end_time":data.first_mile.end_time
        //     },
        //   "transit":{
        //       "num_changes":data.transit.num_changes,
        //       "num_stations":data.transit.num_stations
        //     },
        //   "last_mile":{
        //       "mode":data.last_mile.mode,
        //       "fare":data.last_mile.fare,
        //       "start_time":data.last_mile.start_time,
        //       "end_time":data.last_mile.end_time
        //     }
        // };

        console.log("Inside handler, data: ", data);
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
      request("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+doc_id, function(error, response, body) {
        console.log("response : "+ response + "body : "+ body);
        res.send(response);
      });

    });
