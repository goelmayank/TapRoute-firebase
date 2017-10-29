/*===============================1. REQUIRED LIBRARIES AND CONFIGURATIONS==========================*/
const functions = require('firebase-functions');
const admin = require('firebase-admin');
apikey = 'AIzaSyAaXO23aeFwBmXlSRweQhCdEUYoAW1OPYk'
var gMapsClient = require('@google/maps').createClient({
    key: apikey
});
/*========================================END HERE=================================================*/


// var db = admin.firestore();

// exports.handler = function (req, res, firestore) {
//     var surveyResponse = req.body.form
    
//     db.collection('survey').add(surveyResponse).then(ref => {
//         console.log('Added document with ID: ', ref.id);
//     });
//     res.status(200, "response recorded");
    
// }