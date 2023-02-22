const express = require('express');
const weatherRouter = require('./routers/weatherRouters');
const coordinateRouter = require('./routers/coordinateRouters');
const cors = require("cors");
const bodyParser = require("body-parser");


const port = 8090;
const app = express()
    .use(cors())
    .use(bodyParser.json())
    .use(weatherRouter())
    .use(coordinateRouter())

app.listen(port, () => {
    console.log("WeatherServer listening on localhost:" + port);
});


