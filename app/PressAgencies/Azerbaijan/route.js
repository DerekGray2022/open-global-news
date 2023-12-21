// // // //      AZERTAC (Azerbaijan)        ////
import { NextResponse } from"next/server";
import puppeteer from 'puppeteer';

let preData = [];
let data = [];
let isDuplicate = false;

export async function  GET () {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // headless: false,
        // defaultViewport: false,
    });
    const page = await browser.newPage();

    try {
        // Landing Page
        await page.goto('https://azertag.az/en/');



        //#region           MULTIPLE ITEMS DIVISION
        await page.waitForSelector('html > body > div.sa-home-section > div.container > div > div:nth-of-type(1) > div > div:nth-of-type(1) > div > div > div > div', {visible: true});
        const multiItems = await page.$$('html > body > div.sa-home-section > div.container > div > div:nth-of-type(1) > div > div:nth-of-type(1) > div > div > div > div');

        for (let item of multiItems) {
            // Get Headline
            const multiHead = await item.evaluate(el => el.querySelector('div > div > div.entry-content > h2 > a').innerText);
            // Get Image
            const multiImage = await item.evaluate(el => el.querySelector('div > div > div.entry-header > div > a > img').src);
            // Get Link
            const multiLink = await item.evaluate(el => el.querySelector('div > div > div.entry-content > h2 > a').href);

            if (multiImage === "") {
                // Collate multiData without Image & Push to "data" Array
                const multiObj = {
                    headline: multiHead,
                    link: multiLink,
                };
            
                preData.push(multiObj);
            }
            else {
                // Collate multiData & Push to "data" Array
                const multiObj = {
                    headline: multiHead,
                    image: multiImage,
                    link: multiLink,
                };
            
                preData.push(multiObj);
            }
        };
        
        //#endregion


        // #region      SORT DATA ARRAY
        preData.map((item) => {
            data.map((dat) => {
                if (item.headline === dat.headline) {
                    isDuplicate = true;
                };
            });

            if (!isDuplicate) {
                data.push(item);
            };
            isDuplicate = false;
        });

        // #endregion

        return NextResponse.json({ data });
    }
    catch (err) {
        data.push({
            headline: "No more items currently unavailable."
        });
        return NextResponse.json(
            {data},
            { status: 200 }
        );
    }
    finally {
        if (browser) {
            await browser.close();
        }
    };
};




