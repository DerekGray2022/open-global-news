// // // //      SABA NEWS AGENCY (Yemen)        ////
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
        await page.goto('https://www.saba.ye/en');


        // #region           TOP ITEM DIVISION
        await page.waitForSelector('html > body > div > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td.style3', {visible: true});
        const topItem = await page.$('html > body > div > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td.style3');

        // Get Headline
        const topItemHead = await topItem.evaluate((el) => el.querySelector('p:nth-child(2) > a').innerText);
        // Get Body
        const topItemBody = await topItem.evaluate((el) => el.querySelector('p.mainText').innerText);
        // Get Image
        const topItemImage = await topItem.evaluate((el) => el.querySelector('p:nth-child(1) > img').src);
        // Get Link
        const topItemLink = await topItem.evaluate((el) => el.querySelector('p:nth-child(2) > a').href);

        // Push Collated Data &  to "data" Array
        const topItemObj = {
            headline: topItemHead,
            body: topItemBody,
            image: topItemImage,
            link: topItemLink,
        };

        data.push(topItemObj); 

        //#endregion



        //#region           LATEST ITEMS DIVISION
        await page.waitForSelector('html > body > div > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table.TabelBorderBlack > tbody > tr > td > table > tbody > tr > td > table > tbody > tr', {visible: true});
        const latestItems = await page.$$('html > body > div > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table.TabelBorderBlack > tbody > tr > td > table > tbody > tr > td > table > tbody > tr');

        for (let item of latestItems) {
            try {
                // Get Headline
                const latestHead = await item.evaluate(el => el.querySelector('td.style1 > a').innerText);
                // Get Link
                const latestLink = await item.evaluate(el => el.querySelector('td.style1 > a').href);

                // Collate latestData & Push to "data" Array
                const latestObj = {
                    headline: latestHead,
                    link: latestLink,
                };

                data.push(latestObj);
            }
            catch (error) {
                 
            };
        };
        
        //#endregion



        //#region           SECONDARY ITEMS DIVISION
        await page.waitForSelector('html > body > div > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table:nth-child(n + 2):nth-child(-n + 4)', {visible: true});
        const secondaryItems = await page.$$('html > body > div > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > table:nth-child(n + 2):nth-child(-n + 4)');

        for (let item of secondaryItems) {
            // Get Headline
            const secondaryHead = await item.evaluate(el => el.querySelector('tbody > tr > td > table > tbody > tr > td:nth-child(2) > a').innerText);
            // Get Body
            const secondaryBody = await item.evaluate(el => el.querySelector('tbody > tr > td > table > tbody > tr > td:nth-child(2) > div.mainText').innerText);
            // Get Image
            const secondaryImage = await item.evaluate(el => el.querySelector('tbody > tr > td > table > tbody > tr > td:nth-child(1) > img').src);
            // Get Link
            const secondaryLink = await item.evaluate(el => el.querySelector('tbody > tr > td > table > tbody > tr > td:nth-child(2) > a').href);

            // Collate secondaryData & Push to "data" Array
            const secondaryObj = {
                headline: secondaryHead,
                body: secondaryBody,
                image: secondaryImage,
                link: secondaryLink,
            };

            data.push(secondaryObj);
        };
        
        //#endregion



        //#region           VIDEO ITEMS DIVISION
        await page.waitForSelector('html > body > div:nth-of-type(2) > table > tbody > tr > td > table:nth-of-type(2) > tbody > tr > td > table:nth-of-type(3) > tbody > tr:nth-of-type(2) > td:nth-of-type(1) > table > tbody > tr:nth-of-type(2) > td:nth-of-type(2) > table:nth-of-type(5) > tbody > tr > td > div > table > tbody > tr > td > table > tbody > tr:nth-of-type(2) > td', {visible: true});
        const videoItems = await page.$$('html > body > div:nth-of-type(2) > table > tbody > tr > td > table:nth-of-type(2) > tbody > tr > td > table:nth-of-type(3) > tbody > tr:nth-of-type(2) > td:nth-of-type(1) > table > tbody > tr:nth-of-type(2) > td:nth-of-type(2) > table:nth-of-type(5) > tbody > tr > td > div > table > tbody > tr > td > table > tbody > tr:nth-of-type(2) > td');

        for (let item of videoItems) {
            // Get Headline
            const videoHead = await item.evaluate(el => el.querySelector('a.style1').innerText);
            // Get Image
            const videoImage = await item.evaluate(el => el.querySelector('table > tbody > tr > td > a > img').src);
            // Get Link
            const videoLink = await item.evaluate(el => el.querySelector('a.style1').href);

            // Collate videoData & Push to "data" Array
            const videoObj = {
                headline: videoHead,
                image: videoImage,
                link: videoLink,
            };

            data.push(videoObj);
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




