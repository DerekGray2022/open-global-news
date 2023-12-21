// // // //      PRESS AGENCY (Country)        ////
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
        await page.goto('https://english.kyodonews.net/news/world');



        //#region           MULTIPLE ITEMS DIVISION
        await page.waitForSelector('html.full > body > div.wrapper > div.container > div#js-postListItems > div.row > article.col-md-3', {visible: true});
        const multiItems = await page.$$('html.full > body > div.wrapper > div.container > div#js-postListItems > div > article.col-md-3');

        for (let item of multiItems) {
            // Get Headline
            const multiHead = await item.evaluate(el => el.querySelector('a > h3').innerText);
            // Get Image
            let multiImage = await item.evaluate(el => el.querySelector('a > div > img').src);
            if (multiImage === 'https://english.kyodonews.net/en/img/thumbnail.png') {
                multiImage = await item.evaluate(el => el.querySelector('a > div > img').dataset.src);
            };
            // Get Link
            const multiLink = await item.evaluate(el => el.querySelector('a').href);

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




