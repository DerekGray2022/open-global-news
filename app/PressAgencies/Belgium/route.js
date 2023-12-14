// // // //      BELGA NEWS AGENCY (Belgium)        ////
import { NextResponse } from"next/server";
import puppeteer from 'puppeteer';

let data = [];
let related = [];

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
        await page.goto('https://www.belganewsagency.eu/');


        // #region           TOP ITEM DIVISION
        await page.waitForSelector('html > body > div#__next > div.Layout_layout__xvC8B > main.Layout_content__hZcBN > div > div.StoriesList_highlightedStoriesContainer__ydgis > div.HighlightedStoryCard_container__pGQxY', {visible: true});
        const topItem = await page.$('html > body > div#__next > div.Layout_layout__xvC8B > main.Layout_content__hZcBN > div > div.StoriesList_highlightedStoriesContainer__ydgis > div.HighlightedStoryCard_container__pGQxY');

        // Get Headline
        const topItemHead = await topItem.evaluate((el) => el.querySelector('div > h2 > a').innerText);
        // Get Image
        const topItemImage = await topItem.evaluate((el) => el.querySelector('a > picture > img').src);
        // Get Link
        const topItemLink = await topItem.evaluate((el) => el.querySelector('a').href);

        // Push Collated Data &  to "data" Array
        const topItemObj = {
            headline: topItemHead,
            image: topItemImage,
            link: topItemLink,
        };

        data.push(topItemObj); 

        //#endregion


        //#region           LIST ITEMS DIVISION
        await page.waitForSelector('html > body > div#__next > div.Layout_layout__xvC8B > main.Layout_content__hZcBN > div > div.StoriesList_storiesContainer__yVALX > div', {visible: true});
        const listItems = await page.$$('html > body > div#__next > div.Layout_layout__xvC8B > main.Layout_content__hZcBN > div > div.StoriesList_storiesContainer__yVALX > div');

        for (let item of listItems) {
            // Get Headline
            let listHead;
            try {
                listHead = await item.evaluate(el => el.querySelector('div > h2 > a').innerText);
            }
            catch (error) {
                listHead = await item.evaluate(el => el.querySelector('div > h3 > a').innerText);
            };
            // Get Image
            const listImage = await item.evaluate(el => el.querySelector('a > picture > img').src);
            // Get Link
            const listLink = await item.evaluate(el => el.querySelector('a').href);

            // Collate listData & Push to "data" Array
            const listObj = {
                headline: listHead,
                image: listImage,
                link: listLink,
            };

            data.push(listObj);
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




