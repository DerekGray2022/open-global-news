// // // //      AGENCIA BRAZIL (Brazil)        ////
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
        await page.goto('https://agenciabrasil.ebc.com.br/en');



        //#region           MULTIPLE ITEMS DIVISION
        await page.waitForSelector('body > div.region.region-content > section.blog-page.py-0 > div > div > div > div > div > section > div > div.row > div > div > div.row', {visible: true});
        const latestNewsItems = await page.$$('body > div.region.region-content > section.blog-page.py-0 > div > div > div > div > div > section > div > div.row > div > div > div.row');

        for (let item of latestNewsItems) {
            // Get Headline
            const latestNewsHead = await item.evaluate(el => el.querySelector('div.col > div.post-item > div.post-item-desc.py-0 h4.alt-font.font-weight-bold.my-2').innerText);
            // Get Body
            const latestNewsBody = await item.evaluate(el => el.querySelector('div.col div.post-item div.post-item-desc.py-0 div.alt-font.text-secondary.my-2 p').innerText);
            // Get Image
            let latestNewsImage = await item.evaluate(el => el.querySelector('a > div > img.img-cover').src);
            if (latestNewsImage === "https://agenciabrasil.ebc.com.br/sites/default/files/thumbnails/image/loading_v2.gif") {
                latestNewsImage = await item.evaluate(el => el.querySelector('a > div > img.img-cover').dataset.echo);
            };
            // Get Link
            const latestNewsLink = await item.evaluate(el => el.querySelector('a').href);

            // Collate latestNewsData & Push to "data" Array
            const latestNewsObj = {
                headline: latestNewsHead,
                body: latestNewsBody,
                image: latestNewsImage,
                link: latestNewsLink,
            };
            data.push(latestNewsObj);
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


