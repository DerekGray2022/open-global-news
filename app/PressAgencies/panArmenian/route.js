// // // //      panARMENIAN (Armenia)        ////
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
        await page.goto('https://panarmenian.net/eng/news/');



        //#region           MULTIPLE ITEMS DIVISION
        await page.waitForSelector('html > body > div#wrapper > div#body > div.section > div > table > tbody > tr > td.single_content > div', {visible: true});
        const multiItems = await page.$$('html > body > div#wrapper > div#body > div.section > div > table > tbody > tr > td.single_content > div > div.theitem');

        for (let item of multiItems) {
            // Get Headline
            const multiHead = await item.evaluate(el => el.querySelector('div.font10 > div.block_body > h2.font12 > a.nevy').innerText);
            // Get Body
            const multiBody = await item.evaluate(el => el.querySelector('div.font10 > div.block_body > div.teaser').innerText);
            // Get Image
            const multiImage = await item.evaluate(el => el.querySelector('div.pic > a > img.last_photo.bevels').src);
            // Get Link
            const multiLink = await item.evaluate(el => el.querySelector('div.pic > a').href);

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
        }
    };
};



