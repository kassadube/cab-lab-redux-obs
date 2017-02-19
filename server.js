// start the express server
const express = require("express");
const app = express();
var __folder = "dest";
//const web_app_config = require("./src/js/config");

module.exports = function (PROD) {
  const port = PROD ? 3000 : 3003;
  const opts = { redirect: true };
  const hostname = "localhost";//PROD ? web_app_config.WE_VOTE_HOSTNAME : "localhost";

  app.use("/", express.static(__folder, opts));
  app.all("*", (req, res) => {
    console.log([req.method, req.url].join(' '));
      res.sendFile(__dirname + "/" + __folder + "/index.html")}
      );
  
  app.listen(port, () => {
      console.log("INFO: " + "express server started", new Date());
      console.log("INFO: " + `Server is at http://${hostname}:${port}`);
  });
};
