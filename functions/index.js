'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();
const QRCode = require('qrcode');
var request = require("request");
var rp = require('request-promise');
var hypertrack = require('hypertrack-node').hypertrack('sk_test_a7a8e1039f0f7aa1e18c08c439cf026650fe692b');

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;
        try {

          hypertrack.places
          .create({
              "location": {
                  "geojson": {
                      "type": "Point",
                      "coordinates": [
                          item.Latitude, item.Longitude
                      ]
                  },
              },
              "name":item.Stop
          }).then(function(place) {
            console.log("Place of Stop "+ item.Stop + " is "+place.toString());
          });

        } catch (e){
          console.log(e);
          res.status(401).send({error: e.toString()});
        }
        returnArr.push(item);
    });

    return returnArr;
};

exports.ActionsAllocationAPI = functions.https.onRequest((req, res) => {
      console.log("req: " + req);
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

<!--------------------------ignore------------------------------------>
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
