// // // //      PRESS AGENCY (Country)        ////
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
        await page.goto('WebPage');


        // #region           SINGLE ITEM DIVISION
        await page.waitForSelector('Container', {visible: true});
        const singleItem = await page.$('Container');

        // Get Headline
        const singleItemHead = await singleItem.evaluate((el) => el.querySelector('RequiredElement').innerText);
        // Get Body
        const singleItemBody = await singleItem.evaluate((el) => el.querySelector('RequiredElement').innerText);
        // Get Image
        const singleItemImage = await singleItem.evaluate((el) => el.querySelector('RequiredElement').src);
        // Get Link
        const singleItemLink = await singleItem.evaluate((el) => el.querySelector('Required Element').href);

        // Push Collated Data &  to "data" Array
        data.push({
            headline: singleItemHead,
            body: singleItemBody,
            image: singleItemImage,
            link: singleItemLink,
        });

        //#endregion



        //#region           MULTIPLE ITEMS DIVISION
        await page.waitForSelector('Container', {visible: true});
        const multiItems = await page.$$('Container');

        for (let item of multiItems) {
            // Get Headline
            const multiHead = await story.evaluate(el => el.querySelector('RequiredElement').innerText);
            // Get Body
            const multiBody = await story.evaluate(el => el.querySelector('RequiredElement').src);
            // Get Image
            const multiImage = await story.evaluate(el => el.querySelector('RequiredElement').src);
            // Get Image
            const multiLink = await story.evaluate(el => el.querySelector('RequiredElement').href);

            // Collate multiData & Push to "data" Array
            const multiData = {
                headline: multiHead,
                body: multiBody,
                image: multiImage,
                link: multiLink,
            };
            data.push(multiData);
        };
        
        //#endregion

        return NextResponse.json({ data });
    }
    catch (err) {
        return NextResponse.json(
            { error: `Press Agency failed to load : ${err.message}` },
            { status: 400 }
        );
    }
    finally {
        await browser.close();
    };
};




