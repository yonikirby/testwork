const express = require("express");
const cors = require("cors");
const app = express().use('*', cors());
const formidable = require('formidable');
var favicon = require('serve-favicon')
//app.use(favicon('./favicon.ico'))
app.use(favicon(__dirname + '/public/favicon.ico'));
const path = require('path');
//npm start: was "start": "nodemon -x 'node server.js || touch server.js'",
//"start": "nodemon -x \"node server.js || touch server.js\"",
const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

app.use(cors());

app.use(express.json());




app.get("/", (req, res) => {
  res.json({ message: "Welcome to Weights application." });
});
 
//app.use(express.static("app/public"))
app.use(express.static(path.join(__dirname, 'public')));

require("./app/routes/routes")(app);

// set port, listen for requests 
const PORT = process.env.PORT || 8080;
 


app.listen(process.env.PORT || 8080, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});




const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
   

  module.exports = app;