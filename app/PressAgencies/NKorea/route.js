// // // //      KOREAN CENTRAL NEWS AGENCY (North Korea)        ////
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
        await page.goto('http://www.kcna.kp/en/category/articles/q/5394b80bdae203fadef02522cfb578c0.kcmsf');



        //#region           LIST ITEMS DIVISION
        await page.waitForSelector('html > body#top.en.articles > div.main-container > div:nth-of-type(3) > div.article-wrapper > ul.article-link > li', {visible: true});
        const listItems = await page.$$('html > body#top.en.articles > div.main-container > div:nth-of-type(3) > div.article-wrapper > ul.article-link > li');

        for (let item of listItems) {
            // Get Headline
            const listHead = await item.evaluate(el => el.querySelector('a').innerText);
            // Get Link
            const listLink = await item.evaluate(el => el.querySelector('a').href);

            // Collate listData & Push to "data" Array
            const listObj = {
                headline: listHead,
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




