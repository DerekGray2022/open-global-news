// // // //      TASS (Russia)        ////
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
        await page.goto('https://tass.com/');


        // #region           TOP NEWS ITEM DIVISION
        //  Main News Container
        await page.waitForSelector('#main-news > div > div.main-news__container', { visible: true });
        const topItem = await page.$('#main-news > div > div.main-news__container');

        // Get Headline
        const topItemHead = await topItem.evaluate((el) => el.querySelector('div.main-news__top-1 > a > div.news-preview__body > h1 > span').innerText);
        // Get Link
        const topItemLink = await topItem.evaluate((el) => el.querySelector('div.main-news__top-1 > a').href);
        // Get Image
        const topItemImageFull = await page.evaluate(el => window.getComputedStyle(el).backgroundImage, await page.$('div.main-news__top-1 > a > div.news-preview__photo-wrapper > div'));
        const topItemImage = topItemImageFull.match(/url\("(.*)"/)[1];

        const topItemObj = {
            headline: topItemHead,
            link: topItemLink,
            image: topItemImage,
        };
        data.push(topItemObj);


        // Get Other News items
        const otherItems = await topItem.$$('div.main-news__top-news > a');
        try {
            for (let item of otherItems) {
                //  Get Headline
                const otherHead = await item.evaluate(ele => ele.querySelector('div.news-preview__body > div.news-preview__header > span').innerText);
                // Get Link
                const otherLink = await item.evaluate(ele => ele.href);
                // Get Image
                const otherImageFull = await page.evaluate(el => window.getComputedStyle(el).backgroundImage, await item.$('div.news-preview__photo-wrapper > div'));
                const otherImage = otherImageFull.match(/url\("(.*)"/)[1];

                // Collate Related News Items & Push to "otherItems" Array
                const other = {
                    headline: otherHead,
                    link: otherLink,
                    image: otherImage,
                };
                data.push(other);
            };
        }
        catch (err) {
            return NextResponse.json(
                { error: `No response from Associated Press. : ${err.message}` },
                { status: 400 }
		    );
        };
        //#endregion
        

        //#region       SECONDARY NEWS ITEM DIVISION
        try {
            await page.waitForSelector('#news-list-head > div > div.section-grid__group > div.section-grid__col.section-grid__col-center > div > div', {visible: true});
            const secondaryItems = await page.$$('#news-list-head > div > div.section-grid__group > div.section-grid__col.section-grid__col-center > div > div');
    
            
            for (let item of secondaryItems) {
                // Get Headline
                const secondaryHead = await item.evaluate(el => el.querySelector('a > div.news-preview__body > div.news-preview__header > span').innerText);
                // Get Link
                const secondaryLink = await item.evaluate(el => el.querySelector('a').href);
                // Get Image
                const secondaryImageFull = await page.evaluate(el => window.getComputedStyle(el).backgroundImage, await item.$('a > div.news-preview__photo-wrapper > div'));
                const secondaryImage = secondaryImageFull.match(/url\("(.*)"/)[1];
                console.log(secondaryImage);
    
                // Collate secondaryData & Push to "data" Array
                const secondaryData = {
                    headline: secondaryHead,
                    image: secondaryImage,
                    link: secondaryLink,
                };
                data.push(secondaryData);
            };
        }
        catch (err) {
            return NextResponse.json(
            { error: `Secondary News Items failed to load : ${err.message}` },
            { status: 400 }
            );
        }
        //#endregion

        return NextResponse.json({ data });
    }
    catch (err) {
        return NextResponse.json(
            { error: `Associated Press failed to load : ${err.message}` },
            { status: 400 }
        );
    }
    finally {
        await browser.close();
    };
};



