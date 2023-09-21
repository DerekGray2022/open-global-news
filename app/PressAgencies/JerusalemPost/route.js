// // // //      JERUSALEM POST (Israel)        ////
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
        await page.goto('https://www.jpost.com/');


        //#region           TOP SECTION NEWS ITEMS
        await page.waitForSelector('body > div.container.body-content > div:nth-child(3) > div.left-side-top-story > div > div.top-story-large-item', {visible: true});
        const topItemContainer = await page.$('body > div.container.body-content > div:nth-child(3) > div.left-side-top-story > div > div.top-story-large-item');


        // Get Headline
        const topItemHead = await topItemContainer.evaluate((el) => el.querySelector('a > .top-story-large-item-text-wrap > h3').innerText);
        // Get Body
        const topItemBody = await topItemContainer.evaluate((el) => el.querySelector('a > .top-story-large-item-text-wrap > span').innerText);
        // Get Image
        const topItemImage = await topItemContainer.evaluate((el) => el.querySelector('a > .top-story-large-item-img-wrap > div > img').src);
        // Get Link
        const topItemLink = await topItemContainer.evaluate((el) => el.querySelector('a').href);

        const topItemObj = {
            headline: topItemHead,
            body: topItemBody,
            image: topItemImage,
            link: topItemLink,
        };

        data.push(topItemObj);

        //#endregion


        // #region      TOP SECTION SECONDARY ITEMS
        await page.waitForSelector('body > div.container.body-content > div:nth-child(3) > div.left-side.left-side-top-story > div > div.top-story-small-items-wrap > .top-story-small-item', {visible: true});
        const bottomItemList = await page.$$('body > div.container.body-content > div:nth-child(3) > div.left-side.left-side-top-story > div > div.top-story-small-items-wrap > .top-story-small-item');

        try {
            for (let item of bottomItemList) {
                //  Get Headline
                const bottomItemHead = await item.evaluate(ele => ele.querySelector('a > div.top-story-small-item-title-wrap > h3').innerText);
                //  Get Image
                const bottomItemImage = await item.evaluate(ele => ele.querySelector('a > div.top-story-small-item-img > img').src);
                // Get Link
                const bottomItemLink = await item.evaluate(ele => ele.querySelector('a').href);

                //  Create bottomItem Object
                const bottomItemObj = {
                        headline: bottomItemHead,
                        image: bottomItemImage,
                        link: bottomItemLink,
                };
                data.push(bottomItemObj);
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

        // #endregion


        // #region      TOP NEWS SECTION HEAD ITEM
        await page.waitForSelector('body > div.container.body-content > div:nth-child(4) > div.left-side > div.category-five-articles-wrap > div.category-five-articles-large-item', {visible: true});
        const topStoryContainer = await page.$('body > div.container.body-content > div:nth-child(4) > div.left-side > div.category-five-articles-wrap > div.category-five-articles-large-item');


        // Get Headline
        const topStoryHead = await topStoryContainer.evaluate((el) => el.querySelector('div > a > h3').innerText);
        // Get Image
        const topStoryImage = await topStoryContainer.evaluate((el) => el.querySelector('a > div > img').dataset.original);
        // Get Link
        const topStoryLink = await topStoryContainer.evaluate((el) => el.querySelector('a').href);

        const topStoryObj = {
            headline: topStoryHead,
            image: topStoryImage,
            link: topStoryLink,
        };

        data.push(topStoryObj);

        // #endregion


        // #region      TOP NEWS SECONDARY ITEMS
        await page.waitForSelector('body > div.container.body-content > div:nth-child(4) > div.left-side > div > div.category-five-articles-small-items-wrap > div', {visible: true});
        const topStoryExtraList = await page.$$('body > div.container.body-content > div:nth-child(4) > div.left-side > div > div.category-five-articles-small-items-wrap > div');

        try {
            for (let item of topStoryExtraList) {
                try {
                    //  Get Headline
                    const topStoryExtraHead = await item.evaluate(ele => ele.querySelector('a > div.category-five-articles-small-item-text-wrap > h3').innerText);
                    // Get Link
                    const topStoryExtraLink = await item.evaluate(ele => ele.querySelector('a').href);

                    //  Create topStoryExtra Object
                    const topStoryExtraObj = {
                            headline: topStoryExtraHead,
                            link: topStoryExtraLink,
                    };
                    data.push(topStoryExtraObj);
                }
                catch (err) {
                    //  Get Headline
                    const topStoryExtraHead = await item.evaluate(ele => ele.querySelector('a > h3').innerText);
                    // Get Link
                    const topStoryExtraLink = await item.evaluate(ele => ele.querySelector('a').href);

                    //  Create topStoryExtra Object
                    const topStoryExtraObj = {
                            headline: topStoryExtraHead,
                            link: topStoryExtraLink,
                    };
                    data.push(topStoryExtraObj);
                };
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

        // #endregion
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




