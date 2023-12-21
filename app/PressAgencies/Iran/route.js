// // // //      FARS (Iranian  Islamic Revolutionary Guard Corps)        ////
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
        await page.goto('https://www.farsnews.ir/en/');


        //#region           LEFT SECTION NEWS ITEMS
        await page.waitForSelector('body > main > div.container > div > div.h-lastStories > .min-top', {visible: true});
        const leftItemContainer = await page.$('body > main > div.container > div > div.h-lastStories > .min-top');


        // Get Head Item
        const leftItemHead = await leftItemContainer.evaluate((el) => el.querySelector('article > a > div > h3').innerText);
        // Get Image
        const leftItemImage = await leftItemContainer.evaluate((el) => el.querySelector('article > a > img').src);
        // Get Link
        const leftItemLink = await leftItemContainer.evaluate((el) => el.querySelector('article > a').href);

        const leftItemObj = {
            headline: leftItemHead,
            image: leftItemImage,
            link: leftItemLink,
        };

        data.push(leftItemObj);

        await leftItemContainer.waitForSelector('ul > li.top-news-list', {visible: true});
        const leftItemList = await page.$$('ul > li.top-news-list');

        try {
            for (let item of leftItemList) {
                //  Get Headline
                const leftItemHead = await item.evaluate(ele => ele.querySelector('article > div.detalis > a > span.title').innerText);
                //  Get Headline
                const leftItemImage = await item.evaluate(ele => ele.querySelector('article > div.media > a > img').src);
                // Get Link
                const leftItemLink = await item.evaluate(ele => ele.querySelector('article > div.media > a').href);

                //  Create leftItem Object
                const leftItemObj = {
                        headline: leftItemHead,
                        image: leftItemImage,
                        link: leftItemLink,
                };
                data.push(leftItemObj);
            };
        }
        catch (err) {
            data.push({
            headline: "No more items currently unavailable."
            });
            return NextResponse.json(
                {data},
                { status: 200 }
            );
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




