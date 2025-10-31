const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
const axios = require("axios");
const app = express();

//******** docxtemplater ********//
const docxtemplater = require("./utils/docxtemplater/docxtemplater");
//******** xlsx ********//
const spreadsheet = require("./utils/spreadsheet/spreadsheet");

var dirshare_dev = __dirname + "/utils/spreadsheet/temp/";
var dirshare = "/share/temp/";
var dircreateshare = "/share/temp/";

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(
  fileUpload({
    createParentPath: true,
  })
);
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

//CORS Middleware
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization"
  );

  next();
});

app.get("/export", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

//#region  docxtemplater
app.post("/export/docxtemplater", (request, response) => {
  let data_2 = request.body;
  var buf = docxtemplater.create(data_2);
  let destPath = path.resolve(
    dirshare_dev + request.body.nameFile.replace("/", "_")
  );
  fs.writeFileSync(destPath, buf);
  response.send({ docxtemplater: destPath });
});

//#region   ============== EXCEL ==============
app.post("/export/spreadsheet", (request, response) => {
  let fileName = request.body.namefileExport;
  let destPath = path.resolve(dirshare_dev + fileName);

  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(true);
  spreadsheet
    .create({ ...request.body, fileName: fileName, destPath: destPath })
    .then((res) => {
      response.send({ path: dirshare_dev + fileName, name: fileName });
    });
  //   }, 3000);
  // });
});
//#endregion

app.get("/export/downloadfile", (request, response) => {
  let filename = request.query.filename.replace("/", "_");
  const file = `${dirshare_dev}${filename}`;
  response.download(file); // Set disposition and send it.
});

//SAML
app.post("/LoginSAML", (req, response) => {
  var saml = req.body.SAMLResponse;
  axios
    .post("http://172.16.42.124:30001/backOfficeApi/Login/CheckSAML", {
      saml: saml,
    })
    .then((res2) => {
      let url = `/login?saml=` + res2.data;
      return response.redirect(url);
    });
});

app.use(express.static(path.resolve(__dirname, "..", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
});

module.exports = app;
