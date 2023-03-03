const express = require("express");
const https = require("https");

const geocodingApiKey = "eca6d24e87b3422dbc4d9b502b5e2cca";


//Yannick Bruns
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

//Yannick Bruns, Patrick Langkau
function createRouter() {
    const router = express.Router();
    const owner = "";

    router.get('/coordinates', async function(req, res, next){
        try{
            console.log();
            console.log("------------------------------------------------------------------------");
            console.log("New Request Coordinates:");
            console.log(JSON.stringify(req.query));
            let ok = false;
            if (req.query.city && req.query.country) {
                ok = true;
            }
            if(ok){
                let city = req.query.city;
                let country = req.query.country;

                let coordinates = await getCoordinates(city, country);
                if(await coordinates.error){
                    console.log("Error transforming city to coordinates!");
                    throw new Error("Error transforming city to coordinates!");
                }else{
                    console.log("Coordinates");
                    console.log(JSON.stringify(coordinates));

                    console.log("------------------------------------------------------------------------");
                    res.status(200).json({
                        lat: coordinates.lat,
                        lon: coordinates.lon
                    });

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