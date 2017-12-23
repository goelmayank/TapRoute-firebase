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
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
