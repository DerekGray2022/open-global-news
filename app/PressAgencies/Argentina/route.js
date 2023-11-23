// // // //      Têlam (Argentina)        ////
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
        await page.goto('https://www.telam.com.ar/');


        // #region           TOP ITEM DIVISION
        await page.waitForSelector('html > body > div.wrapper-sections > section#_qb1bgr3q3 > div.container-xl > div.fix-row-overlay > div.col-lg-6 > div.row > div.t-blk > div.nota.templ-0', {visible: true});
        const topItem = await page.$('html > body > div.wrapper-sections > section#_qb1bgr3q3 > div.container-xl > div.fix-row-overlay > div.col-lg-6 > div.row > div.t-blk > div.nota.templ-0');

        // Get Headline
        const topItemHead = await topItem.evaluate((el) => el.querySelector('div.content > h1 > a').innerText);
        // Get Body
        const topItemBody = await topItem.evaluate((el) => el.querySelector('div.content > p').innerText);
        // Get Image
        const topItemImage = await topItem.evaluate((el) => el.querySelector('div.image > a > figure > img').src);
        // Get Link
        const topItemLink = await topItem.evaluate((el) => el.querySelector('div.image > a').href);

        // Push Collated Data &  to "data" Array
        const topItemObj = {
            headline: topItemHead,
            body: topItemBody,
            image: topItemImage,
            link: topItemLink,
        };

        data.push(topItemObj); 

        //#endregion


       //#region           LIST ONE ITEMS DIVISION
        await page.waitForSelector('html > body > div.wrapper-sections > section#_qb1bgr3q3 > div.container-xl > div.fix-row-overlay > div:nth-of-type(2) > div.row > div.photonote', {visible: true});
        const listOneItems = await page.$$('html > body > div.wrapper-sections > section#_qb1bgr3q3 > div.container-xl > div.fix-row-overlay > div:nth-of-type(2) > div.row > div.photonote');

        for (let item of listOneItems) {
            // Get Headline
            const listOneHead = await item.evaluate(el => el.querySelector('div.nota > div.content > h3 > a').innerText);
            // Get Image
            const listOneImage = await item.evaluate(el => el.querySelector('div.nota > div.image > a > figure > img').src);
            // Get Link
            const listOneLink = await item.evaluate(el => el.querySelector('div.nota > div.image > a').href);

            // Collate listOneData & Push to "data" Array
            const listOneObj = {
                headline: listOneHead,
                image: listOneImage,
                link: listOneLink,
            };

            data.push(listOneObj);
        };
        
        //#endregion


       //#region           LIST TWO ITEMS DIVISION
        await page.waitForSelector('html > body > div.wrapper-sections > section#_qb1bgr3q3 > div.container-xl > div.fix-row-overlay > div:nth-of-type(3) > div.row > div.photonote', {visible: true});
        const listTwoItems = await page.$$('html > body > div.wrapper-sections > section#_qb1bgr3q3 > div.container-xl > div.fix-row-overlay > div:nth-of-type(3) > div.row > div.photonote');

        for (let item of listTwoItems) {
            // Get Headline
            const listTwoHead = await item.evaluate(el => el.querySelector('div.nota > div.content > h3 > a').innerText);
            // Get Image
            const listTwoImage = await item.evaluate(el => el.querySelector('div.nota > div.image > a > figure > img').src);
            // Get Link
            const listTwoLink = await item.evaluate(el => el.querySelector('div.nota > div.image > a').href);

            // Collate listTwoData & Push to "data" Array
            const listTwoObj = {
                headline: listTwoHead,
                image: listTwoImage,
                link: listTwoLink,
            };

            data.push(listTwoObj);
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




