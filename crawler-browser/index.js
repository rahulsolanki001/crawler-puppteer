const express = require('express');
const puppeteer=require('puppeteer');
const app = express();
const cors = require('cors')
const port = 7000;

const {Cluster}=require("puppeteer-cluster");



//urls
const BASE_URL = "https://blinkit.com/";
const BASE_URL2 = "https://www.dunzo.com/delhi";
const BASE_URL3 = 'https://www.swiggy.com/instamart';
// fuse.js
app.use(cors())
app.use(express.static('public'));

(async()=>{

        const cluster=await Cluster.launch({
            concurrency:Cluster.CONCURRENCY_CONTEXT,
            maxConcurrency:1,
            timeout:25000, 
            puppeteerOptions:{
                headless: "new",
                ignoreHTTPSErrors: true,
                timeout: 25000,
        
                args: [
                    "--window-size=900,1200",
                    "--remote-debugging-port=7000",
                    /*"--remote-debugging-address=0.0.0.0", 
                    "--disable-gpu",
                    "--disable-features=IsolateOrigins,site-per-process",*/
                ],
                defaultViewport: null
            }
        })
      

        cluster.on('taskerror', (err, data) => {
            console.log(`Error on cluster task... ${data}: ${err.message}`);
        });

       

    




})()

    
    
   
app.listen(port, () => {
    console.log(`browser running on port ${port}`);
});

