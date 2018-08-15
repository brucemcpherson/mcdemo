import express from 'express';
import routing from './src/routing';

// get the env or use a default
const ip = process.env.IP || "0.0.0.0";
const port = process.env.PORT || 8081;

// start express
const app = express();

// set up routing
routing.init(app);

// start the server
app.listen(port, ip);
