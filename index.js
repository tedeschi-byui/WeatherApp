require("dotenv").config();

const PORT = process.env.PORT || 5000;

var ejs = require("ejs");
var express = require("express");
var app = express();
request = require("request");

app.use(express.static("public"));
app.use(express.static(__dirname));
app.use(express.json());

app.set("views", "views");
app.set("view engine", "ejs");

app.listen(PORT, function() {
  console.log("Listening on port " + PORT);
});

app.get("/", function(req, res) {
  res.render("index");
  res.end();
});

app.get("/api/weather/:latlong", (req, res) => {
  console.log(`API: GET->Weather: ${req.params.latlong}`);

  getWeather(req.params.latlong)
    .then(data => {
      // console.log(`success: ${JSON.stringify(data)}`);
      // do what you have to do
      res.json(data);
      res.end();
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
      res.end();
    });
});

function getWeather(latlong) {
  return new Promise((resolve, reject) => {
    request(
      `https://api.darksky.net/forecast/${process.env.DARK_SKY_SECRET}/${latlong}`,
      (error, response, body) => {
        if (!error && response.statusCode == 200) {
          resolve({ success: true, response: JSON.parse(body) });
        } else {
          reject({ success: false, error: response });
        }
      }
    );
  });
}
