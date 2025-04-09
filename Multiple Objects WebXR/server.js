const fs = require("fs");
const https = require("https");
const express = require("express");

const app = express();
app.use(express.static("build")); // Serve your AR files

const options = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
};

https.createServer(options, app).listen(444, () => {
    console.log("Server running on https://your_ipv4_address:444");
});
