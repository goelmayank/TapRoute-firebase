'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const findJouneyModule = require("./findJourney")
const qrCodeModule = require("./qrCode")
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
