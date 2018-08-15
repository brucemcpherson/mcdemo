const express = require('express');
const routing = require('./src/routing');
const cacher = require('./src/cacher');
const fetcher = require('./src/fetcher');

// get the env or use a default
const ip = process.env.IP || "0.0.0.0";
const port = process.env.PORT || 8081;
const mode = process.env.MODE || "c9";

// start express
const app = express();

// initliaze cache and fetcher
cacher.init(mode);
fetcher.init(mode);

// set up routing
routing.init(app);

// start the server
app.listen(port, ip);
