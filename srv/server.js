const express = require("express");
const passport = require("passport");
const xsenv = require("@sap/xsenv");

const httpClient = require('@sap-cloud-sdk/http-client');
const { retrieveJwt } = require('@sap-cloud-sdk/connectivity');

const { JWTStrategy } = require("@sap/xssec");
const { stdout } = require("process");
const JWStrategy = require("@sap/xssec").JWTStrategy;
const services = xsenv.getServices({ uaa:"cfdemoS0023961268-xsuaa" }, { dest: { label: 'destination' } }) ; // XSUAA service & destination



const app = express();

passport.use(new JWTStrategy(services.uaa));
app.use(passport.initialize());
app.use(passport.authenticate("JWT", { session: false}));


/*
app.get("/",function(req, res,next){
    res.send("Welcome my friend");
});
*/

app.get("/",function(req, res,next){
    res.send("Welcome my friend " + req.user.id);
});

app.get("/user",function(req, res,next){
    res.send("I am : " + req.user.id);
});

//destination reuse service
// /srv/destination?destinationX=northwind&path=Regions
app.get("/destination", async function(req, res,next){
    //res.send("I am : " + req.user.id + req.query.destinationX + req.query.path);
    try {
        
        let res1 = await httpClient.executeHttpRequest(
            {
                destinationName: req.query.destinationX || '',
                jwt: retrieveJwt(req)
            },
            {
                method: 'GET',
                url: req.query.path || '/'

            }
        );
        res.status(200).json(res1.data);

    }catch (error){
        console.log("ERRORRR"  + error);
        res.status(500).send(err.message);
    }
});


const port = process.env.PORT || 5000;
app.listen(port,function(){
    console.log("Basic NodeJS listening on port "+ port);
});