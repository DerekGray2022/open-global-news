// // // //      ATHENS-MACEDONIAN NEWS AGENCY (Greece)        ////
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
        await page.goto('https://www.amna.gr/en');


        // #region           HEADLINE ITEM DIVISION
        await page.waitForSelector('html > body > div.ng-scope > div > section > div > div.mainWrapper > div > div.mainCol > div:nth-child(1) > div.contentCol > div.ng-scope > div.imageBackGradient', {visible: true});
        const headlineItem = await page.$('html > body > div.ng-scope > div > section > div > div.mainWrapper > div > div.mainCol > div:nth-child(1) > div.contentCol > div.ng-scope > div.imageBackGradient');

        // Get Headline
        const headlineItemHead = await headlineItem.evaluate((el) => el.querySelector('div.imageTitleWrap > div.imageTitle > a > h2.ng-binding').innerText);
        // Get Image
        const headlineItemImage = await headlineItem.evaluate((el) => el.querySelector('a > img').src);
        // Get Link
        const headlineItemLink = await headlineItem.evaluate((el) => el.querySelector('a').href);

        // Push Collated Data &  to "data" Array
        const headlineItemObj = {
            headline: headlineItemHead,
            image: headlineItemImage,
            link: headlineItemLink,
        };
        data.push(headlineItemObj);

        //#endregion



        //#region           TOP MIDDLE ITEMS DIVISION
        await page.waitForSelector('html > body > div.ng-scope > div > section > div > div.mainWrapper > div > div.mainCol > div:nth-child(1) > div.contentCol > div.ng-scope > div.position2-3WrapAlt > div', {visible: true});
        const topMiddleItems = await page.$$('html > body > div.ng-scope > div > section > div > div.mainWrapper > div > div.mainCol > div:nth-child(1) > div.contentCol > div.ng-scope > div.position2-3WrapAlt > div');

        for (let item of topMiddleItems) {
            // Get Headline
            const topMiddleHead = await item.evaluate(el => el.querySelector('div.imageTitle > a > h3.ng-binding').innerText);
            // Get Image
            const topMiddleImage = await item.evaluate(el => el.querySelector('a > img').src);
            // Get Link
            const topMiddleLink = await item.evaluate(el => el.querySelector('a').href);

            // Collate topMiddleData & Push to "data" Array
            const topMiddleObj = {
                headline: topMiddleHead,
                image: topMiddleImage,
                link: topMiddleLink,
            };

            data.push(topMiddleObj);
        };
        
        //#endregion



        //#region           TOP BOTTOM ITEMS DIVISION
        await page.waitForSelector('html > body > div.ng-scope > div > section > div > div.mainWrapper > div > div.mainCol > div:nth-child(2) > div.newsContentCol > div.newsGrid > div.newsGridItem', {visible: true});
        const topBottomItems = await page.$$('html > body > div.ng-scope > div > section > div > div.mainWrapper > div > div.mainCol > div:nth-child(2) > div.newsContentCol > div.newsGrid > div.newsGridItem');

        for (let item of topBottomItems) {
            // Get Headline
            const topBottomHead = await item.evaluate(el => el.querySelector('div.imageTitle > a > h3.ng-binding').innerText);
            // Get Image
            const topBottomImage = await item.evaluate(el => el.querySelector('a > img').src);
            // Get Link
            const topBottomLink = await item.evaluate(el => el.querySelector('a').href);

            // Collate topBottomData & Push to "data" Array
            const topBottomObj = {
                headline: topBottomHead,
                image: topBottomImage,
                link: topBottomLink,
            };

            data.push(topBottomObj);
        };
        
        //#endregion



        // #region           BOTTOM MAIN ITEM DIVISION
        await page.waitForSelector('html > body > div.ng-scope > div > section > div > div.mainWrapper > div > div.mainCol > div:nth-child(4) > div.sectionContentCol', {visible: true});
        const bottomMainItem = await page.$('html > body > div.ng-scope > div > section > div > div.mainWrapper > div > div.mainCol > div:nth-child(4) > div.sectionContentCol');

        // Get Headline
        const bottomMainItemHead = await bottomMainItem.evaluate((el) => el.querySelector('div.sectionWideWrap > div.sectionWideTitle > a').innerText);
        // Get Body
        const bottomMainItemBody = await bottomMainItem.evaluate((el) => el.querySelector('div.sectionWideWrap > div.sectionWideAbstr > a').innerText);
        // Get Image
        const bottomMainItemImage = await bottomMainItem.evaluate((el) => el.querySelector('div.sectionWideImg > a > img').src);
        // Get Link
        const bottomMainItemLink = await bottomMainItem.evaluate((el) => el.querySelector('div.sectionWideImg > a').href);

        // Push Collated Data &  to "data" Array
        const bottomMainItemObj = {
            headline: bottomMainItemHead,
            body: bottomMainItemBody,
            image: bottomMainItemImage,
            link: bottomMainItemLink,
        };

        data.push(bottomMainItemObj);

        //#endregion



        //#region           BOTTOM OTHER ITEMS DIVISION
        await page.waitForSelector('html > body > div.ng-scope > div > section > div > div.mainWrapper > div > div.mainCol > div:nth-child(5) > div.newsContentCol > div.newsGrid > div.newsGridItem', {visible: true});
        const bottomOtherItems = await page.$$('html > body > div.ng-scope > div > section > div > div.mainWrapper > div > div.mainCol > div:nth-child(5) > div.newsContentCol > div.newsGrid > div.newsGridItem');

        for (let item of bottomOtherItems) {
            // Get Headline
            const bottomOtherHead = await item.evaluate(el => el.querySelector('div.imageTitle > a > h3').innerText);
            // Get Image
            const bottomOtherImage = await item.evaluate(el => el.querySelector('a > img').src);
            // Get Link
            const bottomOtherLink = await item.evaluate(el => el.querySelector('a').href);

            // Collate bottomOtherData & Push to "data" Array
            const bottomOtherObj = {
                headline: bottomOtherHead,
                image: bottomOtherImage,
                link: bottomOtherLink,
            };

            data.push(bottomOtherObj);
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




