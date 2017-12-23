/*This Firebase Function is responsible of returning to use app the information in following format
{
    "userId":"20_character_long",
    "origin":"Name",
    "destination":"Name",
    "less_walking":0/1,
    "first_mile":{
        "mode":"bus/auto",
        "fare":"bus/metro",
        "start_time":"in_ms",
        "end_time":"in_ms"
    },
    "transit":{
        "num_changes":"bus/auto",
        "num_stations":"bus/metro"
    },
    "last_mile":{
        "mode":"bus/auto",
        "fare":"bus/metro",
        "start_time":"in_ms",
        "end_time":"in_ms"
    }
}
on receiving a RESTful request on the api endpoint /qrcode with a request body in following format
{
    png_file
}
*/

/*===============================1. REQUIRED LIBRARIES AND CONFIGURATIONS==========================*/
const functions = require('firebase-functions');
const admin = require('firebase-admin');
var db = admin.firestore();
var QRCode = require('qrcode');

/*========================================END HERE=================================================*/


exports.handler =  function(req){
//===============================1. Store DATA and fetch the document id=========================================

    var qrCode_id = "default_qrCode";
    var data = {
        "userId":req.body.userId,
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
    };
    console.log("Inside handler, data: ", data);
    //TODO : put the required data into qrinfo/type_a/<userID> doc.
    // Firestore listens to this event and creates qrcodes/type_a/<userID>.
    // The app listens to this doc and retrieves the value

    db.collection("qrCode").add(data)
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        qrCode_id = docRef.id;
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

    return qrCode_id;

}

/*======================================ENDS HERE==================================================*/
