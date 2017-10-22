var request = require("request");
var gMapsClient = require('@google/maps').createClient(
  {
  key:'AIzaSyAaXO23aeFwBmXlSRweQhCdEUYoAW1OPYk'
});
// const reverseGeocodingModule = require("./reverseGeocoding")

exports.handler = (event, callback)=>{
  // return reverseGeocodingModule.handler(event,callback);


  console.log(event.data.val());
  return gMapsClient.places({
      location:[event.data.val().lat, event.data.val().lng],
      radius: 100,
      types: ['subway_station'],
    }, (err, response) =>{
    if(!err && response.status==200){
      console.log(response.json.results)
      return callback(response.json)
    }
  });
}

/**googleMapsClient.geocode({
  address: '1600 Amphitheatre Parkway, Mountain View, CA'
}, function(err, response) {
  if (!err) {
    console.log(response.json.results);
  }
}); */

/* exports.detectIfMetro = function (lat, lng,callback){
  var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=AIzaSyAaXO23aeFwBmXlSRweQhCdEUYoAW1OPYk";
  return (new Promise((resolve, reject)=>{
    
    request(url, callback)

    function callback(err, response, body){ 
        if(err) reject(err);
        if (response.statusCode == 200) {
          resolve(JSON.parse(body).routes);
        }
      }
  }));
    
} */