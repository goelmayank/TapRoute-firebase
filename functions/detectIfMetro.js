var request = require("request");

exports.detectIfMetro = function (placeid,callback){
  var url = "https://maps.googleapis.com/maps/api/place/details/json?"+placeid+"&"key=AIzaSyAaXO23aeFwBmXlSRweQhCdEUYoAW1OPYk";
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