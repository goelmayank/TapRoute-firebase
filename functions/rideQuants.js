/*This Firebase Function is responsible of returning to use app the information in following format 
{
    "nearby_supply":X,
    "local_demand":Y,
    "supply_demand_ratio":Z
}
on receiving a RESTful request on the api endpoint /rideQuant with a request body in following format
{
    "queryLocation":[
        "lat":"latitude",
        "lng":"longitude"
    }
}
*/

/*===============================1. REQUIRED LIBRARIES AND CONFIGURATIONS==========================*/
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
apikey = 'AIzaSyAaXO23aeFwBmXlSRweQhCdEUYoAW1OPYk'
var gMapsClient = require('@google/maps').createClient({
    key: apikey
});
/*========================================END HERE=================================================*/


exports.handler = function (req, res, database, firestore) {
/*===============================2. REQUEST DATA PROCESSING=========================================
queryLat and queryLng store the gps data from the query made*/
    var queryLat = req.body.queryLocation.lat;
    var queryLng = req.body.queryLocation.queryLng;

/*===============================3. RESPONSE DATA AGGREGATION======================================*/
//The following snippet is to obtain the list the snapshot of current gps location of available rides    
    var rtdb = functions.database();
    var av_rides = rtdb.ref('available_rides');
    
    av_rides.on('value', function (snapshot) {
        snapshot.forEach(function (listOfAvRides) {
            var avRideList = listOfAvRides.val();
        });
    });

//TODO Need Help in fetching data from listOfAvRides such that list reads as [[lat1, lng1], [lat2, lng2], [lat3, lng3]] and store it in the listOfOrigins
    var theListOfOrigins = [];



//The following snippet is to traverse through the list of geolocation of available rides and parse request for ddistance and time info from Google Maps Distance Matrix API and store the number of rides that are 200m or less away from origin
    allDistance = listOfAvRides.forEach(function (value) {
        gMapsClient.distanceMatrix({
            origins: theListOfStrings,
            destinations: [queryLat, queryLng],
            traffic_model: 'pessimistic'
    });
}
/*======================================ENDS HERE==================================================*/