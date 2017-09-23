var request = require("request");

exports.getDistanceBetweenTwoPoints = function (data, cb) {
	var apiKey = 'AIzaSyAokcNT-_I2Zyhp74Cq0Gtw__Q723zusN8';
	var origin = data.origin;
	var destination = data.destination;
	var url  = "https://maps.googleapis.com/maps/api/directions/json?origin="+origin+"&destination="+destination+"&key="+apiKey+"&units=imperial";
	console.log(url);
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			var dis = json.routes[0].legs[0].distance.text.split(" ");
                //var distNt=dis[0];
                var  distNt= Math.ceil(dis[0] * 10) / 10;
                if(dis[1]=='ft') {

                	distNt = dis[0] / 5280;
                	distNt= Math.ceil(distNt * 10) / 10;

                }
                var distance  = distNt+" Mile";
                console.log("routes == ",json.routes[0]);
                var duration=json.routes[0].legs[0].duration.text;
                var start_address=json.routes[0].legs[0].start_address;
                var end_address=json.routes[0].legs[0].end_address;

                if(distance =='' ) { distance =" 0 Mile"; }
                if(duration =='' ) { distance =" 0"; }
                if(start_address =='' ) { distance =""; }
                if(end_address =='' ) { distance =""; }

                data = {};
                data.distance=distance;
                data.duration=duration;
                data.start_address=start_address;
                data.end_address=end_address;
                //return data;
                cb(null,data)
            }
        });
};