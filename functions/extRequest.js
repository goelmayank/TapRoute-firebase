var request = require("request");

exports.sendExternalRequest = functions.database.ref('/journey')
    .onWrite(event => {
      request('https://taproute-python.herokuapp.com/readData', function (error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log('Success');
      }
    });
})
