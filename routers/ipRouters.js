const express = require("express");
const https = require("https");


async function getIP(ip){
    return new Promise(resolve => {
        https.get('https://freegeoip.net/json/' + ip, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                let result = JSON.parse(data);
                resolve({
                    city: data.city,
                    country: data.country_code
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

    router.get('/ip', async function(req, res, next){
        try{
            console.log();
            console.log("------------------------------------------------------------------------");
            console.log("New Request IP:");
            console.log(JSON.stringify(req.query));
            let ok = false;
            if (req.query.ip) {
                ok = true;
            }
            if(ok){
                let ip = req.query.ip;

                let loc = await getIP(ip);
                if(await loc.error){
                    console.log("Error transforming ip to city!");
                    throw new Error("Error transforming ip to city!");
                }else{
                    console.log("City:");
                    console.log(JSON.stringify(loc));

                    console.log("------------------------------------------------------------------------");
                    res.status(200).json({
                        city: loc.city,
                        country: loc.country
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