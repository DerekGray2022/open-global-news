// // // //      ALGERIA PRESS SERVICE (Algeria)        ////
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
        await page.goto('https://www.aps.dz/en/');


        // #region           TOP ITEM DIVISION
        await page.waitForSelector('html > body > div.t3-wrapper > div.urgent > div#ads-bg > div.block-slideshow > div.container > div.row > div.slideshow > div.allmode-box > div.allmode-topbox > div.allmode-topitem', {visible: true});
        const topItem = await page.$('html > body > div.t3-wrapper > div.urgent > div#ads-bg > div.block-slideshow > div.container > div.row > div.slideshow > div.allmode-box > div.allmode-topbox > div.allmode-topitem');

        // Get Headline
        const topItemHead = await topItem.evaluate((el) => el.querySelector('h3 > a').innerText);
        // Get Body
        const topItemBody = await topItem.evaluate((el) => el.querySelector('div.allmode-text').innerText);
        // Get Image
        const topItemImage = await topItem.evaluate((el) => el.querySelector('div.allmode-img-top > a > img').src);
        // Get Link
        const topItemLink = await topItem.evaluate((el) => el.querySelector('h3 > a').href);
        
        // GET RELATED ITEMS
        const topitemRelated = await topItem.$$('div.allmode-itemsbox-list > div.allmode-item-list-une');

        for (let item of topitemRelated) {
            //  Get Headline
            const otherHead = await item.evaluate(ele => ele.querySelector('h4 > a').innerText);
            // Get Link
            const otherLink = await item.evaluate(ele => ele.querySelector('h4 > a').href);

            // Collate Related Stories & Push to "related" Array
            const relate = {
                headline: otherHead,
                link: otherLink,
            };
            related.push(relate);
        };

        // Push Collated Data &  to "data" Array
        const topItemObj = {
            headline: topItemHead,
            body: topItemBody,
            image: topItemImage,
            link: topItemLink,
            related,
        };

        data.push(topItemObj); 

        //#endregion



        //#region           LIST ITEMS DIVISION
        await page.waitForSelector('html > body > div.t3-wrapper > div.urgent > div#ads-bg > div.block-slideshow > div.container > div.row > div.slideshow-secondaire > div.allmode-box > div.allmode-topbox > div.allmode-topitem', {visible: true});
        const listItems = await page.$$('html > body > div.t3-wrapper > div.urgent > div#ads-bg > div.block-slideshow > div.container > div.row > div.slideshow-secondaire > div.allmode-box > div.allmode-topbox > div.allmode-topitem');

        for (let item of listItems) {
            // Get Headline
            const listHead = await item.evaluate(el => el.querySelector('h3 > a').innerText);
            // Get Image
            const listImage = await item.evaluate(el => el.querySelector('div.allmode-img-top > a > img').src);
            // Get Link
            const listLink = await item.evaluate(el => el.querySelector('h3 > a').href);

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



