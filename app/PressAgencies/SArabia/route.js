// // // //      UNION OF OIC NEWS AGENCIES (Saudi Arabia)        ////
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
        await page.goto('https://una-oic.org/en/');



        //#region           MULTIPLE ITEMS DIVISION
        await page.waitForSelector('html > body#tie-body > div.background-overlay > div#tie-container > div#tie-wrapper > div:nth-of-type(1) > div.section-item > section > div.slider-area-inner > div > div.main-slider-inner > div.slider-main-container > div.tie-slick-slider > div.slick-list > div.slick-track > div', {visible: true});
        const multiItems = await page.$$('html > body#tie-body > div.background-overlay > div#tie-container > div#tie-wrapper > div:nth-of-type(1) > div.section-item > section > div.slider-area-inner > div > div.main-slider-inner > div.slider-main-container > div.tie-slick-slider > div.slick-list > div.slick-track > div');

        for (let item of multiItems) {
            // Get Headline
            const multiHead = await item.evaluate(el => el.querySelector('div.thumb-overlay > div.container > div.thumb-content > h2.thumb-title > a').innerText);
            // // Get Image
            const multiImage = await item.evaluate(el => el.dataset.bg);
            // Get Link
            const multiLink = await item.evaluate(el => el.querySelector('div.thumb-overlay > div.container > div.thumb-content > h2.thumb-title > a').href);

            // Collate multiData & Push to "data" Array
            const multiObj = {
                headline: multiHead,
                image: multiImage,
                link: multiLink,
            };

            data.push(multiObj);
        };
        
        //#endregion
        data.pop();
        data.pop();

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




