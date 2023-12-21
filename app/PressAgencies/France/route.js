// // // //      FRANCE 24 (France)        ////
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
        await page.goto('https://www.france24.com/en/');


        // #region           TOP ITEM DIVISION
        await page.waitForSelector('html > body > main > div#main-content > section.t-content__section-pb > div.o-banana-split > div.o-layout-list', {visible: true});
        const topItem = await page.$('html > body > main > div#main-content > section.t-content__section-pb > div.o-banana-split > div.o-layout-list');

        // Get Headline
        const topItemHead = await topItem.evaluate((el) => el.querySelector('div.o-layout-list__item > div.m-item-list-article > div.m-item-list-article__wrapper > div.article__infos > div.article__title > a > h2').innerText);
        // Get Image
        const topItemImage = await topItem.evaluate((el) => el.querySelector('div.o-layout-list__item > div.m-item-list-article > div.m-item-list-article__wrapper > a.article__figure-wrapper > figure.m-figure.m-figure--16x9 > picture > img.m-figure__img.lazy').src);
        // Get Link
        const topItemLink = await topItem.evaluate((el) => el.querySelector('div.o-layout-list__item > div.m-item-list-article > div.m-item-list-article__wrapper > a.article__figure-wrapper').href);

        // Get Related Stories
        const topItemRelated = await topItem.$$('div.o-layout-list__item > div.m-item-list-article > div.m-list-main-related > a.m-list-main-related__article');
        for (let item of topItemRelated) {
            //  Get Headline
            const otherHead = await item.evaluate(ele => ele.querySelector('h2').innerText);
            // Get Link
            const otherLink = await item.evaluate(ele => ele.href);

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
        await page.waitForSelector('html > body > main > div#main-content > section.t-content__section-pb > div.o-banana-split > div.o-layout-list > div.l-m-100', {visible: true});
        const topListItems = await page.$$('html > body > main > div#main-content > section.t-content__section-pb > div.o-banana-split > div.o-layout-list > div.l-m-100');

        for (let item of topListItems) {
            // Get Headline
            const topListHead = await item.evaluate(el => el.querySelector('div.m-item-list-article > div.m-item-list-article__wrapper > div.article__infos > div.article__title > a > h2').innerText);
            // Get Image
            const topListImage = await item.evaluate(el => el.querySelector('div.m-item-list-article > div.m-item-list-article__wrapper > a.article__figure-wrapper > figure.m-figure > picture > img.m-figure__img.lazy').src);
            // Get Link
            const topListLink = await item.evaluate(el => el.querySelector('div.m-item-list-article > div.m-item-list-article__wrapper > a.article__figure-wrapper ').href);

            // Collate topListData & Push to "data" Array
            const topListObj = {
                headline: topListHead,
                image: topListImage,
                link: topListLink,
            };

            data.push(topListObj);
        };
        
        //#endregion



        //#region           SECONDARY ITEMS DIVISION
        await page.waitForSelector('html > body> main > div#main-content > section.t-content__section-pb > div.o-layout-list > div:nth-of-type(-n + 5)', {visible: true});
        const secondaryItems = await page.$$('html > body> main > div#main-content > section.t-content__section-pb > div.o-layout-list > div:nth-of-type(-n + 5)');

        for (let item of secondaryItems) {
            // Get Headline
            const secondaryHead = await item.evaluate(el => el.querySelector('div.m-item-list-article > div.m-item-list-article__wrapper > div.article__infos > div.article__title > a > h2').innerText);
            // Get Image
            const secondaryImage = await item.evaluate(el => el.querySelector('div.m-item-list-article > div.m-item-list-article__wrapper > a.article__figure-wrapper > figure.m-figure > picture > img.m-figure__img').src);
            // Get Link
            const secondaryLink = await item.evaluate(el => el.querySelector('div.m-item-list-article > div.m-item-list-article__wrapper > a.article__figure-wrapper ').href);

            // Collate secondaryData & Push to "data" Array
            const secondaryObj = {
                headline: secondaryHead,
                image: secondaryImage,
                link: secondaryLink,
            };

            data.push(secondaryObj);
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




