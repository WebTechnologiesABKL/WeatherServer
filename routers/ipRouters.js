const express = require("express");
const http = require("http");

//Yannick Bruns
async function getIP(ip) {
    return new Promise(resolve => {
        http.get('http://ip-api.com/json/' + ip, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                try {
                    console.log(data);
                    let result = JSON.parse(data);
                    resolve({
                        city: result.city,
                        country: result.countryCode
                    });
                } catch (e) {
                    console.log("Error: " + e.message);
                    resolve({
                        error: e.message
                    });
                }
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

    router.get('/ip', async function (req, res, next) {
        try {
            console.log();
            console.log("------------------------------------------------------------------------");
            console.log("New Request IP:");
            console.log(JSON.stringify(req.query));
            let ok = false;
            if (req.query.ip) {
                ok = true;
            }
            if (ok) {
                let ip = req.query.ip;

                let loc = await getIP(ip);
                if (await loc.error) {
                    console.log("Error transforming ip to city!");
                    throw new Error("Error transforming ip to city!");
                } else {
                    console.log(JSON.stringify(await loc));

                    console.log("------------------------------------------------------------------------");
                    res.status(200).json({
                        city: await loc.city,
                        country: await loc.country
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