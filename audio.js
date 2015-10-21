var express = require('express');
var fs = require('fs');
var url = require('url');
var app = express();


app.get('/', function (request, response) {
  var fileName = request.query.file;
  fs.exists(fileName ? fileName : "", function(exists) {
    if (exists) {
      response.set('Content-Type', 'audio/mpeg');
      // Accept-Ranges: bytes
      var stats = fs.statSync(fileName);
      var size = stats["size"];
      response.set('Content-Length', size);
      response.set('Content-Range', 'bytes 0-' + (size - 1) + '/' + size);
      fs.createReadStream("./" + fileName).pipe(response.status(206));
    } else {
      response.send('Hello World!');
    }
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});