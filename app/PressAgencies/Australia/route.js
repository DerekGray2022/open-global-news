// // // //      THE AUSTRALIAN (Australia)        ////
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
        await page.goto('https://www.theaustralian.com.au/news/latest-news');



        //#region           LATEST NEWS ITEMS DIVISION
        await page.waitForSelector('html > body > main#main > div.container > div.main__content > div#group_3_col-151 > div.subarea-1 > div > div.stream > div.stream__list > div', {visible: true});
        const latestNewsItems = await page.$$('html > body > main#main > div.container > div.main__content > div#group_3_col-151 > div.subarea-1 > div > div.stream > div.stream__list > div');

        for (let item of latestNewsItems) {
            // Get Headline
            const latestNewsHead = await item.evaluate(el => el.querySelector('div.story-block__region2 > h3 > a').innerText);
            // Get Image
            const latestNewsImage = await item.evaluate(el => el.querySelector('div.story-block__region2 > div.story-block__image > a > picture > img').dataset.src);
            // Get Link
            const latestNewsLink = await item.evaluate(el => el.querySelector('div.story-block__region2 > h3 > a').href);

            // Collate latestNewsData & Push to "data" Array
            const latestNewsObj = {
                headline: latestNewsHead,
                image: latestNewsImage,
                link: latestNewsLink,
            };

            data.push(latestNewsObj);
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




