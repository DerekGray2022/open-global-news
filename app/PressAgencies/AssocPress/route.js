// // // //      ASSOCIATED PRESS (USA)        ////
const { NextResponse } = require("next/server");
const puppeteer = require('puppeteer');

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
        const topstoryImage = await topstory.evaluate((el) => el.querySelector(' picture > img').src);
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
            return NextResponse.json(
                { error: `No response from Associated Press. : ${err.message}` },
                { status: 400 }
		    );
        };

        // Push Collated Data &  to "data" Array
        data.push({
            headline: topstoryHead,
            body: topstoryBody,
            image: topstoryImage,
            link: topstoryLink,
            related
        });
        //#endregion



        //#region           OTHER STORIES DIVISION
        await page.waitForSelector('body > div.Page-content > main > div:nth-child(1) > div > div:nth-child(1) > bsp-list-loadmore > div.PageList-items > .PageList-items-item', {visible: true});
        const otherStories = await page.$$('body > div.Page-content > main > div:nth-child(1) > div > div:nth-child(1) > bsp-list-loadmore > div.PageList-items > .PageList-items-item');

        
        for (let story of otherStories) {
            // Get Headline
            const otherHead = await story.evaluate(el => el.querySelector('div.PagePromo-content > div > a > span').innerText);
            // Get Image
            const otherImage = await story.evaluate(el => el.querySelector('.PagePromo-media > a > picture > img').src);
            // Get Image
            const otherLink = await story.evaluate(el => el.querySelector('.PagePromo-media > a').href);

            // Collate otherData & Push to "data" Array
            const otherData = {
                headline: otherHead,
                body: null,
                image: otherImage,
                link: otherLink,
                related: null,
            };
            data.push(otherData);
        };
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
        if (browser) {
            await browser.close();
        };
    };
};




