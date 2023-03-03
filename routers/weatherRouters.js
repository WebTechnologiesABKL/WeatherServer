const express = require("express");
const https = require("https");

//Yannick Bruns
async function getWeather(time, lat, lon) {
    return new Promise(resolve => {
        https.get('https://api.brightsky.dev/weather?date=' + time.toISOString() + '&lat=' + lat + '&lon=' + lon, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(JSON.parse(data));
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
            resolve({
                error: err.message
            })
        });
    });
}

//Yannick Bruns, Patrick Langkau
function createRouter() {
    const router = express.Router();
    const owner = "";

    router.get('/weather', async function (req, res, next) {
        try {
            console.log();
            console.log("------------------------------------------------------------------------");
            console.log("New Request Weather:");
            console.log(JSON.stringify(req.query));
            let ok = false;
            if (req.query.lat && req.query.lon && req.query.time) {
                ok = true;
            }
            if (ok) {
                let coordinates = {
                    lat: parseFloat(req.query.lat),
                    lon: parseFloat(req.query.lon)
                }
                let time = new Date(req.query.time);
                let weather = 'No weather data!';

                console.log("Coordinates");
                console.log(JSON.stringify(coordinates));

                weather = await getWeather(time, coordinates.lat, coordinates.lon);
                if (weather.error) {
                    console.log("Error getting weather!");
                    throw new Error("Error getting weather!");
                } else {
                    console.log("WeatherData:");
                    console.log(JSON.stringify(weather));
                    console.log("------------------------------------------------------------------------");
                    res.status(200).json({
                        weather: weather
                    });

                }
            } else {
                console.log("Bad Request!");
                console.log("------------------------------------------------------------------------");
                res.status(400).json({});
            }

        } catch (e) {
            console.error("Unknown Error occurred:");
            console.error(e);
            console.log("------------------------------------------------------------------------");
            res.status(500).json({});
        }

    });


    return router;
}

module.exports = createRouter;