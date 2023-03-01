const http=require('http');
const fs=require('fs');
const path=require('path');

let port=5000;

let currentCity;
/**
 * @desc using these timeZone.js we can able to fetch the required data 
 */
const {allTimeZones,timeForOneCity,nextNhoursWeather} =require('./timeZone.js');
/**
 * @desc this function will create server to render the data of HTML,CSS and JS 
 */
var server=http.createServer(function(req, res) {
    req.url=req.url.replace(/%20/g," ");
    if(req.url == "/"){
        fs.readFile("index.html", "UTF-8", function(err,html){
            res.writeHead(200,{"Content-Type": "text/html"}); 
            res.end(html);
        })
    } 
    else if(req.url.match(".css")){ 
        let cssPath = path.join(__dirname,req.url); 
        let fileStream = fs.createReadStream(cssPath, "utf-8"); 
        res.writeHead(200, {"Content-Type": "text/css"}); 
        fileStream.pipe(res);
    }     
    else if(req.url.match("\.svg")){
        let imagePath = path.join(__dirname, req.url);
        let fileStream = fs.createReadStream(imagePath); 
        res.writeHead(200, {"Content-Type": "image/svg+xml"});
        fileStream.pipe(res);
    } 
    else if(req.url.match("\.js")){
        let scriptPath = path.join(__dirname,req.url); 
        let fileStream = fs.createReadStream(scriptPath); 
        res.writeHead(200, {"Content-Type": "text/javascript"}); 
        fileStream.pipe(res);
    } 
    else if(req.url == "/weatherData"){
        res.writeHead(200,{"Content-type": "application/json"}); 
        res.write(JSON.stringify(allTimeZones())); 
        res.end();
        
    }
    else if(req.url.startsWith('/weatherDataCity')){ 
        currentCity = req.url.split("=")[1];
        res.writeHead(200, {"Content-type" : "application/json"}); 
        res.write(JSON.stringify(timeForOneCity(currentCity))); 
        res.end();
    }
    else if(req.url.match('/nextFiveData')){ 
        let body= '';
         req.on('data', data => body += data.toString())
            req.on('end', () => {
                let currCityDetails = JSON.parse(body); 
                res.write(JSON.stringify(nextNhoursWeather(currCityDetails.city_Date_Time_Name, currCityDetails.hours, allTimeZones()))); 
                res.end();
            })
    } 
    else{
        res.writeHead(404, {"Content-Type": "text/html"}); 
        res.end("No pages found");
    }
})
/**
 * @desc Server listening to the assigned ports
 */
server.listen(port,()=>{
    console.log(`listening on ${port}`);
})



// const express = require('express')
// const app = express()
// const port = 5000
// const path = require('path')
// app.use(express.static(path.join(__dirname,"src" ))) 
// app.use(express.json());

// var weatherResult;

// const {allTimeZones,timeForOneCity,nextNhoursWeather} =require('./timeZone.js');

// app.get("/weatherData",(req,res)=>{
//   weatherResult=allTimeZones();
//   res.json(weatherResult);
// })

// app.get("/weatherDataCity",(req,res)=>{
//   console.log(req.params.id)
//   // console.log(timeForOneCity(req.params.id));
//   res.json(timeForOneCity(req.params.id));
// })

// app.post('/nextFiveData',(req,res)=>{
//   let cityDTN=req.body.city_Date_Time_Name;
//   let hours=req.body.hours;
//   res.json=nextNhoursWeather(cityDTN,hours,weatherResult);
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })