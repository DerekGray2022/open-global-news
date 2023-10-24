// // // //      AFRICAN NEWS AGENCY (South Africa)        ////
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
        await page.goto('https://www.africannewsagency.com/category/news-and-politics/');


        // #region           TOP ITEM DIVISION
        await page.waitForSelector('html > body > div.main-wrap > div.slider-container > div.content-wrap > div.container > div.row > div > div.listing > div.mg-col-1', {visible: true});
        const topItem = await page.$('html > body > div.main-wrap > div.slider-container > div.content-wrap > div.container > div.row > div > div.listing > div.mg-col-1');

        // Get Headline
        const topItemHead = await topItem.evaluate((el) => el.querySelector('article > div.item-content > a').title);
        // Get Background Image
        const image01 = await topItem.evaluate((el) => el.querySelector('article > div.item-content > a').style.backgroundImage);
        const topItemImage = image01.split('"')[1];
        // Get Link
        const topItemLink = await topItem.evaluate((el) => el.querySelector('article > div.item-content > a').href);

        // Push Collated Data &  to "data" Array
        const topItemObj = {
            headline: topItemHead,
            image: topItemImage,
            link: topItemLink,
        };

        data.push(topItemObj); 

        //#endregion


        // #region           SUB TOP ITEM DIVISION
        await page.waitForSelector('html > body > div.main-wrap > div.slider-container > div.content-wrap > div.container > div.row > div > div.listing > div.mg-col-2', {visible: true});
        const subTopItem = await page.$('html > body > div.main-wrap > div.slider-container > div.content-wrap > div.container > div.row > div > div.listing > div.mg-col-2');

        // Get Headline
        const subTopItemHead = await subTopItem.evaluate((el) => el.querySelector('div.mg-row-1 > article > div.item-content > a').title);
        // Get Background Image
        const image02 = await subTopItem.evaluate((el) => el.querySelector('div.mg-row-1 > article > div.item-content > a').style.backgroundImage);
        const subTopItemImage = image02.split('"')[1];
        // Get Link
        const subTopItemLink = await subTopItem.evaluate((el) => el.querySelector('div.mg-row-1 > article > div.item-content > a').href);

        // Push Collated Data &  to "data" Array
        const subTopItemObj = {
            headline: subTopItemHead,
            image: subTopItemImage,
            link: subTopItemLink,
        };

        data.push(subTopItemObj); 

        //#endregion



        //#region           SUB TOP LIST ITEMS DIVISION
        await page.waitForSelector('html > body > div.main-wrap > div.slider-container > div.content-wrap > div.container > div.row > div > div.listing > div.mg-col-2 > div.mg-row-2 > div', {visible: true});
        const subTopListItems = await page.$$('html > body > div.main-wrap > div.slider-container > div.content-wrap > div.container > div.row > div > div.listing > div.mg-col-2 > div.mg-row-2 > div');

        for (let item of subTopListItems) {
            // Get Headline
            const subTopListHead = await item.evaluate(el => el.querySelector('article > div.item-content > a').title);
            // Get Background Image
            const image01 = await subTopItem.evaluate((el) => el.querySelector('article > div.item-content > a').style.backgroundImage);
            const subTopListImage = image01.split('"')[1];
            // Get Link
            const subTopListLink = await item.evaluate(el => el.querySelector('article > div.item-content > a').href);

            // Collate subTopListData & Push to "data" Array
            const subTopListObj = {
                headline: subTopListHead,
                image: subTopListImage,
                link: subTopListLink,
            };

            data.push(subTopListObj);
        };
        
        //#endregion



        //#region           NEWS POLITICS ITEMS DIVISION
        await page.waitForSelector('html > body > div.main-wrap > div.content-wrap > main#content > div.container > div.main-section > div.content-column > div.bs-pagination-wrapper > div.listing > article', {visible: true});
        const newsPoliticsItems = await page.$$('html > body > div.main-wrap > div.content-wrap > main#content > div.container > div.main-section > div.content-column > div.bs-pagination-wrapper > div.listing > article');

        for (let item of newsPoliticsItems) {
            // Get Headline
            const newsPoliticsHead = await item.evaluate(el => el.querySelector('div.item-inner > h2 > a').innerText);
            // Get Body
            const newsPoliticsBody = await item.evaluate(el => el.querySelector('div.item-inner > div.post-summary').innerText);
            // Get Background Image
            let image01 = await item.evaluate((el) => el.querySelector('div.item-inner > div.featured > a.img-holder').style.backgroundImage);
            let newsPoliticsImage = image01.split('"')[1];
            if (newsPoliticsImage === undefined) {
                newsPoliticsImage = await item.evaluate((el) => el.querySelector('div.item-inner > div.featured > a.img-holder').dataset.src);
            };
            // Get Link
            const newsPoliticsLink = await item.evaluate(el => el.querySelector('div.item-inner > h2 > a').href);

            // Collate newsPoliticsData & Push to "data" Array
            const newsPoliticsObj = {
                headline: newsPoliticsHead,
                body: newsPoliticsBody,
                image: newsPoliticsImage,
                link: newsPoliticsLink,
            };

            data.push(newsPoliticsObj);
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




