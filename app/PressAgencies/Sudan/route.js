// // // //      SUDAN NEWS AGENCY (Sudan)        ////
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
        await page.goto('https://sunanews.net/english-latest-news.html');


        // #region           TOP ITEM DIVISION
        await page.waitForSelector('html > body#bd > div#ja-wrapper > div#ja-container > div.main > div#ja-mainbody > div#ja-main > div.inner > div#ja-contentwrap > div#ja-content > div#ja-current-content > div.ja-content-main > div.blog > div.leading', {visible: true});
        const topItem = await page.$('html > body#bd > div#ja-wrapper > div#ja-container > div.main > div#ja-mainbody > div#ja-main > div.inner > div#ja-contentwrap > div#ja-content > div#ja-current-content > div.ja-content-main > div.blog > div.leading');

        // Get Headline
        const topItemHead = await topItem.evaluate((el) => el.querySelector('div > h2 > a').innerText);
        // Get Body
        const topItemBody = await topItem.evaluate((el) => el.querySelector('div > div.article-content').innerText);
        // Get Link
        const topItemLink = await topItem.evaluate((el) => el.querySelector('div > h2 > a').href);

        // Push Collated Data &  to "data" Array
        const topItemObj = {
            headline: topItemHead,
            body: topItemBody,
            link: topItemLink,
        };

        data.push(topItemObj); 

        //#endregion



        //#region           LIST ITEMS DIVISION
        await page.waitForSelector('html > body#bd > div#ja-wrapper > div#ja-container > div.main > div#ja-mainbody > div#ja-main > div.inner > div#ja-contentwrap > div#ja-content > div#ja-current-content > div.ja-content-main > div.blog > div.article_row', {visible: true});
        const listItems = await page.$$('html > body#bd > div#ja-wrapper > div#ja-container > div.main > div#ja-mainbody > div#ja-main > div.inner > div#ja-contentwrap > div#ja-content > div#ja-current-content > div.ja-content-main > div.blog > div.article_row');

        for (let item of listItems) {
            // Get Column1 Headline
            const listHeadCol1 = await item.evaluate(el => el.querySelector('div.column1 > div > h2 > a').innerText);
            // Get Body
            const listBodyCol1 = await item.evaluate(el => el.querySelector('div.column1 > div > div.article-content').innerText);
            // Get Link
            const listLinkCol1 = await item.evaluate(el => el.querySelector('div.column1 > div > h2 > a').href);

            // Collate listData & Push to "data" Array
            const listObjCol1 = {
                headline: listHeadCol1,
                body: listBodyCol1,
                link: listLinkCol1,
            };

            data.push(listObjCol1);

            // Get Column2 Headline
            const listHeadCol2 = await item.evaluate(el => el.querySelector('div.column2 > div > h2 > a').innerText);
            // Get Body
            const listBodyCol2 = await item.evaluate(el => el.querySelector('div.column2 > div > div.article-content').innerText);
            // Get Link
            const listLinkCol2 = await item.evaluate(el => el.querySelector('div.column2 > div > h2 > a').href);

            // Collate listData & Push to "data" Array
            const listObjCol2 = {
                headline: listHeadCol2,
                body: listBodyCol2,
                link: listLinkCol2,
            };

            data.push(listObjCol2);
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




