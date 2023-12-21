// // // //      Kashmir News Service (Kashmir)        ////
import { NextResponse } from"next/server";
import puppeteer from 'puppeteer';

let data = [];

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
        await page.goto('https://www.knskashmir.com/');

        const mainCont = await page.$('html > body.home > form#form1 > div > div#site > div#site-wrap > div#body-main-wrap > div.body-main-out > div.body-main-in > div#body-main-cont > div#home-main-wrap > div.home-wrap-out1 > div.home-wrap-in1 > div#home-left-wrap > div.home-wrap-out2 > div#tab-col2 > div.theiaStickySidebar > div.side-list-wrap');


        //#region           MULTIPLE ITEMS DIVISION
        const multiItems = await mainCont.$$('ul#ContentPlaceHolder1_latestnews > li');

        for (let item of multiItems) {
            // Get Headline
            const multiHead = await item.evaluate(el => el.querySelector('div > div.side-list-in > div > p > a').innerText);
            // Get Image
            const multiImage = await item.evaluate(el => el.querySelector('div > div.side-list-img > a > img').src);
            // Get Link
            const multiLink = await item.evaluate(el => el.querySelector('div > div.side-list-img > a').href);

            // Collate multiData & Push to "data" Array
            const multiObj = {
                headline: multiHead,
                image: multiImage,
                link: multiLink,
            };

            data.push(multiObj);
        };
        
        //#endregion

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
        };
    };
};




