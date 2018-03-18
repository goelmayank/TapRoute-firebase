'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();
const QRCode = require('qrcode');
var rp = require('request-promise');
var hypertrack = require('hypertrack-node').hypertrack('sk_test_d82656ada82f4b5c2133e1789328330721a47454');

function snapshotToArray(snapshot) {
    var returnArr = [];
    var bodyArray = [];
    snapshot.forEach(function(childSnapshot) {
        var item_x = {}
        var item = childSnapshot.val();
        item.key = childSnapshot.key;
        item_x["name"] = item.Stop
        item_x["address"] = item.Stop
        item_x["location"]["type"] = {}
        item_x["location"]["type"] = 'Point'
        item_x["location"]["coordinates"] = []
        item_x["location"]["coordinates"].push(item.Latitude)
        item_x["location"]["coordinates"].push(item.Longitude) 
        bodyArray.add(item_x)
        try {
        //   console.log("Name: "+item.Stop+" Latitude: " + item.Latitude + "Longitude: " + item.Longitude);
        console.log(item_x);
          
          // hypertrack.places
          //   .create({
          //       "location": {
          //           "geojson": {
          //               "type": "Point",
          //               "coordinates": [
          //                   item.Longitude, item.Latitude
          //               ]
          //           },
          //       },
          //       "name":item.Stop
          //   }).then(function(place) {
          //     console.log("Successfully created place: "+ place);
          //   }, function(error) {
          //     console.log("Failed to create place because "+ error);
          //   });

        } catch (e){
          console.log(e);
          res.status(401).send({error: e.toString()});
        }
        returnArr.push(item);
    });
    console.log(bodyArray)
    var retList = hypertrack.places.create(bodyArray).then(function(place) {
        console.log("Successfully created test place: "+ place.toString());
        }, function(error) {
            console.log("Failed to create test place because "+ error);
        });
    console.log("Return List: "+retList)
    return retList;
};

exports.ActionsAllocationAPI = functions.https.onRequest((req, res) => {
      try {
        var data = req.query;
        console.log("Inside handler, data: ", data.userId);
        admin.database().ref('busStops').child("764").once('value')
        .then(function(snap) {
          try {
            res.status(200).json({posts: snap.val()});
            var stops=snapshotToArray(snap);
            console.log(stops);

            // hypertrack.action.create({user_id: value, order_props: value} );

            // hypertrack.user
            // .assignAction(
            //     data.userId,
            //     {
            //         "action_ids": [
            //             "6daacb03-6f02-4c60-b084-e9ffcd9eaf56",
            //             "37ae09b4-4801-48cb-bc50-99a7ee53f257"
            //         ]
            //     }
            // );
          } catch (err){
            console.log(err);
            res.status(401).send({error: err.toString()});
          }
        });
      } catch (e) {
          console.log(e);
          res.status(401).send({error: 'Server error occured. Retry after some time'});
      }



    });

//<!--------------------------ignore------------------------------------>
exports.qrAPI = functions.https.onRequest((req, res) => {
  var doc_id = "13cfas554656hshg77887";
  console.log("req: " + req);
  try {
    var data = req.query;
    console.log("Inside handler, data: ", data);
    db.collection("journey").add(data)
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        doc_id = docRef.id;
        console.log("doc_id :" + doc_id)
        var options = {
            uri: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='+doc_id,
            headers: {
                'User-Agent': 'Request-Promise',
                'Content-Type': 'application/json',
            },
            method: 'GET',
            encoding : null,
            resolveWithFullResponse: true,
            rejectUnauthorized: false
        };

        rp(options).then(function (response) {
           res.writeHead(200, {'Cpacth': 'kjdsb'});
           res.end(response.body);
        })
        .catch(function (err) {
            // API call failed...
            res.status(401).send({error: 'Server error occured. Retry after some time'});

        });
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
        res.status(401).send({error: 'Server error occured. Retry after some time'});
    });
  } catch (e) {
      console.log(e);
      res.status(401).send({error: 'Server error occured. Retry after some time'});
  }
});

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
<!--------------------------ignore------------------------------------>
