const puppeteer = require("puppeteer");
const { executablePath } = require("puppeteer");
const express = require("express");
const cors = require('cors')
const app = express();
const port = 3000;
const BASE_URL = "https://blinkit.com/";
const BASE_URL2 = "https://www.dunzo.com/delhi";
const BASE_URL3 = 'https://www.swiggy.com/instamart';

// fuse.js
const fuse = require('fuse.js');
app.use(cors())
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
app.get("/blink", async (req, res, start) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
    ignoreHTTPSErrors: true,
    timeout: 600000,

    // userDataDir: '/path/to/user/data/dir',
    // slowMo: 0,
    args: [
      // "--window-size=700,1200",
      // "--window-size=1920,1040",
      "--window-size=900,600", //'--proxy-server=14.97.2.107:80',
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

  //  await page2.waitForNetworkIdle({ waitUntil: ["domcontentloaded","networkidle0"] });

  //  await page2.waitForSelector('#app > div > div > div.containers__HeaderContainer-sc-1t9i1pe-0.UjObT > header > div.SearchBar__Container-sc-16lps2d-3.ZIGuc > a')

  // await page2.waitForSelector('#app > div > div > div.containers__HeaderContainer-sc-1t9i1pe-0.UjObT > header > div.SearchBar__Container-sc-16lps2d-3.ZIGuc > a')

  await page2.$eval(

    "#app > div > div > div.containers__HeaderContainer-sc-1t9i1pe-0.UjObT > header > div.SearchBar__Container-sc-16lps2d-3.ZIGuc > a",
    (form) => form.click()
  );

  let product = req.query.product;

  ///  await delay(1000);////

  await delay(300)

  await page2.keyboard.type(product, { delay: 10 });


  await page2.keyboard.down("Enter");
  console.log("blinkIt product", product);

  //////    await delay(1000);////
  // await page2.waitForNetworkIdle({ waitUntil: 'networkidle0' });

  // await delay(3000);

  //         await page2.keyboard.press("down");
  // console.log('====================================');
  // console.log("page down blink");
  // console.log('====================================');
  //         await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 1s
  //         await page2.keyboard.press("down");
  // await page2.keyboard.press("down");

  // scroll the page down by 500 pixels
  // await page2.evaluate(() => {
  //   window.scrollBy(0, 800);
  // });

  await page2.evaluate(() => {
    setInterval(() => {
      document
        .querySelector(
          "#app > div > div > div:nth-child(5) > div > div.SearchMobile__SearchResultContainer-sc-1teq3rv-20.hYZTia > div.SearchMobile__SearchResultsContainer-sc-1teq3rv-4.cchVME > div.ProductsContainer__SearchProductsListContainer-sc-1k8vkvc-1.kLNZTj"
        )
        .scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "end",
        });
    }, 500);
  });


  // await page2.waitForNetworkIdle({ waitUntil: ["domcontentloaded"] });

  // await page2.waitForNetworkIdle({ waitUntil: 'networkidle0' });
  await delay(2000);

  // const image = await page2.$$eval(".gagoLZ img", (date) => {
  //   return date.map((x) => x.getAttribute("src"));
  // });

  // console.log("BLINK", image);

  // const name = await page2.$$eval(
  //   ".fxBwnM",
  //   (date) => {
  //     // return date.map((x) => [x.textContent.trim()]);
  //     return date.map((x) => x.textContent.trim());
  //   }
  // );
  // console.log("BLINK", name);
  // const len = await page2.$$eval(
  //   "plp-product",
  //   (date) => {
  //     // return date.map((x) => [x.textContent.trim()]);
  //     return date.map((x) => x.textContent.trim());
  //   }
  // );
  // console.log("len", len, len.length);

  // const len = await page2.evaluate(() => document.querySelectorAll('.plp-product').length);
  // // const len = await page2.evaluate(() => document.querySelectorAll("#app > div > div > div > div > div > div.categories--with-search > div.categories__body > div > div > div > div.SearchMobile__SearchResultsContainer-sc-1teq3rv-4.cchVME > div.ProductsContainer__SearchProductsListContainer-sc-1k8vkvc-1.kLNZTj a").forEach((item) => { console.log(item) }));
  // console.log(len, "uuihhj")
  // for (let j = 0; j <= len; j++) {
  //   let image;
  //   let name;
  //   let price;
  //   let crossPrice;
  //   let weight;
  //   console.log(i);
  //   await page2.evaluate(() => document.querySelectorAll('.plp-product')[j].children[1].children[0].children[0].getAttribute("src")).then((d) => {
  //     image = d;
  //     // console.log(image);
  //   }).catch((err) => {
  //     console.log(err)
  //   })
  //   await page2.evaluate(() => document.querySelectorAll('.plp-product')[j].children[3].children[0].textContent).then((d) => {
  //     name = d;
  //     // console.log(name);
  //   }).catch((err) => {
  //     console.log(err)
  //   })


  //   await page2.evaluate(() => document.querySelectorAll('.plp-product')[j].children[3].children[2].children[0].children[0].textContent).then((d) => {
  //     price = d;
  //     // console.log(price);
  //   }).catch((err) => {
  //     console.log(err)
  //   })
  //   await page2.evaluate(() => document.querySelectorAll('.plp-product')[j].children[3].children[2].children[0].children[1].textContent).then((d) => {
  //     crossPrice = d;
  //     // console.log(crossPrice);
  //   }).catch((err) => {
  //     console.log(err)
  //   })



  //   await page2.evaluate(() => document.querySelectorAll('.plp-product')[j].children[3].children[1].textContent).then((d) => {
  //     weight = d;
  //     // console.log(weight);
  //   }).catch((err) => {
  //     console.log(err)
  //   })
  //   blinkData.push({ image, name, price, crossPrice, weight })
  // }
  // await delay(5000);
  // const container = await page2.document.querySelectorAll(
  //   "#app > div > div > div > div > div > div.categories--with-search > div.categories__body > div > div > div > div.SearchMobile__SearchResultsContainer - sc - 1teq3rv - 4.cchVME > div.ProductsContainer__SearchProductsListContainer - sc - 1k8vkvc - 1.kLNZTj > a"
  // )
  // const container = await page2.querySelectorAll(
  //   "plp-product"
  // )
  // console.log(container.length, "lellelsldfsfskjf");

  // for (let  = 0;  < array.length; ++) {
  //   const element = array[];
  // }

  // const priceCross = await page2.$$eval(
  //   "#app > div > div > div > div > div > div.categories > div.categories__body > div > div > div > div.SearchMobile__SearchResultsContainer-sc-1teq3rv-4.cchVME > div.ProductsContainer__SearchProductsListContainer-sc-1k8vkvc-1.kLNZTj > a > div > div.Product__DetailContainer-sc-11dk8zk-5.gqXiXY > div.Product__PriceAtcContainer-sc-11dk8zk-3.kOHvUg > div.ProductPrice__PriceContainer-sc-14194u2-0.iKlIZr > div.ProductPrice__Mrp-sc-14194u2-2.GDvg",
  //   (date) => {
  //     return date.map((x) => x.textContent);
  //   }
  // );

  // console.log("BLINK", priceCross);


  // document.querySelectorAll(".plp-product")[0].children

  // const price = await page2.$$eval(
  //   ".eJcLXJ",
  //   (date) => {
  //     return date.map((x) => x.textContent);
  //   }
  // );

  // console.log("BLINK", price);

  // await delay(5000);
  // const weight = await page2.$$eval(
  //   ".plp-product__quantity--box",
  //   (date) => {
  //     return date.map((x) => x.textContent);
  //   }
  // );

  // console.log("BLINK", weight);

  //     return { name, image, weight, price };
  // } catch (error) {
  //     console.log(error); 
  //  }
  //   }),

  async function getBlinkitData() {
    const len = await page2.evaluate(() => {
      let cardLength = document.querySelectorAll('.plp-product');
      let cardLength1 = [...cardLength].map((item, index) => {
        let cardObj;
        if (item.childElementCount == 3) {
          cardObj = {
            image: item.children[0].children[0].children[0].getAttribute("src"),
            name: item.children[2].children[0].textContent,
            quantity: item.children[2].children[1].textContent,
            price: item.children[2].children[2].children[0].children[0].textContent,
            brandName: 'Blinkit'
          }
        } else {
          cardObj = {
            image: item.children[1].children[0].children[0].getAttribute("src"),
            name: item.children[3].children[0].textContent,
            quantity: item.children[3].children[1].textContent,
            price: item.children[3].children[2].children[0].children[0].textContent,
            brandName: 'Blinkit'
          };
        }
        return cardObj
      })
      return cardLength1
    });
    console.log(len, "len")

    res.send({
      status: true,
      brandName: "Blinkit",
      data: len
    });
  }
  getBlinkitData()
  browser.on('disconnected', () => {
    console.log('Browser is closed');
  });
  // start()   /// it will shows error cannot set after they are sent to client
  await browser.close();
  start();
});


// app.get('/dunzo', async (req, res, start) => {


//   const browser = await puppeteer.launch({
//     headless: true,
//     executablePath: executablePath(),
//     ignoreHTTPSErrors: true,
//     timeout: 600000,
//     // userDataDir: '/path/to/user/data/dir',
//     // slowMo: 0,
//     args: [
//       "--window-size=1920,1040",
//       '--incognito',
//       // "--window-size=900,600", //'--proxy-server=14.97.2.107:80',
//       "--remote-debugging-port=9222",
//       "--remote-debugging-address=0.0.0.0", // You know what your doing?
//       "--disable-gpu",
//       "--disable-features=IsolateOrigins,site-per-process",
//       "--blink-settings=imagesEnabled=true",

//       //   "--no-sandbox",
//       //   "--disable-setuid-sandbox",
//       //   "--ignore-certificate-errors",

//       // '--start-fullscreen'
//     ],
//     // executablePath: "/usr/bin/google-chrome-stable",
//     defaultViewport: null,
//   });

//   console.log("launch dunzo");
//   const page1 = (await browser.pages())[0];

//   await page1.setUserAgent(
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
//   );


//   await page1.goto(BASE_URL2, { waitUntil: ["domcontentloaded", "networkidle2"] });
//   console.log("linkHit dunzo");
//   const version = await browser.version();
//   console.log(version);

//   // await page1.waitForSelector("#header > div > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-jqmf1i-5.bidAne > div > div.sc-AxjAm.StDqM.sc-17nyegg-2.sc-1fdjem6-0.gdWmLN > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-17nyegg-8.gSPnff > p")

//   await page1.$eval(
//     "#header > div > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-jqmf1i-5.bidAne > div > div.sc-AxjAm.StDqM.sc-17nyegg-2.sc-1fdjem6-0.gdWmLN > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-17nyegg-8.gSPnff > p",
//     (form) => form.click()
//   );
//   // await delay(1000);//// not in use
//   //     await page1.$eval('#expandable-view > div > div.sc-AxjAm.StDqM.sc-4bil4e-1.cKnqnJ > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-1pv5wjx-0.doYqEQ.sc-1w2vjuw-2.ffGXun > input',(form=>form.focus))
//   await delay(300)

//   let location = req.query.location;
//   await page1.keyboard.type(location, { delay: 50 }); //enterusername


//   console.log("location type in dunzo", location);
//   // await page.keyboard.up('Enter');
//   // await delay(1000);//// not use
//   // await page1.waitForNavigation({ waitUntil: ["networkidle2"] });  
//   await page1.waitForNetworkIdle({ waitUntil: 'networkidle0' });
//   await page1.waitForSelector('#expandable-view > div > div.sc-AxjAm.StDqM.sc-4bil4e-1.cKnqnJ > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-1w2vjuw-1.gnVSnQ > div.sc-AxjAm.StDqM.sc-5mb6ac-0.gFfvoJ > div:nth-child(2) > div > p.sc-AxhCb.bHCIYd.sc-eejohd-2.hpEsVV')
//   await page1.$eval(
//     "#expandable-view > div > div.sc-AxjAm.StDqM.sc-4bil4e-1.cKnqnJ > div > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-1w2vjuw-1.gnVSnQ > div.sc-AxjAm.StDqM.sc-5mb6ac-0.gFfvoJ > div:nth-child(2) > div > p.sc-AxhCb.bHCIYd.sc-eejohd-2.hpEsVV",
//     (form) => form.click()
//   );

//   console.log("#expandable.click in dunzo");


//   await page1.$eval(
//     "#header > div > div > div > div.sc-AxjAm.rvwoc.sc-AxirZ.ktnnZL > a:nth-child(1)",
//     (form) => form.click()
//   );

//   //  await delay(500);// not in use
//   //  await page1.waitForNavigation({ waitUntil: ["domcontentloaded","load","networkidle0","networkidle2"] });

//   let product = req.query.product;
//   await page1.keyboard.type(product, { delay: 100 }); //enterusername
//   await page1.keyboard.down("Enter");
//   console.log("Product then enter in dunzo", product);

//   //    await delay(2000);// not use

//   await page1.waitForNetworkIdle({ waitUntil: 'domcontentloaded' });

//   await page1.evaluate(() => {
//     setInterval(() => {
//       document
//         .querySelector(
//           "#__next > div:nth-child(2) > div.sc-AxjAm.StDqM.sc-1igvtxh-0.ivSqwW > div.sc-AxjAm.StDqM.sc-1dpeypg-4.hUkimG"
//         )
//         .scrollIntoView({
//           behavior: "smooth",
//           block: "end",
//           inline: "end",
//         });
//     }, 500);
//   });

//   // await page1.keyboard.press("PageDown");
//   // await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 1s
//   // await page1.keyboard.press("PageDown");

//   // await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 1s
//   // await page2.keyboard.press("PageDown");

//   //       const shopLogo = await page1.$$eval(
//   //         "#__next > div > div.sc-AxjAm.StDqM.sc-1igvtxh-0.ivSqwW > div.sc-AxjAm.StDqM.sc-1dpeypg-4.hUkimG > div > div.sc-AxjAm.StDqM.sc-sblcwm-0.sc-1iv8oo0-1.fPdrRW > a > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-3s3zxm-7.pdjww > div.sc-AxjAm.StDqM.sc-3s3zxm-9.hSPgRa > img",
//   //         (date) => {
//   //           // return date.map((x) => [x.textContent.trim()]);
//   //           return date.map((x) => x.getAttribute("src"));
//   //         }
//   //       );

//   //       console.log("DUNZO", shopLogo);


//   //       const shopName = await page1.$$eval(
//   //         "#__next > div > div.sc-AxjAm.StDqM.sc-1igvtxh-0.ivSqwW > div.sc-AxjAm.StDqM.sc-1dpeypg-4.hUkimG > div > div.sc-AxjAm.StDqM.sc-sblcwm-0.sc-1iv8oo0-1.fPdrRW > a > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-3s3zxm-7.pdjww > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-3s3zxm-0.heGqRD > p",
//   //         (date) => {
//   //           return date.map((x) => [x.textContent.trim()]);
//   //         }
//   //       );



//   // console.log("Dunzo",shopName);

//   //       const km = await page1.$$eval(
//   //         "#__next > div > div.sc-AxjAm.StDqM.sc-1igvtxh-0.ivSqwW > div.sc-AxjAm.StDqM.sc-1dpeypg-4.hUkimG > div > div.sc-AxjAm.StDqM.sc-sblcwm-0.sc-1iv8oo0-1.fPdrRW > a > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-3s3zxm-7.pdjww > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-3s3zxm-0.heGqRD > div > p:nth-child(1)",
//   //         (date) => {
//   //           return date.map((x) => x.textContent);
//   //         }
//   //       );


//   // console.log("Dunzo",km);


//   // const time = await page1.$$eval(
//   // "#__next > div > div.sc-AxjAm.StDqM.sc-1igvtxh-0.ivSqwW > div.sc-AxjAm.StDqM.sc-1dpeypg-4.hUkimG > div > div.sc-AxjAm.StDqM.sc-sblcwm-0.sc-1iv8oo0-1.fPdrRW > a > div > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-3s3zxm-7.pdjww > div.sc-AxjAm.StDqM.sc-AxirZ.ktnnZL.sc-3s3zxm-0.heGqRD > div > p:nth-child(3)",
//   // (date) => {
//   //   return date.map((x) => x.textContent);
//   // }
//   // );


//   // console.log("Dunzo",time);

//   await delay(2000);

//   const image1 = await page1.$$eval(
//     ".slick-list .StDqM .kReyZW img",
//     (date) => {
//       // return date.map((x) => [x.textContent.trim()]);
//       return date.map((x) => x.getAttribute("src"));
//     }
//   );

//   console.log("DUNZO", image1);

//   const name1 = await page1.$$eval(
//     ".slick-list  .StDqM .sc-14toyid-6",
//     (date) => {
//       return date.map((x) => [x.textContent.trim()]);
//     }
//   );

//   console.log("DUNZO", name1);

//   // await delay(5000);
//   const weight1 = await page1.$$eval(
//     ".slick-list  .StDqM .eMhUTz",
//     (date) => {
//       return date.map((x) => x.textContent);
//     }
//   );

//   console.log("DUNZO", weight1);

//   // await delay(5000);
//   const price1 = await page1.$$eval(
//     ".slick-list  .StDqM .lmawen",
//     (date) => {
//       return date.map((x) => x.textContent);
//     }
//   );

//   console.log("DUNZO", price1);
//   //       return { name1, image1, weight1, price1,km,time,shopLogo,shopName };
//   //   } catch (error) {
//   //       console.log(error); 
//   //    }
//   // })
//   browser.on('disconnected', () => {
//     console.log('Browser is closed');
//   });


//   await browser.close();
//   // }
//   // }

//   res.send({
//     brandName: "Dunzo",
//     data: [
//       {

//         // "shopLogo":shopLogo,
//         // "shopName":shopName,
//         // "Time":time,
//         // "Km":km,
//         "image": image1,
//         "Name": name1,
//         "weight": weight1,
//         "price": price1,
//       },
//     ],
//   },)

//   start()
// })


// app.get('/instamart', async (req, res, start) => {
//   const browser = await puppeteer.launch({
//     headless: true,
//     ignoreHTTPSErrors: true,
//     timeout: 600000,

//     // userDataDir: '/path/to/user/data/dir',
//     // isMobile:true
//     // executablePath: executablePath(),
//     // args: ['--start-fullscreen'],
//     // defaultViewport: null,
//   });


//   // puppeteer.launch({
//   //     headless:false, 
//   //     //   devtools: true,
//   //     ignoreHTTPSErrors: true
//   // }).then(async browser => {




//   //browser new page
//   const page3 = (await browser.pages())[0];

//   await page3.setUserAgent(
//     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36"
//   );

//   //set device to iPhone X
//   const m = puppeteer.devices['iPhone X']
//   //emulate iPhoneX
//   await page3.emulate(m)
//   //launch URL


//   await page3.goto(BASE_URL3, { waitUntil: ["networkidle0", "load"] });
//   const version = await browser.version();
//   console.log(version);


//   await page3.waitForSelector("#root > div > div.HZWFn > button")

//   console.log('====================================');
//   console.log("selector found before location click");
//   console.log('====================================');

//   await page3.$eval("#root > div > div.HZWFn > button", (form) =>
//     form.click()
//   );

//   console.log('====================================');
//   console.log("click location");
//   console.log('====================================');


//   // await delay(1200);

//   //  await page3.waitForNetworkIdle({ waitUntil: ["networkidle2"] });
//   await delay(1000)
//   let location = req.query.location;
//   await page3.keyboard.type(location, { delay: 50 });
//   console.log('====================================');
//   console.log("instalocation", location);
//   console.log('====================================');
//   ///        //   await delay(3000);////


//   await page3.waitForNetworkIdle({ waitUntil: ["networkidle0"] });
//   await page3.waitForSelector("#root > div > div._3lldG > div._3mMtt > div > div > button:nth-child(1) > span > span._3qV1m > span._1kMGJ")


//   await page3.$eval(
//     "#root > div > div._3lldG > div._3mMtt > div > div > button:nth-child(1) > span > span._3qV1m > span._1kMGJ",
//     (form) => form.click()
//   );


//   console.log('====================================');
//   console.log("insta location after click");
//   console.log('====================================');

//   //  await delay(3000);/////
//   // await page3.waitForNetworkIdle({ waitUntil: ["domcontentloaded"] });

//   //   await page.keyboard.type("delhi", {delay: 100});

//   await page3.waitForSelector("#root > div > div > div._3UNR_._2_95H.bottomOffsetPadBottom > div > div:nth-child(2) > div > div._3AA61._3spHt > div._2lb18 > button > div > span._3BVHa")

//   await page3.$eval(
//     // "#root > div > div > div._3UNR_._2_95H.bottomOffsetPadBottom > div > div:nth-child(2) > div > div._3AA61._3spHt > div._2lb18 > button > div",
//     "#root > div > div > div._3UNR_._2_95H.bottomOffsetPadBottom > div > div:nth-child(2) > div > div._3AA61._3spHt > div._2lb18 > button > div > span._3BVHa",
//     (form) => form.click()
//   );


//   console.log('====================================');
//   console.log("chec --- dom click");
//   console.log('====================================');

//   // await delay(4000);//////

//   await page3.$eval(
//     "#root > div > div > div._3Gv9D.statusBarPadTop._22AL6 > div > form > div > input",
//     (form) => form.focus()
//   );
//   console.log("click after focus");



//   //     await delay(1000);//
//   let product = req.query.product;

//   await page3.keyboard.type(product, { delay: 50 });
//   console.log('====================================');
//   console.log("type product");
//   console.log('====================================');
//   await page3.keyboard.press("Enter");

//   //await delay(800);//
//   console.log("product enter");
//   await page3.evaluate(() => {
//     setInterval(() => {
//       document
//         .querySelector(
//           "#root > div > div > div._3UNR_._2_95H.bottomOffsetPadBottom > div._3ZzU7"
//         )
//         .scrollIntoView({
//           behavior: "smooth",
//           block: "end",
//           inline: "end",
//         });
//     }, 400);
//   });

//   ///    await delay(300);///

//   // await page3.waitForNetworkIdle({ waitUntil: ["domcontentloaded"] });
//   await page3.waitForSelector("#root > div > div > div._3UNR_._2_95H.bottomOffsetPadBottom > div._3ZzU7 > div > div > div > div > div._14MGr > div._2tYvP")
//   const name3 = await page3.$$eval(
//     "#root > div > div > div._3UNR_._2_95H.bottomOffsetPadBottom > div._3ZzU7 > div > div > div > div > div._14MGr > div._2tYvP",
//     (date) => {
//       return date.map((x) => x.textContent.trim());
//     }
//   );

//   console.log("instamart", name3);

//   const price3 = await page3.$$eval(
//     "#root > div > div > div._3UNR_._2_95H.bottomOffsetPadBottom > div._3ZzU7 > div > div > div > div > div._3XeMT > div._2NahD > span",
//     (date) => {
//       return date.map((x) => x.textContent);
//     }
//   );

//   console.log("instamart", price3);

//   const weight3 = await page3.$$eval(
//     "#root > div > div > div._3UNR_._2_95H.bottomOffsetPadBottom > div._3ZzU7 > div > div > div > div > div._14MGr > div._3p_wY",
//     (date) => {
//       return date.map((x) => x.textContent);
//     }
//   );

//   console.log("instamart", weight3);

//   const image3 = await page3.$$eval(
//     "#root > div > div > div._3UNR_._2_95H.bottomOffsetPadBottom > div._3ZzU7 > div > div > div > div > div._1q0n_",
//     (date) => {
//       return date.map((x) => x.style.backgroundImage);
//     }
//   );
//   console.log("instamart", image3);
//   //  return { name3, image3, weight3, price3 };

//   //      } catch (error) {
//   //          console.log(error); 
//   //       }
//   //        }),
//   //    ];

//   //    const [
//   //      name,
//   //      name1,
//   //      // name3,
//   //      image,
//   //      image1,
//   //      // image3,
//   //      shopLogo,
//   //      shopName,
//   //      km,
//   //      time,
//   //      price,
//   //      price1,
//   //      // price3,
//   //      weight,
//   //      weight1,
//   //      // weight3,
//   //    ] = await Promise.all(promises);
//   //  await Promise.all(promises);

//   //   console.log(selector1, selector2, selector3);



//   browser.on('disconnected', () => {
//     console.log('Browser is closed');
//   });

//   //browser close
//   await browser.close()
//   //  brandName: "Dunzo",
//   //   data: [
//   //     {

//   //       // "shopLogo":shopLogo,
//   //       // "shopName":shopName,
//   //       // "Time":time,
//   //       // "Km":km,
//   //       "image": image1,
//   //       "Name": name1,
//   //       "weight": weight1,
//   //       "price": price1,
//   //     },
//   //   ],

//   res.send({
//     brandName: "instamart",

//     data: [
//       {
//         "image": image3,
//         "Name": name3,
//         "weight": weight3,
//         "price": price3,
//       }]
//   })

//   start()

// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});