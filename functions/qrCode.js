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
    "qrcode":"link_of_png"
}
*/

/*===============================1. REQUIRED LIBRARIES AND CONFIGURATIONS==========================*/
const functions = require('firebase-functions');
const admin = require('firebase-admin');
var qrCode = require('qrcode');

/*========================================END HERE=================================================*/


exports.handler = function (req, res, database, firestore) {
//===============================1. Store DATA and fetch the document id=========================================
/*check if qrcodes/type_a/<userID> doc exits . If it does , delete it.
Then put the required data into qrinfo/type_a/<userID> doc.
Firestore listens to this event and creates qrcodes/type_a/<userID>.
The app listens to this doc and retrieves the value*/
    var data = req.body;

    var qrCode_id = "abc";



/*===============================2. create QR Code and return its image url======================================*/
  //The following snippet is to generate the qrcode with the the journey id encrypted on it
  return qrCode.toDataURL(qrCode_id, function (err, url) {
    console.log(url);
    return url;
  })

}

/*======================================ENDS HERE==================================================*/
