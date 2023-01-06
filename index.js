const express = require('express');
const weatherRouter = require('./routers/weatherRouters');
const cors = require("cors");
const bodyParser = require("body-parser");


const port = process.env.PORT || 8090;
const app = express()
    .use(cors())
    .use(bodyParser.json())
    .use(weatherRouter())

app.listen(port, () => {
    console.log("WeatherServer listening on localhost:" + port);
});


