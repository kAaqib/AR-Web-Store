const fs = require("fs");
const https = require("https");
const express = require("express");

const app = express();
app.use(express.static("build")); // Serve your AR files

const options = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
};

https.createServer(options, app).listen(443, () => {
    console.log("Server running on https://192.168.168.240:443");
});