var gMapsClient = require('@google/maps').createClient({
  key:'AIzaSyAaXO23aeFwBmXlSRweQhCdEUYoAW1OPYk'
});

exports.handler = (even, callback)=>{
  gMapsClient.reverseGeocode({
    latlng:[event.data.val().lat, event.data.val().lng]
  },
    (err, response) =>{
      if(!err && response.status==200){
        console.log(response.json.results)
        return response.json.results
      }
    });
}


/* var request = require("request");


exports.reverseGeocoding = function (lat, lng,callback){
  var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=AIzaSyAaXO23aeFwBmXlSRweQhCdEUYoAW1OPYk";
  return (new Promise((resolve, reject)=>{
    
    request(url, callback)

    function callback(err, response, body){ 
        if(err) reject(err);
        if (response.statusCode == 200) {
          resolve(JSON.parse(body).routes);
        }
      }
  }))
} */