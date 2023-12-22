// // // //      BBC NEWS (UK)        ////
import { NextResponse } from"next/server";
import puppeteer from 'puppeteer';

let data = [];
let related = [];
let secRelated = [];

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
        await page.goto('https://www.bbc.co.uk/news');


        // #region           TOP ITEM DIVISION
        await page.waitForSelector('html > body > div#orb-modules > div.news-chameleon-serif-enabled > div#site-container > div#latest-stories-tab-container > div#news-top-stories-container > div:nth-of-type(3) > div#nw-c-topstories-domestic > div.gel-wrap > div.gel-layout > div:nth-of-type(1) > div.gel-layout > div.nw-c-top-stories__primary-item > div.nw-c-top-stories-primary__story > div.gs-c-promo', {visible: true});
        const topItem = await page.$('html > body > div#orb-modules > div.news-chameleon-serif-enabled > div#site-container > div#latest-stories-tab-container > div#news-top-stories-container > div:nth-of-type(3) > div#nw-c-topstories-domestic > div.gel-wrap > div.gel-layout > div:nth-of-type(1) > div.gel-layout > div.nw-c-top-stories__primary-item > div.nw-c-top-stories-primary__story > div.gs-c-promo');

        // Get Headline
        const topItemHead = await topItem.evaluate((el) => el.querySelector('div:nth-of-type(2) > div > a > h3').innerText);
        // Get Body
        const topItemBody = await topItem.evaluate((el) => el.querySelector('div:nth-of-type(2) > div > p').innerText);
        // Get Image
        const topItemImage = await topItem.evaluate((el) => el.querySelector('div:nth-of-type(1) > div > div > img').src);
        // Get Link
        const topItemLink = await topItem.evaluate((el) => el.querySelector('div:nth-of-type(2) > div > a').href);

        // Push Collated Data &  to "data" Array
        const topItemObj = {
            headline: topItemHead,
            body: topItemBody,
            image: topItemImage,
            link: topItemLink,
        };

        data.push(topItemObj); 

        //#endregion



        //#region           LIST ITEMS DIVISION
        await page.waitForSelector('html > body > div#orb-modules > div > div#site-container > div#latest-stories-tab-container > div#news-top-stories-container > div:nth-of-type(3) > div#nw-c-topstories-domestic > div.gel-wrap > div.gel-layout > div.gel-layout__item > div.gel-layout > div:nth-child(n+2)', {visible: true});
        const listItems = await page.$$('html > body > div#orb-modules > div > div#site-container > div#latest-stories-tab-container > div#news-top-stories-container > div:nth-of-type(3) > div#nw-c-topstories-domestic > div.gel-wrap > div.gel-layout > div.gel-layout__item > div.gel-layout > div:nth-child(n+2)');

        for (let item of listItems) {
            try {
                // Get Headline
                const listHead = await item.evaluate(el => el.querySelector('div > div.gs-c-promo-body > div > a > h3.gs-c-promo-heading__title').innerText);
                // Get Image
                let listImage = await item.evaluate(el => el.querySelector('div > div.gs-c-promo-image > div > div > img').src);

                if (listImage === 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7') {
                    let image = await item.evaluate(el => el.querySelector('div > div.gs-c-promo-image > div > div > img').dataset.src);
                    listImage = image.replace("{width}", "240");
                };
                // Get Link
                const listLink = await item.evaluate(el => el.querySelector('div > div.gs-c-promo-body > div > a').href);

                // Collate listData & Push to "data" Array
                const listObj = {
                    headline: listHead,
                    image: listImage,
                    link: listLink,
                };

                data.push(listObj);
            }
            catch (error) {
                
            };
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

