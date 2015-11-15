var express = require('express');
var fs = require('fs');
var url = require('url');
var app = express();

app.get('/', function (request, response) {
  var jsonId = request.query.jsonId;
  if (jsonId > 0) {
    response.sendFile(__dirname + '/scripts/JSON' + jsonId + '.json');
    return;
  }
  var fileName = request.query.file;
  fs.exists(fileName ? fileName : '', function(exists) {
    if (exists) {
      response.set('Content-Type', 'audio/mpeg');
      var stats = fs.statSync(fileName);
      var size = stats['size'];
      var current = 0;
      var separatorSize = 512 * 1024;
      var bytes = '';
      bytes += '0-' + (separatorSize - 1) + '/' + size;
      response.set('Content-Length', size);
      response.set('Content-Range', 'bytes ' + bytes);
      fs.createReadStream('./' + fileName).pipe(response.status(206));
    } else {
      response.sendFile(__dirname + '/index.html');
    }
  });
});

app.use(express.static(__dirname + '/scripts'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});