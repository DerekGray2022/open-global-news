// // // //      YONHAP NEWS AGENCY (South Korea)        ////
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
        await page.goto('https://en.yna.co.kr/news');



        //#region           LIST ITEMS DIVISION
        await page.waitForSelector('html > body > div.wrap-container > div#container > section.sub-section > div.sub-content > div.smain-list-type01 > ul > li', {visible: true});
        const listItems = await page.$$('html > body > div.wrap-container > div#container > section.sub-section > div.sub-content > div.smain-list-type01 > ul > li');

        for (let item of listItems) {
            // Get Headline
            const listHead = await item.evaluate(el => el.querySelector('article > div.txt-con > h2.tit > a').innerText);
            // Get Body
            const listBody = await item.evaluate(el => el.querySelector('article > div.txt-con > span.lead').innerText);
            // Get Image
            let listImage
            try {
                listImage = await item.evaluate(el => el.querySelector('article > figure.img-cover > a > img').src);
            }
            catch (error) {
                listImage = "";
            };
            // Get Link
            let listLink
            try {
                listLink = await item.evaluate(el => el.querySelector('article > figure.img-cover > a').href);
            }
            catch (error) {
                listLink = "";
            };

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




