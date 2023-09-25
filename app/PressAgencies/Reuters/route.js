// // // //      REUTERS (UK)        ////
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
        await page.goto('https://www.reuters.com/news/archive/ukDomestic');



        //#region           MULTIPLE ITEMS DIVISION
        await page.waitForSelector('html > body.BETAUS > div#content > section > div.group > div.column1 > section.module > section.module-content > div.news-headline-list > article.story', {visible: true});
        const multiItems = await page.$$('html > body.BETAUS > div#content > section > div.group > div.column1 > section.module > section.module-content > div.news-headline-list > article.story');

        for (let item of multiItems) {
            // Get Headline
            const multiHead = await item.evaluate(el => el.querySelector('div.story-content > a > h3').innerText);
            // Get Body
            const multiBody = await item.evaluate(el => el.querySelector('div.story-content > p').innerText);
            // Get Image
            const multiImage = await item.evaluate(el => el.querySelector('div.story-photo > a > img').src);
            // Get Link
            const multiLink = await item.evaluate(el => el.querySelector('div.story-photo > a').href);

            // Collate multiData & Push to "data" Array
            const multiObj = {
                headline: multiHead,
                body: multiBody,
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




