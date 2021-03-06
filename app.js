// Load env setting
require("dotenv").config();

global.__basedir = __dirname;
global.__baseurl = "http://localhost:3000";

// Dependencies
const express = require("express");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

var app = express();
var PORT = process.env.SERVER_PORT;

// Set template engine
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// Static File Service
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("public"));

// Body-parser
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
// Cookie parser
app.use(cookieParser());

// Set the secret key for jwt
app.set("jwt-secret", process.env.JWT_SECRET);

// Routing
app.use("/api", require("./routes/api"));
app.use("/front", require("./routes/front"));

app.get("/", (req, res) => {
  res.redirect("/front");
});

var server = app.listen(PORT, function() {
  console.log(`Server listening on ${PORT}`);

  force = false;

  require("./models")
    .sequelize.sync({ force: force })
    .then(() => {
      console.log("Databases sync");
      if (force) require("./init/init.js");
    });
});
