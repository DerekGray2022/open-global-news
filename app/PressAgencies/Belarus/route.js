// // // //      BELARUSIAN TELEGRAPH AGENCY (Belarus)        ////
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
        await page.goto('https://eng.belta.by/');


        // #region           TOP ITEM DIVISION
        await page.waitForSelector('html > body > div.all.first_page > div.main_block > div.main_news1', {visible: true});
        const topItem = await page.$('html > body > div.all.first_page > div.main_block > div.main_news1');

        // Get Headline
        const topItemHead = await topItem.evaluate((el) => el.querySelector('div > a').title);
        // Get Body
        const topItemBody = await topItem.evaluate((el) => el.querySelector('div > span').innerText);
        // Get Image
        const topItemImage = await topItem.evaluate((el) => el.querySelector('a > img').src);
        // Get Link
        const topItemLink = await topItem.evaluate((el) => el.querySelector('a').href);

        // Push Collated Data &  to "data" Array
        const topItemObj = {
            headline: topItemHead,
            body: topItemBody,
            image: topItemImage,
            link: topItemLink,
        };

        data.push(topItemObj); 

        //#endregion



        //#region           TOP LIST ITEMS DIVISION
        await page.waitForSelector('html > body > div.all.first_page > div.main_block > div.main_news2 > div.main_news2_item', {visible: true});
        const topListItems = await page.$$('html > body > div.all.first_page > div.main_block > div.main_news2 > div.main_news2_item');

        for (let item of topListItems) {
            // Get Headline
            const topListHead = await item.evaluate(el => el.querySelector('a:nth-of-type(2)').title);
            // Get Image
            const topListImage = await item.evaluate(el => el.querySelector('a:nth-of-type(1) > img').src);
            // Get Link
            const topListLink = await item.evaluate(el => el.querySelector('a').href);

            // Collate topListData & Push to "data" Array
            const topListObj = {
                headline: topListHead,
                image: topListImage,
                link: topListLink,
            };

            data.push(topListObj);
        };
        
        //#endregion


        // #region           SNAPSHOT TOP ITEM DIVISION
        await page.waitForSelector('html > body > div.all.first_page > div.fp_block > div.fp_photonews > a.fp_ph_main', {visible: true});
        const snapshotTopItem = await page.$('html > body > div.all.first_page > div.fp_block > div.fp_photonews > a.fp_ph_main');

        // Get Headline
        const snapshotTopItemHead = await snapshotTopItem.evaluate((el) => el.querySelector('span').innerText);
        // Get Image
        const snapshotTopItemImage = await snapshotTopItem.evaluate((el) => el.querySelector('a > img').src);
        // Get Link
        const snapshotTopItemLink = await snapshotTopItem.evaluate((el) => el.href);

        // Push Collated Data &  to "data" Array
        const snapshotTopItemObj = {
            headline: snapshotTopItemHead,
            image: snapshotTopItemImage,
            link: snapshotTopItemLink,
        };

        data.push(snapshotTopItemObj); 

        //#endregion



        //#region           SNAPSHOT LIST ITEMS DIVISION
        await page.waitForSelector('html > body > div.all.first_page > div.fp_block > div.fp_photonews > a.fp_ph_item', {visible: true});
        const snapshotListItems = await page.$$('html > body > div.all.first_page > div.fp_block > div.fp_photonews > a.fp_ph_item');

        for (let item of snapshotListItems) {
            // Get Headline
            const snapshotListHead = await item.evaluate(el => el.title);
            // Get Image
            const snapshotListImage = await item.evaluate(el => el.querySelector('img').src);
            // Get Link
            const snapshotListLink = await item.evaluate(el => el.href);

            // Collate snapshotListData & Push to "data" Array
            const snapshotListObj = {
                headline: snapshotListHead,
                image: snapshotListImage,
                link: snapshotListLink,
            };

            data.push(snapshotListObj);
        };
        
        //#endregion


        // #region           POLITICS TOP ITEM DIVISION
        await page.waitForSelector('html > body > div.all.first_page > div.fp_block > div.main_in_pr', {visible: true});
        const politicsTopItem = await page.$('html > body > div.all.first_page > div.fp_block > div.main_in_pr');

        // Get Headline
        const politicsTopItemHead = await politicsTopItem.evaluate((el) => el.querySelector('a:nth-of-type(2)').title);
        // Get Body
        const politicsTopItemBody = await politicsTopItem.evaluate((el) => el.querySelector('div').innerText);
        // Get Image
        const politicsTopItemImage = await politicsTopItem.evaluate((el) => el.querySelector('a:nth-of-type(1) > img').src);
        // Get Link
        const politicsTopItemLink = await politicsTopItem.evaluate((el) => el.querySelector('a').href);

        // Push Collated Data &  to "data" Array
        const politicsTopItemObj = {
            headline: politicsTopItemHead,
            body: politicsTopItemBody,
            image: politicsTopItemImage,
            link: politicsTopItemLink,
        };

        data.push(politicsTopItemObj); 

        //#endregion



        //#region           POLITICS LIST ITEMS DIVISION
        await page.waitForSelector('html > body > div.all.first_page > div.fp_block > div.main2_in_pr.lenta_left > div.fp_news_pr_item', {visible: true});
        const politicsListItems = await page.$$('html > body > div.all.first_page > div.fp_block > div.main2_in_pr.lenta_left > div.fp_news_pr_item');

        for (let item of politicsListItems) {
            // Get Headline
            const politicsListHead = await item.evaluate(el => el.querySelector('a:nth-of-type(2)').title);
            // Get Image
            const politicsListImage = await item.evaluate(el => el.querySelector('a:nth-of-type(1) > img').src);
            // Get Link
            const politicsListLink = await item.evaluate(el => el.querySelector('a').href);

            // Collate politicsListData & Push to "data" Array
            const politicsListObj = {
                headline: politicsListHead,
                image: politicsListImage,
                link: politicsListLink,
            };

            data.push(politicsListObj);
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




