const puppeteer = require("puppeteer");
const cheerio = require('cheerio');
const express = require("express");
const cors = require('cors')
const app = express();
const port = 3000;
const BASE_URL = "https://blinkit.com/";
const BASE_URL2 = "https://www.dunzo.com/order";
const BASE_URL3 = 'https://www.swiggy.com/instamart/';


app.use(cors())
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


    const getData=async (product,location,brand)=>{

        const browser=await puppeteer.connect({
            browserURL:'http://localhost:7000',
            defaultViewport:null,
            headless:true,
        });

        
      
        let blinkRes=[]
        let dunzoRes=[]
        let instaRes=[]
    
    
    
    
       //--------------------------------------------------
       //BLINKIT
       //-------------------------------------------------
        const blink=async (browser,product,location)=>{
            
            const page=await browser.newPage();

            
               
    
            try{


                await page.setUserAgent(
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36"
                );
            
                    
                await page.goto(BASE_URL);
               

                await delay(1000);

                //checking if blinkit already has location
                
                //location not set; typing location
                if(await page.$("#app > div > div > div.containers__HeaderContainer-sc-1t9i1pe-0.UjObT > header > div.LocationDropDown__LocationModalContainer-sc-bx29pc-0.csVggh > div.location__shake-container.animated > div > div > div > div:nth-child(2) > button.btn.btn--inverted.location-tooltip-button")){
                        
                   
           
                    await page.$eval(
                
                        "#app > div > div > div.containers__HeaderContainer-sc-1t9i1pe-0.UjObT > header > div.LocationDropDown__LocationModalContainer-sc-bx29pc-0.csVggh > div.location__shake-container.animated > div > div > div > div:nth-child(2) > button.btn.btn--inverted.location-tooltip-button",
                        (form) => form.click()
                    );
        
                    
                    
            
            //location already set, changing it
            }else{

                console.log("location already set...changing location");
                await page.waitForSelector("#app > div > div > div.containers__HeaderContainer-sc-1t9i1pe-0.UjObT > header > div.Header__HeaderLeft-sc-hejxrh-2.gUZOTl > div > div")
                    
                
                await page.$eval("#app > div > div > div.containers__HeaderContainer-sc-1t9i1pe-0.UjObT > header > div.Header__HeaderLeft-sc-hejxrh-2.gUZOTl > div > div",(div)=>div.click())
            
            }
        

            await page.keyboard.type(location, { delay: 200 })
                
                    

            //selecting location provided by the user from the given locations
            const locationSelectionDiv=await page.$("div.Select-menu-outer")
            const elements = await locationSelectionDiv.$$("div");
            for (let element of elements) {
              const text = await element.evaluate(node => node.textContent);
              console.log(text);
              if (Math.abs(text.length-location.length)<=3) {
                    console.log("found exact match...clicking on location")
                    await element.click();
                    break;
                }
            }

            //await page.keyboard.down("Enter");

            await delay(1000);


            //if blinkit doesn't delivers to the above selected location

            const notServicable=await page.$("div.non-serviceable-step");
            if(notServicable){
                console.log("blinkit does not deliver to this address!!");
                return;
            }

            //if blinkit does deliver to the user provided location
            await page.goto(BASE_URL+`s/?q=${product}`);

            // await page.$eval(
        
            //     "#app > div > div > div.containers__HeaderContainer-sc-1t9i1pe-0.UjObT > header > div.SearchBar__Container-sc-16lps2d-3.ZIGuc > a",
            //     (form) => form.click()
            // );
        
        
          
        
            // await delay(500)
        
            // await page.keyboard.type(product, { delay: 10 });
        
        
            // await page.keyboard.down("Enter");
        
        
        
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
        
        
            await delay(2000);
        
        
            const content = await page.evaluate(() => document.body.innerHTML);
            const $ = cheerio.load(content);

           
            //document.querySelector("#app > div > div > div:nth-child(3) > div > div > div.categories > div.categories__body > div > div > div > div.SearchMobile__SearchResultsContainer-sc-1teq3rv-4.cchVME > div.ProductsContainer__SearchProductsListContainer-sc-1k8vkvc-1.kLNZTj > a:nth-child(1)")
            let cardItem = $("body").find("div > a").map((index, item) => {
                let cardObj = {
                    image: $(item).find('img').attr('src'),
                    name: $(item).find('div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div').text() ? $(item).find('div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div').text() : $(item).find('div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div').text() ,
                    price: $(item).find(`div > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1)`).text() ? $(item).find(`div > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1)`).text() : $(item).find(`div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1)`).text(),
                    actualPrice: $(item).find(`div > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2)`).text() ? `div > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2)` : `div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2)` ,
                    quantity: $(item).find('.plp-product__quantity--box').text(),
                };
                return cardObj
            }).get();
        
            //console.log('blinkit')
            blinkRes.push(cardItem)

     
    

            }catch(err){
                console.log("error while fetching from blinkit");
                console.log(err);
             
            }finally{
                await page.close();
            }
                
    
            }


             //--------------------------------------------------
            //DUNZO
            //-------------------------------------------------

            const dunzo=async(browser,product,location)=>{
                    //dunzo
             const page=await browser.newPage();


             try{



                await page.setUserAgent(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
                );
            
            
                await page.goto(BASE_URL2 , { waitUntil: ["domcontentloaded", "networkidle2"] });
            
    
    
        await page.evaluate(() => {
            document.body.style.zoom = "30%";
        });
            


        //checking if dunzo alread has location set

        //location is not set; typing location
        if(await page.$("#header > div > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-jqmf1i-5.bidAne > div > div.sc-AxjAm.StDqM.sc-17nyegg-2.sc-1fdjem6-0.gdWmLN > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-17nyegg-8.gSPnff > p")!==null){
            await page.$eval(
                "#header > div > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-jqmf1i-5.bidAne > div > div.sc-AxjAm.StDqM.sc-17nyegg-2.sc-1fdjem6-0.gdWmLN > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-17nyegg-8.gSPnff > p",
                (form) => form.click()
            );
          
            await delay(300)

            await page.keyboard.type(location, { delay: 200 });
            

        //location already present
        }else{

            await page.waitForSelector("#header > div > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-jqmf1i-5.bidAne > div > div > p")
            await page.$eval(
               "#header > div > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-jqmf1i-5.bidAne > div > div > p",
                (form) => form.click()
            );
            // await delay(1000);//// not in use
            await delay(200)

            await page.keyboard.type(location, { delay: 100 }); 
        }



                await page.waitForSelector('#expandable-view > div > div.sc-AxjAm.StDqM.sc-4bil4e-1.cKnqnJ > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-1w2vjuw-1.gnVSnQ > div.sc-AxjAm.StDqM.sc-5mb6ac-0.gFfvoJ > div:nth-child(2) > div')
                
                await page.$eval(
                   "#expandable-view > div > div.sc-AxjAm.StDqM.sc-4bil4e-1.cKnqnJ > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-1w2vjuw-1.gnVSnQ > div.sc-AxjAm.StDqM.sc-5mb6ac-0.gFfvoJ > div:nth-child(2)",
                    (div) => div.click()
               );

               await delay(2000);
    
               //dunzo does not deliver to the user given location
               if(await page.$("#expandable-view > div > div.sc-AxjAm.StDqM.sc-4bil4e-1.cKnqnJ > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-1w2vjuw-1.gnVSnQ > div > img")){
                console.log("service not available on the location");
                return;
               };


               
                    

               await page.$eval(
                   "#header > div > div > div > div.sc-AxjAm.rvwoc.sc-AxirZ.ktnnZL > a:nth-child(1) > div",
                   (form) => form.click()
               );

               

    
                await page.keyboard.type(product, { delay: 100 }); 
                await page.keyboard.down("Enter");
    
                await page.waitForNetworkIdle({waitUntil:["networkidle0","domcontent","load","networkidle2"]})
               
        await delay(1000)
                const content = await page.evaluate(() => document.body.innerHTML);
                const $ = cheerio.load(content);
                
            
                // let cardItem = $("body").find("#__next > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div:nth-child(odd)").map((index, item) => {
                //     let card=$(item).find("div.slick-track > div  ").map((index,card)=>{

                //         let cardObj = {
                //             image: $(card).find('div > div  > a > div > div:nth-child(1) > img').attr('src'),
                //             name: $(card).find('div > div >  a > div > div:nth-child(2) > div:nth-child(1) > p ').text(),
                //             price: $(card).find('div > div >a > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > p').text(),
                //             actualPrice: $(card).find('div > div > a > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > p').text(),
                //             quantity: $(card).find('div > div > a > div > div:nth-child(2) > div:nth-child(2) > button > span').text(),
                //         };
                //         return cardObj
                //     }).get(); 
                //     dunzoRes.push(card);
                // }).get();
                

                
                // dunzoRes = dunzoRes.reduce((accumulator, currentArray) => {
                //     return [...accumulator, ...currentArray];
                //   }, []);
               
                //   console.log(dunzoRes);

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
               
              dunzoRes.push(cardItem);   
                        

             }catch(err){
                console.log("an error while fetching from dunzo");
                console.log(err);
             }finally{
                await page.close();
             }
                
              
            


            }
    

             //--------------------------------------------------
            //INSTAMART
            //-------------------------------------------------
            const insta=async(browser,product,location)=>{

                 //instamart

                 const page=await browser.newPage();
                

                 try{



                    await page.setUserAgent(
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36"
                    );
            
                    //set device to iPhone X
                    const m = puppeteer.devices['Moto G4']
                    //emulate iPhoneX
                    await page.emulate(m)
             
            
            
                    await page.goto(BASE_URL3, { waitUntil: ["networkidle0", "load"] });
                  
    

                    //checking if location already set in instamart

                    //location not set, setting location
                    if(await page.$("#root > div > div.HZWFn > button")){

                       // await page.waitForSelector("#root > div > div.HZWFn > button")
    
                 
                         await page.$eval("#root > div > div.HZWFn > button", (form) =>
                             form.click()
                         );
            
                         await delay(500)
                         await page.keyboard.type(location, { delay: 25 });

                         await page.waitForSelector("#root > div > div._3lldG > div._3mMtt > div > div > button:nth-child(1) > span > span._3qV1m > span._1kMGJ")
    
                        
                        await page.$eval(
                            "#root > div > div._3lldG > div._3mMtt > div > div > button:nth-child(1) > span > span._3qV1m > span._1kMGJ",
                            (form) => form.click()
                        );
                        await page.waitForSelector("#root > div > div > div._3UNR_._2_95H.bottomOffsetPadBottom > div > div:nth-child(2) > div > div._3AA61._3spHt > div._2lb18 > button > div > span._3BVHa")
                
                        await page.$eval(
                
                            "#root > div > div > div._3UNR_._2_95H.bottomOffsetPadBottom > div > div:nth-child(2) > div > div._3AA61._3spHt > div._2lb18 > button > div > span._3BVHa",
                            (form) => form.click()
                        );
                    }else{

                        //changing location on swiggy
                        await page.goto("https://www.swiggy.com/search-location");


                        //input to type location
                        await page.waitForSelector("#root > div > div._3lldG > div._2u0oK._1iY8Y > div > div._1leRb > label > input");
                        await page.$eval("#root > div > div._3lldG > div._2u0oK._1iY8Y > div > div._1leRb > label > input",(input)=>input.click());

                        //type location

                        await page.keyboard.type(location,{delay:50});

                        await page.waitForSelector("#root > div > div._3lldG > div._3mMtt > div > div > button:nth-child(1)");
                        await page.$eval("#root > div > div._3lldG > div._3mMtt > div > div > button:nth-child(1)",(button)=>button.click());
                    }
                        
                   
            
                 
    
                   await page.goto(`https://www.swiggy.com/instamart/search?custom_back=true&query=${product}`);
            
                  
                        let i=0;
            
                    await page.evaluate(() => {
                      const interval=  setInterval(() => {
                        if(i>1){
                            clearInterval(interval)
                        }
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
            
                    await page.waitForSelector("#root > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div ")
            
                    await delay(700)
            
            
            
                    const content = await page.evaluate(() => document.body.innerHTML);
                    const $ = cheerio.load(content);
            
                    let cardItem = $("body").find("#root > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div ").map((index, item) => {
                        let cardObj = {
                            image: $(item).find('[data-testid=item-image]').css('background-image'),
                            name: $(item).find("[data-testid=item-brand-title]").text()+ " " + $(item).find('[data-testid=item-display-title]').text(),
                            price: $(item).find('[data-testid=itemOfferPrice]').text(),
                            actualPrice: $(item).find('[data-testid=itemMRPPrice]').text(),
                            quantity: $(item).find('[data-testid=item-quantity]').text(),
                        };
            
                        return cardObj
                    }).get();
            
                    //console.log('instamart')
                    instaRes.push(cardItem);

                 }catch(err){
                    console.log("an error while fetching from instamart");
                    console.log(err)
                 }finally{
                    await page.close();
                 }
    
               


            }
                

    
    
        if(brand==='blink'){

            try{    
                await blink(browser,product,location);
            }catch(err){
                console.log("an error occured in blink");
                console.log(err)
            }
           
        }else if(brand==='dunzo'){
            
            try{    
                await dunzo(browser,product,location);
            }catch(err){
                console.log("an error occured in dunzo");
                console.log(err)
            }
           
        }else{
                
            try{    
                await insta(browser,product,location)
            }catch(err){
                console.log("an error occured in insta");
                console.log(err)
            }

            
           
        }
        console.log("result below")
        console.log(instaRes.length)
        console.log(blinkRes.length)
        console.log(dunzoRes.length)



         browser.disconnect();
       
    
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







/*


app.get("/blink", async (req, res, start) => {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: executablePath(),
        ignoreHTTPSErrors: true,
        timeout: 600000,

        args: [
            "--window-size=700,1200",
            //   "--window-size=1920,1040",
            //   "--window-size=900,600", //'--proxy-server=14.97.2.107:80',
            "--remote-debugging-port=9222",
            "--remote-debugging-address=0.0.0.0", // You know what your doing?
            "--disable-gpu",
            "--disable-features=IsolateOrigins,site-per-process",
            "--blink-settings=imagesEnabled=true",
            //   "--no-sandbox",
            //   "--disable-setuid-sandbox",
            //   "--ignore-certificate-errors",
            // '--start-fullscreen'
        ],
        //   executablePath: "/usr/bin/google-chrome-stable",
        // executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',  
        defaultViewport: null,
    });

    // const page1 = await browser.newPage();
    const page2 = await browser.newPage();
    // const page3 = await browser.newPage();

    // await page1.setUserAgent(
    //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
    // );
    await page2.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36"
    );
    // await page3.setUserAgent(
    //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
    // );
    // const m = puppeteer.devices["iPhone X"];
    // await page3.emulate(m);

    await page2.goto(BASE_URL, { waitUntil: ["networkidle2", "domcontentloaded", "load"] });


    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    //   await page2.waitForNetworkIdle({ waitUntil: 'networkidle0' });

    // await page2.waitForSelector('#react-select-2--value > div.Select-placeholder')


    //     await page2.$eval(
    //         "#react-select-4--value > div.Select-placeholder",
    //         (form) => form.focus()
    //       );
    // await delay(100);

    await page2.$eval(

        "#app > div > div > div.containers__HeaderContainer-sc-1t9i1pe-0.UjObT > header > div.LocationDropDown__LocationModalContainer-sc-bx29pc-0.csVggh > div.location__shake-container.animated > div > div > div > div:nth-child(2) > button.btn.btn--inverted.location-tooltip-button",
        (form) => form.click()
    );
    let location = req.query.location;
    await page2.keyboard.type(location, { delay: 300 });
    console.log("location in blinkIt", location);

    //  await delay(100);

    //  await page2.waitForNetworkIdle({ waitUntil: 'networkidle0' });

    console.log("network 0");

    await page2.keyboard.press("Enter");

    // await delay(500);

    //  await delay(2000);////

    console.log("blink location enter");

    await page2.$eval(

        "#app > div > div > div.containers__HeaderContainer-sc-1t9i1pe-0.UjObT > header > div.SearchBar__Container-sc-16lps2d-3.ZIGuc > a",
        (form) => form.click()
    );

    let product = req.query.product;

    ///  await delay(1000);////

    await delay(1000)

    await page2.keyboard.type(product, { delay: 10 });


    await page2.keyboard.down("Enter");
    console.log("blinkIt product", product);



    await page2.evaluate(() => {
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


    // await page2.waitForNetworkIdle({ waitUntil: ["domcontentloaded"] });

    // await page2.waitForNetworkIdle({ waitUntil: 'networkidle0' });
    await delay(3000);


    const content = await page2.evaluate(() => document.body.innerHTML);
    const $ = cheerio.load(content);

    let cardObj = [];
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

    console.log('blinkit')
    console.log(cardItem)
    res.send({ status: true, brandName: "BlinkIt", data: cardItem });
    browser.on('disconnected', () => {
        console.log('Browser is closed');
    });

    await browser.close();
    start();
});


app.get('/dunzo', async (req, res) => {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: executablePath(),
        ignoreHTTPSErrors: true,
        timeout: 600000,

        // slowMo: 0,
        args: [
            //   "--window-size=1920,1040",
            '--incognito',
            "--window-size=900,900", //'--proxy-server=14.97.2.107:80',
            "--remote-debugging-port=9222",
            "--remote-debugging-address=0.0.0.0", // You know what your doing?
            "--disable-gpu",
            "--disable-features=IsolateOrigins,site-per-process",
            "--blink-settings=imagesEnabled=true",

            //   "--no-sandbox",
            //   "--disable-setuid-sandbox",
            //   "--ignore-certificate-errors",

            // '--start-fullscreen'
        ],
        // executablePath: "/usr/bin/google-chrome-stable",
        defaultViewport: null,
    });

    console.log("launch dunzo");
    const page1 = (await browser.pages())[0];

    await page1.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
    );


    await page1.goto(BASE_URL2, { waitUntil: ["domcontentloaded", "networkidle2"] });
    console.log("linkHit dunzo");
    const version = await browser.version();
    console.log(version);


    await page1.$eval(
        "#header > div > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-jqmf1i-5.bidAne > div > div.sc-AxjAm.StDqM.sc-17nyegg-2.sc-1fdjem6-0.gdWmLN > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-17nyegg-8.gSPnff > p",
        (form) => form.click()
    );
    // await delay(1000);//// not in use
    await delay(300)

    let location = req.query.location;
    await page1.keyboard.type(location, { delay: 50 }); //enterusername


    console.log("location type in dunzo", location);
    // await page.keyboard.up('Enter');
    // await delay(1000);//// not use
    // await page1.waitForNavigation({ waitUntil: ["networkidle2"] });  
    await page1.waitForNetworkIdle({ waitUntil: 'networkidle0' });
    await page1.waitForSelector('#expandable-view > div > div.sc-AxjAm.StDqM.sc-4bil4e-1.cKnqnJ > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-1w2vjuw-1.gnVSnQ > div.sc-AxjAm.StDqM.sc-5mb6ac-0.gFfvoJ > div:nth-child(2) > div > p.sc-AxhCb.bHCIYd.sc-eejohd-2.hpEsVV')
    await page1.$eval(
        "#expandable-view > div > div.sc-AxjAm.StDqM.sc-4bil4e-1.cKnqnJ > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-1w2vjuw-1.gnVSnQ > div.sc-AxjAm.StDqM.sc-5mb6ac-0.gFfvoJ > div:nth-child(2) > div > p.sc-AxhCb.bHCIYd.sc-eejohd-2.hpEsVV",
        (form) => form.click()
    );
    console.log("#expandable.click in dunzo");
    await page1.$eval(
        "#header > div > div > div > div.sc-AxjAm.rvwoc.sc-AxirZ.ktnnZL > a:nth-child(1)",
        (form) => form.click()
    );
    //  await delay(500);// not in use
    //  await page1.waitForNavigation({ waitUntil: ["domcontentloaded","load","networkidle0","networkidle2"] });
    let product = req.query.product;
    await page1.keyboard.type(product, { delay: 100 }); //enterusername
    await page1.keyboard.down("Enter");
    console.log("Product then enter in dunzo", product);

    //    await delay(2000);// not use

    await page1.waitForNetworkIdle({ waitUntil: 'domcontentloaded' });

    await page1.evaluate(() => {
        setInterval(() => {
            document
                .querySelector(
                    "#__next > div:nth-child(2) > div.sc-AxjAm.StDqM.sc-1igvtxh-0.ivSqwW > div.sc-AxjAm.StDqM.sc-1dpeypg-4.hUkimG"
                )
                .scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                    inline: "nearest",
                });
        }, 400);
    });

    await delay(1000);
    const content = await page1.evaluate(() => document.body.innerHTML);
    const $ = cheerio.load(content);

    let cardObj = [];
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
    console.log('dunzo')
    console.log(cardItem)




    res.send({ status: true, brandName: "Dunzo", data: cardItem });


    browser.on('disconnected', () => {
        console.log('Browser is closed');
    });

    await browser.close();


})


app.get('/instamart', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            ignoreHTTPSErrors: true,
            timeout: 600000,

        });


        //browser new page
        const page3 = (await browser.pages())[0];

        await page3.setUserAgent(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36"
        );

        //set device to iPhone X
        const m = puppeteer.devices['iPhone X']
        //emulate iPhoneX
        await page3.emulate(m)
        //launch URL


        await page3.goto(BASE_URL3, { waitUntil: ["networkidle0", "load"] });
        const version = await browser.version();
        console.log(version);


        await page3.waitForSelector("#root > div > div.HZWFn > button")

        console.log('====================================');
        console.log("selector found before location click");
        console.log('====================================');

        await page3.$eval("#root > div > div.HZWFn > button", (form) =>
            form.click()
        );

        console.log('====================================');
        console.log("click location");
        console.log('====================================');


        // await delay(1200);

        //  await page3.waitForNetworkIdle({ waitUntil: ["networkidle2"] });
        await delay(1000)
        let location = req.query.location;
        await page3.keyboard.type(location, { delay: 50 });
        console.log('====================================');
        console.log("instalocation", location);
        console.log('====================================');
        ///        //   await delay(3000);////


        await page3.waitForNetworkIdle({ waitUntil: ["networkidle0"] });
        await page3.waitForSelector("#root > div > div._3lldG > div._3mMtt > div > div > button:nth-child(1) > span > span._3qV1m > span._1kMGJ")


        await page3.$eval(
            "#root > div > div._3lldG > div._3mMtt > div > div > button:nth-child(1) > span > span._3qV1m > span._1kMGJ",
            (form) => form.click()
        );


        console.log('====================================');
        console.log("insta location after click");
        console.log('====================================');

        //  await delay(3000);/////
        // await page3.waitForNetworkIdle({ waitUntil: ["domcontentloaded"] });

        //   await page.keyboard.type("delhi", {delay: 100});

        await page3.waitForSelector("#root > div > div > div._3UNR_._2_95H.bottomOffsetPadBottom > div > div:nth-child(2) > div > div._3AA61._3spHt > div._2lb18 > button > div > span._3BVHa")

        await page3.$eval(

            "#root > div > div > div._3UNR_._2_95H.bottomOffsetPadBottom > div > div:nth-child(2) > div > div._3AA61._3spHt > div._2lb18 > button > div > span._3BVHa",
            (form) => form.click()
        );


        console.log('====================================');
        console.log("chec --- dom click");
        console.log('====================================');

        // await delay(4000);//////

        await page3.$eval(
            "#root > div > div > div._3Gv9D.statusBarPadTop._22AL6 > div > form > div > input",
            (form) => form.focus()
        );
        console.log("click after focus");



        //     await delay(1000);//
        let product = req.query.product;

        await page3.keyboard.type(product, { delay: 50 });
        console.log('====================================');
        console.log("type product");
        console.log('====================================');
        await page3.keyboard.press("Enter");

        //await delay(800);//
        console.log("product enter");

        // await delay(1000)


        await page3.evaluate(() => {
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

        await page3.waitForSelector("[data-testid=default_container]")

        //   await page3.waitForNetworkIdle({ waitUntil: ["networkidle0"] });

        await delay(1500)



        const content = await page3.evaluate(() => document.body.innerHTML);
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

        console.log('instamart')
        console.log(cardItem)
        res.send({ status: true, brandName: "instamart", data: cardItem });
        // }





        browser.on('disconnected', () => {
            console.log('Browser is closed');
        });
        await browser.close();




    } catch (error) {
        console.log(error);

    }
})

*/
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

