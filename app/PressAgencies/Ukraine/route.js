// // // //      UKRAINIAN NEWS AGENCY (Ukraine)        ////
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
        await page.goto('https://ukranews.com/en/news');



        //#region           TOP ITEMS DIVISION
        await page.waitForSelector('html > body > div.off-canvas-wrap > div.inner-wrap > section.main-section > div.retreat > div.content > div.row > div:nth-of-type(1) > div#w0 > div:nth-of-type(1) > a', {visible: true});
        const topItems = await page.$$('html > body > div.off-canvas-wrap > div.inner-wrap > section.main-section > div.retreat > div.content > div.row > div:nth-of-type(1) > div#w0 > div:nth-of-type(1) > a');

        for (let item of topItems) {
            // Get Headline
            const topHead = await item.evaluate(el => el.querySelector('div.visual > img').title);
            // Get Image
            const topImage = await item.evaluate(el => el.querySelector('div.visual > img').src);
            // Get Link
            const topLink = await item.evaluate(el => el.href);

            // Collate topData & Push to "data" Array
            const topObj = {
                headline: topHead,
                image: topImage,
                link: topLink,
            };
            data.push(topObj);
        };
        
        //#endregion



        //#region           LIST ITEMS DIVISION
        await page.waitForSelector('html > body > div.off-canvas-wrap > div.inner-wrap > section.main-section > div.retreat > div.content > div.row > div:nth-of-type(1) > div.flex_tags_content > div.tape_news > div.news__content > div#w0 > a', {visible: true});
        const listItems = await page.$$('html > body > div.off-canvas-wrap > div.inner-wrap > section.main-section > div.retreat > div.content > div.row > div:nth-of-type(1) > div.flex_tags_content > div.tape_news > div.news__content > div#w0 > a');

        for (let item of listItems) {
            // Get Headline
            const listHead = await item.evaluate(el => el.querySelector('div.text').innerText);
            // Get Image
            const listImage = await item.evaluate(el => el.querySelector('div.visual > img').src);
            // Get Link
            const listLink = await item.evaluate(el => el.href);

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




