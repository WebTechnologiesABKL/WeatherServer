const express = require("express");
const https = require("https");

const geocodingApiKey = "eca6d24e87b3422dbc4d9b502b5e2cca";


async function getWeather(time, lat, lon){
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
async function getCoordinates(city, country){
    return new Promise(resolve => {
        https.get('https://api.geoapify.com/v1/geocode/search?text=' + city + ',' + country + '&apiKey=' + geocodingApiKey, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                let result = JSON.parse(data);
                resolve({
                    lat: result.features[0].properties.lat,
                    lon: result.features[0].properties.lon
                });

            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
            resolve({
                error: err.message
            });
        })
    });
}
function createRouter() {
    const router = express.Router();
    const owner = "";

    router.get('/weather', async function(req, res, next){
        try{
            console.log();
            console.log("------------------------------------------------------------------------");
            console.log("New Request:");
            console.log(JSON.stringify(req));
            let ok = false;
            if (req.query.city && req.query.country && req.query.time) {
                ok = true;
            }
            if(ok){
                let city = req.query.city;
                let country = req.query.country;
                let time = new Date(req.query.time);
                let weather = 'No weather data!';

                let coordinates = await getCoordinates(city, country);
                if(await coordinates.error){
                    console.log("Error transforming city to coordinates!");
                    throw new Error("Error transforming city to coordinates!");
                }else{
                    console.log("Coordinates");
                    console.log(JSON.stringify(coordinates));

                    weather = await getWeather(time, coordinates.lat, coordinates.lon);
                    if(weather.error){
                        console.log("Error getting weather!");
                        throw new Error("Error getting weather!");
                    }else{
                        console.log("WeatherData:");
                        console.log(JSON.stringify(weather));
                        console.log("------------------------------------------------------------------------");
                        res.status(200).json({
                            weather: weather
                        });

                    }
                }
            }else{
                console.log("Bad Request!");
                console.log("------------------------------------------------------------------------");
                res.status(400).json({});
            }

        }catch(e){
            console.error("Unknown Error occurred:");
            console.error(e);
            console.log("------------------------------------------------------------------------");
            res.status(500).json({});
        }

    });


    return router;
}
module.exports = createRouter;