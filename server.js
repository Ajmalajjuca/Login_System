let express = require("express");
let app = express();
let path = require("path");
let port = process.env.PORT || 3001;
let bodyparser = require("body-parser");
let router = require("./router");


app.use(bodyparser.urlencoded({ extended: true }));

app.use("/", router);

app.set("view engine", "ejs");

app.use("/static", express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`running....http://localhost:${port}`);
});
