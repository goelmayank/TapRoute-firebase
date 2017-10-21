var request = require("request");

exports.reverseGeocoding = function (lat, lng){
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
}