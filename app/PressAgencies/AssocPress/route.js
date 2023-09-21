// // // //      ASSOCIATED PRESS (USA)        ////
const { NextResponse } = require("next/server");
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
        await page.goto('https://www.apnews.com/');


        // #region           TOP STORY DIVISION
        await page.waitForSelector('div.PageListStandardE', {visible: true});
        const topstory = await page.$('div.PageListStandardE');

        // Get Headline
        const topstoryHead = await topstory.evaluate((el) => el.querySelector('.PagePromo-title > a > span').innerText);
        // Get Body
        const topstoryBody = await topstory.evaluate((el) => el.querySelector('.PagePromo-description').innerText);
        // Get Image
        const topstoryImage = await topstory.evaluate((el) => el.querySelector('picture > img').src);
        // Get Link
        const topstoryLink = await topstory.evaluate((el) => el.querySelector('.PagePromo-title > a').href);

        // Get Related Stories
        const topstoryRelated = await topstory.$$('.PageListStandardE-items-secondary > .PagePromo > .PagePromo-content > .PagePromo-title > .Link');
        try {
            for (let story of topstoryRelated) {
                //  Get Headline
                const otherHead = await story.evaluate(ele => ele.querySelector('.PagePromoContentIcons-text').innerText);
                // Get Link
                const otherLink = await story.evaluate(ele => ele.href);

                // Collate Related Stories & Push to "related" Array
                const relate = {
                    headline: otherHead,
                    link: otherLink,
                };
                related.push(relate);
            };
        }
        catch (err) {
            data.push({
            headline: "No more items currently unavailable."
            });
            return NextResponse.json(
                {data},
                { status: 200 }
            );
        };

        // Push Collated Data &  to "data" Array
        const topstoryObj = {
            headline: topstoryHead,
            body: topstoryBody,
            image: topstoryImage,
            link: topstoryLink,
            related
        };
        data.push(topstoryObj);

        //#endregion



        //#region           OTHER STORIES DIVISION
        await page.waitForSelector('body > div.Page-content > main > div:nth-child(1) > div > div:nth-child(1) > bsp-list-loadmore > div.PageList-items > .PageList-items-item', {visible: true});
        const otherStories = await page.$$('body > div.Page-content > main > div:nth-child(1) > div > div:nth-child(1) > bsp-list-loadmore > div.PageList-items > .PageList-items-item');

        
        for (let story of otherStories) {
            // Get Headline
            const otherHead = await story.evaluate(el => el.querySelector('div.PagePromo-content > div > a > span').innerText);
            // Get Image
            const otherImage = await story.evaluate(el => el.querySelector('.PagePromo-media > a > picture > img').src);
            // Get Link
            const otherLink = await story.evaluate(el => el.querySelector('.PagePromo-media > a').href);

            // Collate otherData & Push to "data" Array
            const otherObj = {
                headline: otherHead,
                image: otherImage,
                link: otherLink,
            };
            data.push(otherObj);
        };

        //#endregion



        // #region           MORE NEWS TOP ITEM DIVISION
        await page.waitForSelector('html > body > div.Page-content > main > div > div > div > div > div > div.PageList-items-first', {visible: true});
        const moreNewsTop = await page.$('html > body > div.Page-content > main > div > div > div > div > div > div.PageList-items-first');

        // Get Headline
        const moreNewsTopHead = await moreNewsTop.evaluate((el) => el.querySelector('div.PagePromo > div.PagePromo-content > div.PagePromo-title > a.Link > span.PagePromoContentIcons-text').innerText);
        // Get Image
        const moreNewsTopImage = await moreNewsTop.evaluate((el) => el.querySelector('div.PagePromo > div.PagePromo-media > a.Link > picture > img.Image').src);
        // Get Link
        const moreNewsTopLink = await moreNewsTop.evaluate((el) => el.querySelector('div.PagePromo > div.PagePromo-media > a.Link').href);

        // Push Collated Data &  to "data" Array
        const moreNewsTopObj = {
            headline: moreNewsTopHead,
            image: moreNewsTopImage,
            link: moreNewsTopLink,
        };
        data.push(moreNewsTopObj);

        //#endregion



        //#region           MORE NEWS LIST DIVISION
        await page.waitForSelector('html > body > div > main > div > div > div.TwoColumnContainer7030-column > div > div > ol > li', {visible: true});
        const moreNewsStories = await page.$$('html > body > div > main > div > div > div.TwoColumnContainer7030-column > div > div > ol > li');

        
        for (let story of moreNewsStories) {
            // Get Headline
            const moreNewsHead = await story.evaluate(el => el.querySelector('a').innerText);
            // Get Link
            const moreNewsLink = await moreNewsTop.evaluate((el) => el.querySelector('a').href);

            // Collate moreNewsData & Push to "data" Array
            const moreNewsObj = {
                headline: moreNewsHead,
                link: moreNewsLink,
            };

            data.push(moreNewsObj);
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




