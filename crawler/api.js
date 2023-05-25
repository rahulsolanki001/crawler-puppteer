const puppeteer = require("puppeteer");
const cheerio = require('cheerio');
const { executablePath } = require("puppeteer");
const express = require("express");
const cors = require('cors')
const app = express();
const port = 3000;
const BASE_URL = "https://blinkit.com/";
const BASE_URL2 = "https://www.dunzo.com/delhi";
const BASE_URL3 = 'https://www.swiggy.com/instamart';

const {Cluster}=require("puppeteer-cluster");


// fuse.js
app.use(cors())
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


    const getData=async (product,location,brand)=>{
        const cluster=await Cluster.launch({
            concurrency:Cluster.CONCURRENCY_PAGE,
            maxConcurrency:3,
            timeout:22000,
            puppeteerOptions:{
                headless: false,
                
                executablePath: executablePath(),
                ignoreHTTPSErrors: true,
                timeout: 22000,
        
                args: [
                    "--window-size=700,1200",
                    /*"--remote-debugging-port=9222",
                    "--remote-debugging-address=0.0.0.0", 
                    "--disable-gpu",
                    "--disable-features=IsolateOrigins,site-per-process",*/
                ],
                defaultViewport: null
            }
        })
        let blinkRes=[]
        let dunzoRes=[]
        let instaRes=[]
    
      
    
         // Event handler to be called in case of problems
        cluster.on('taskerror', (err, data) => {
            console.log(`Error on cluster task... ${data}: ${err.message}`);
        });
    
    
    
        //blinkit
        await cluster.task(async ({page,data:{url,product,location}})=>{
    
            if(url===BASE_URL){
    
                await page.setUserAgent(
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36"
                );
                await page.goto(BASE_URL,{ waitUntil: ["networkidle2", "domcontentloaded", "load"]});
        
        
                const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        
        
            await page.$eval(
        
                "#app > div > div > div.containers__HeaderContainer-sc-1t9i1pe-0.UjObT > header > div.LocationDropDown__LocationModalContainer-sc-bx29pc-0.csVggh > div.location__shake-container.animated > div > div > div > div:nth-child(2) > button.btn.btn--inverted.location-tooltip-button",
                (form) => form.click()
            );
        
            await page.keyboard.type(location, { delay: 100 });
            //console.log("location in blinkIt", location);
        
        
           // console.log("network 0");
        
            await page.keyboard.press("Enter");
        
        
           // console.log("blink location enter");
        
            await page.$eval(
        
                "#app > div > div > div.containers__HeaderContainer-sc-1t9i1pe-0.UjObT > header > div.SearchBar__Container-sc-16lps2d-3.ZIGuc > a",
                (form) => form.click()
            );
        
        
          
        
            await delay(500)
        
            await page.keyboard.type(product, { delay: 10 });
        
        
            await page.keyboard.down("Enter");
            //console.log("blinkIt product", product);
        
        
        
            await page.evaluate(() => {
                setInterval(() => {
                    document
                        .querySelector(
                            "#app > div > div > div:nth-child(5) > div > div.SearchMobile__SearchResultContainer-sc-1teq3rv-20.hYZTia > div.SearchMobile__SearchResultsContainer-sc-1teq3rv-4.cchVME"
        
                        )
                        .scrollIntoView({
                            behavior: "smooth",
                            block: "end",
                            inline: "nearest",
                        });
                }, 400);
            });
        
        
            await delay(1500);
        
        
            const content = await page.evaluate(() => document.body.innerHTML);
            const $ = cheerio.load(content);
        
            let cardItem = $("body").find(".plp-product").map((index, item) => {
                let cardObj = {
                    image: $(item).find('.gagoLZ img').attr('src'),
                    name: $(item).find('.fxBwnM').text(),
                    price: $(item).find('.eJcLXJ').text(),
                    actualPrice: $(item).find('.GDvg').text(),
                    quantity: $(item).find('.plp-product__quantity--box').text(),
                };
                return cardObj
            }).get();
        
            //console.log('blinkit')
            blinkRes.push(cardItem)
    
    
            }else if(url===BASE_URL2){
    
                //dunzo
               // console.log("launch dunzo");
                
                await page.setUserAgent(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
                );
            
            
                await page.goto(BASE_URL2, { waitUntil: ["domcontentloaded", "networkidle2"] });
               // console.log("linkHit dunzo");
               
            
            
               await page.$eval(
                    "#header > div > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-jqmf1i-5.bidAne > div > div.sc-AxjAm.StDqM.sc-17nyegg-2.sc-1fdjem6-0.gdWmLN > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-17nyegg-8.gSPnff > p",
                    (form) => form.click()
                );
                // await delay(1000);//// not in use
                await delay(300)
    
                await page.keyboard.type(location, { delay: 50 }); //enterusername
            
            
               // console.log("location type in dunzo", location);
                // await page.keyboard.up('Enter');
                // await delay(1000);//// not use
                // await page.waitForNavigation({ waitUntil: ["networkidle2"] });  
                await page.waitForNetworkIdle({ waitUntil: 'networkidle0' });
                await page.waitForSelector('#expandable-view > div > div.sc-AxjAm.StDqM.sc-4bil4e-1.cKnqnJ > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-1w2vjuw-1.gnVSnQ > div.sc-AxjAm.StDqM.sc-5mb6ac-0.gFfvoJ > div:nth-child(2) > div > p.sc-AxhCb.bHCIYd.sc-eejohd-2.hpEsVV')
                await page.$eval(
                    "#expandable-view > div > div.sc-AxjAm.StDqM.sc-4bil4e-1.cKnqnJ > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-1w2vjuw-1.gnVSnQ > div.sc-AxjAm.StDqM.sc-5mb6ac-0.gFfvoJ > div:nth-child(2) > div > p.sc-AxhCb.bHCIYd.sc-eejohd-2.hpEsVV",
                    (form) => form.click()
                );
               // console.log("#expandable.click in dunzo");
                await page.$eval(
                   "#header > div > div > div > div.sc-AxjAm.rvwoc.sc-AxirZ.ktnnZL > a:nth-child(1)",
                    (form) => form.click()
                );
                //  await delay(500);// not in use
                //  await page.waitForNavigation({ waitUntil: ["domcontentloaded","load","networkidle0","networkidle2"] });
                await page.keyboard.type(product, { delay: 100 }); //enterusername
                await page.keyboard.down("Enter");
               // console.log("Product then enter in dunzo", product);
            
                //    await delay(2000);// not use
            
                await page.waitForNetworkIdle({ waitUntil: 'domcontentloaded' });
    
                let i=0
            
                await page.evaluate(() => {
                    const interval=setInterval(() => {
                        i++
                        if(i>=1){
                            clearInterval(interval);
                        }
                        document
                            .querySelector(
                                "#__next > div:nth-child(2) > div.sc-AxjAm.StDqM.sc-1igvtxh-0.ivSqwW > div.sc-AxjAm.StDqM.sc-1dpeypg-4.hUkimG"
                            )
                            .scrollIntoView({
                                behavior: "smooth",
                                block: "end",
                                inline: "nearest",
                            });
                    }, 300);
                });
            
                await delay(1000);
                const content = await page.evaluate(() => document.body.innerHTML);
                const $ = cheerio.load(content);
            
                let cardItem = $("body").find(".flPtHx").map((index, item) => {
                    let cardObj = {
                        image: $(item).find('.kReyZW img').attr('src'),
            
                        name: $(item).find('.hEGVgv').text(),
                        price: $(item).find('.lmawen').text(),
                        actualPrice: $(item).find('.jYqBin').text(),
                        quantity: $(item).find('.dvfcir').text(),
                    };
            
                    return cardObj
                }).get();
                //console.log('dunzo')
                dunzoRes.push(cardItem);
            
            
            
    
            }else{
    
                //instamart
    
                await page.setUserAgent(
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36"
                );
        
                //set device to iPhone X
                const m = puppeteer.devices['iPhone X']
                //emulate iPhoneX
                await page.emulate(m)
                //launch URL
        
        
                await page.goto(BASE_URL3, { waitUntil: ["networkidle0", "load"] });
               // const version = await browser.version();
                //console.log(version);
        
        
                await page.waitForSelector("#root > div > div.HZWFn > button")
        
               // console.log('====================================');
                //console.log("selector found before location click");
                //console.log('====================================');
        
                await page.$eval("#root > div > div.HZWFn > button", (form) =>
                    form.click()
                );
        
                //console.log('====================================');
                //console.log("click location");
                //console.log('====================================');
        
        
                // await delay(1200);
        
                //  await page3.waitForNetworkIdle({ waitUntil: ["networkidle2"] });
                await delay(500)
                await page.keyboard.type(location, { delay: 25 });
                //console.log('====================================');
                //console.log("instalocation", location);
                //console.log('====================================');
        
        
                await page.waitForNetworkIdle({ waitUntil: ["networkidle0"] });
                await page.waitForSelector("#root > div > div._3lldG > div._3mMtt > div > div > button:nth-child(1) > span > span._3qV1m > span._1kMGJ")
        
        
                await page.$eval(
                    "#root > div > div._3lldG > div._3mMtt > div > div > button:nth-child(1) > span > span._3qV1m > span._1kMGJ",
                    (form) => form.click()
                );
        
        
               // console.log('====================================');
                //console.log("insta location after click");
                //console.log('====================================');
        
        
                await page.waitForSelector("#root > div > div > div._3UNR_._2_95H.bottomOffsetPadBottom > div > div:nth-child(2) > div > div._3AA61._3spHt > div._2lb18 > button > div > span._3BVHa")
        
                await page.$eval(
        
                    "#root > div > div > div._3UNR_._2_95H.bottomOffsetPadBottom > div > div:nth-child(2) > div > div._3AA61._3spHt > div._2lb18 > button > div > span._3BVHa",
                    (form) => form.click()
                );
        
        
              //  console.log('====================================');
               // console.log("chec --- dom click");
                //console.log('====================================');
        
        
                await page.$eval(
                    "#root > div > div > div._3Gv9D.statusBarPadTop._22AL6 > div > form > div > input",
                    (form) => form.focus()
                );
               // console.log("click after focus");
        
        
        
        
                await page.keyboard.type(product, { delay: 25 });
                //console.log('====================================');
                //console.log("type product");
                //console.log('====================================');
                await page.keyboard.press("Enter");
        
                //console.log("product enter");
        
              
        
        
                await page.evaluate(() => {
                    setInterval(() => {
                        document
                            .querySelector(
                                "#root > div > div > div._3UNR_._2_95H.bottomOffsetPadBottom > div._3ZzU7"
                            )
                            .scrollIntoView({
                                behavior: "smooth",
                                block: "end",
                                inline: "end",
                            });
                    }, 400);
                });
        
                await page.waitForSelector("[data-testid=default_container]")
        
                //   await page3.waitForNetworkIdle({ waitUntil: ["networkidle0"] });
        
                await delay(700)
        
        
        
                const content = await page.evaluate(() => document.body.innerHTML);
                const $ = cheerio.load(content);
        
                let cardObj = [];
                let cardItem = $("body").find("[data-testid=default_container]").map((index, item) => {
                    // console.log($(item).find("._1q0n_").css('background-image'))
        
        
                    let cardObj = {
                        image: $(item).find('[data-testid=item-image]').css('background-image'),
        
                        name: $(item).find('._2tYvP').text(),
                        price: $(item).find('[data-testid=itemOfferPrice]').text(),
                        actualPrice: $(item).find('[data-testid=itemMRPPrice]').text(),
                        quantity: $(item).find('._3p_wY').text(),
                    };
        
                    return cardObj
                }).get();
        
                //console.log('instamart')
                instaRes.push(cardItem);
    
    
            }
    
            
        })
    
    

        if(brand===""){
             //blinkit
        cluster.queue({url:BASE_URL,product,location})
    
        //dunzo
        cluster.queue({url:BASE_URL2,product,location})
    
    
        //instamart
        cluster.queue({url:BASE_URL3,product,location})
        }else if(brand==="blink"){
            cluster.queue({url:BASE_URL,product,location})
        }else if(brand==="dunzo"){
             //dunzo
        cluster.queue({url:BASE_URL2,product,location})
        }else{
               //instamart
            cluster.queue({url:BASE_URL3,product,location})
        }
       
    
    
        await cluster.idle()
        await cluster.close();
    
        console.log("result below")
        console.log(instaRes.length)
        console.log(blinkRes.length)
        console.log(dunzoRes.length)
    
        return {
            blinkData:blinkRes[0],
            instaData:instaRes[0],
            dunzoData:dunzoRes[0]
        }
    }
    
    
    
    

    
    
    app.get("/getData",async(req,res)=>{


        const data=await getData(req.query.product,req.query.location,"");
    
        res.status(200).send({
            "data":data
        });       
    
    
    })


    app.get("/getBlink",async(req,res)=>{


        const data=await getData(req.query.product,req.query.location,"blink");
    
        res.status(200).send({
            "data":data
        });       
    
    
    })

    app.get("/getDunzo",async(req,res)=>{


        const data=await getData(req.query.product,req.query.location,"dunzo");
    
        res.status(200).send({
            "data":data
        });       
    
    
    })


    app.get("/getInsta",async(req,res)=>{


        const data=await getData(req.query.product,req.query.location,"insta");
    
        res.status(200).send({
            "data":data
        });       
    
    
    })







app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

