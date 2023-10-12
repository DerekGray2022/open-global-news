// // // //      DAILY NEWS EGYPT (Egypt)        ////
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
        await page.goto('https://www.dailynewsegypt.com/');


        // #region           TOP ITEM DIVISION
        await page.waitForSelector('html > body > div.site-outer > div.site-wrap > div.elementor-2084 > section.elementor-element-236552b > div.elementor-container > div.elementor-element-1f1a942 > div.elementor-widget-wrap > div.elementor-element-8cd0bd0 > div.elementor-widget-container > div#uid_8cd0bd0 > div.p-wrap', {visible: true});
        const topItem = await page.$('html > body > div.site-outer > div.site-wrap > div.elementor-2084 > section.elementor-element-236552b > div.elementor-container > div.elementor-element-1f1a942 > div.elementor-widget-wrap > div.elementor-element-8cd0bd0 > div.elementor-widget-container > div#uid_8cd0bd0 > div.p-wrap');

        // Get Headline
        const topItemHead = await topItem.evaluate((el) => el.querySelector('div.overlay-text > div.overlay-inner > div.p-content > h2 > a').innerText);
        // Get Image
        const topItemImage = await topItem.evaluate((el) => el.querySelector('div.p-featured > a > img').src);
        // Get Link
        const topItemLink = await topItem.evaluate((el) => el.querySelector('div.p-featured > a').href);
        
        // // GET RELATED ITEMS
        const topitemRelated = await topItem.$$('div.overlay-text > div.overlay-inner > div.block-inner > div');

        for (let item of topitemRelated) {
            //  Get Headline
            const otherHead = await item.evaluate(ele => ele.querySelector('span > a').innerText);
            // Get Link
            const otherLink = await item.evaluate(ele => ele.querySelector('span > a').href);

            // Collate Related Stories & Push to "related" Array
            const relate = {
                headline: otherHead,
                link: otherLink,
            };
            related.push(relate);
        };

        // Push Collated Data &  to "data" Array
        const topItemObj = {
            headline: topItemHead,
            image: topItemImage,
            link: topItemLink,
            related,
        };

        data.push(topItemObj);

        //#endregion



        //#region           TOP LIST ITEMS DIVISION
        await page.waitForSelector('html > body > div.site-outer > div.site-wrap > div.elementor-2084 > section.elementor-element-236552b > div.elementor-container > div.elementor-element-610170a > div.elementor-widget-wrap > div.elementor-element-019593a > div.elementor-widget-container > div#uid_019593a > div.block-inner > div.p-wrap', {visible: true});
        const topListItems = await page.$$('html > body > div.site-outer > div.site-wrap > div.elementor-2084 > section.elementor-element-236552b > div.elementor-container > div.elementor-element-610170a > div.elementor-widget-wrap > div.elementor-element-019593a > div.elementor-widget-container > div#uid_019593a > div.block-inner > div.p-wrap');

        for (let item of topListItems) {
            // Get Headline
            const topListHead = await item.evaluate(el => el.querySelector('div.overlay-holder > div.overlay-wrap > div.p-content > h4 > a').innerText);
            // Get Image
            const topListImage = await item.evaluate(el => el.querySelector('div.overlay-holder > div.p-featured > a > img').src);
            // Get Link
            const topListLink = await item.evaluate(el => el.querySelector('div.overlay-holder > div.p-featured > a').href);

            // Collate topListData & Push to "data" Array
            const topListObj = {
                headline: topListHead,
                image: topListImage,
                link: topListLink,
            };

            data.push(topListObj);
        };
        
        //#endregion



        //#region           POLITICS ITEMS DIVISION
        await page.waitForSelector('html > body > div.site-outer > div.site-wrap > div.elementor-2084 > section.elementor-element-22e5617 > div.elementor-container > div.elementor-element-ed0b1f8 > div.elementor-widget-wrap > div.elementor-element-06c368f > div.elementor-widget-container > div#uid_06c368f > div.block-inner > div.p-wrap', {visible: true});
        const politicsItems = await page.$$('html > body > div.site-outer > div.site-wrap > div.elementor-2084 > section.elementor-element-22e5617 > div.elementor-container > div.elementor-element-ed0b1f8 > div.elementor-widget-wrap > div.elementor-element-06c368f > div.elementor-widget-container > div#uid_06c368f > div.block-inner > div.p-wrap');

        for (let item of politicsItems) {
            // Get Headline
            const politicsHead = await item.evaluate(el => el.querySelector('div.p-content > h4 > a').innerText);
            // Get Image
            const politicsImage = await item.evaluate(el => el.querySelector('div.feat-holder > div.p-featured > a > img').src);
            // Get Link
            const politicsLink = await item.evaluate(el => el.querySelector('div.feat-holder > div.p-featured > a').href);

            // Collate politicsData & Push to "data" Array
            const politicsObj = {
                headline: politicsHead,
                image: politicsImage,
                link: politicsLink,
            };

            data.push(politicsObj);
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




