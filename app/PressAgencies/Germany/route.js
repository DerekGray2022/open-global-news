// // // //      CORRECTIV (Germany)        ////
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
        await page.goto('https://correctiv.org/en');



        //#region           LIST ITEMS DIVISION
        await page.waitForSelector('html > body > div.body-wrapper > main#main > div.elementor > section#stories > div.elementor-container > div.elementor-column > div.elementor-widget-wrap > div.teaser__container > div.elementor-widget-container > div.elementor-shortcode > a.teaser__item', {visible: true});
        const listItems = await page.$$('html > body > div.body-wrapper > main#main > div.elementor > section#stories > div.elementor-container > div.elementor-column > div.elementor-widget-wrap > div.teaser__container > div.elementor-widget-container > div.elementor-shortcode > a.teaser__item');

        for (let item of listItems) {
            // Get Headline
            const listHead = await item.evaluate(el => el.querySelector('h3').innerText);
            // Get Body
            const listBody = await item.evaluate(el => el.querySelector('p').innerText);
            // Get Image
            const listImage = await item.evaluate(el => el.querySelector('img').src);
            // Get Link
            const listLink = await item.evaluate(el => el.href);

            // Collate listData & Push to "data" Array
            const listObj = {
                headline: listHead,
                body: listBody,
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




