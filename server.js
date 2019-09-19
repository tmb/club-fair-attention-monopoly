// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

let bodyParser = require('body-parser')

let http = require('http').createServer(app);
let io = require('socket.io')(http);

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.static('assets'))
app.use(bodyParser.urlencoded({ extended: false }));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.post('/twcolor', (req, res) => {
  io.emit('message', {from: req.body.From, body: req.body.Body})
})



// listen for requests :)
const listener = http.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
