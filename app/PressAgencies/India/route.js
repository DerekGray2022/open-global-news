// // // //      PRESS TRUST of INDIA (India)        ////
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
        await page.goto('https://www.ptinews.com/');


        // #region           BIG STORY DIVISION
        await page.waitForSelector('html > body > #form1 > .bigstoryimg > #dvMTopLeadDeskTop', {visible: true});
        const bigstoryItem = await page.$('html > body > #form1 > .bigstoryimg > #dvMTopLeadDeskTop');


        // Get Headline
        const bigstoryItemHead = await bigstoryItem.evaluate((el) => el.querySelector('.container-fluid > h1 > a').innerText);
        // Get Body
        const bigstoryItemBody = await bigstoryItem.evaluate((el) => el.querySelector('div.container-fluid > div#ContentPlaceHolder1_toplead_dvTopLeadHead > h5').innerText);
        // Get Image
        const bigstoryItemImage = await bigstoryItem.evaluate((el) => el.querySelector('div img').src);
        // Get Link
        const bigstoryItemLink = await bigstoryItem.evaluate((el) => el.querySelector('.container-fluid > h1 > a').href);

        // Push Collated Data &  to "data" Array
        const bigstoryItemObj = {
            headline: bigstoryItemHead,
            body: bigstoryItemBody,
            image: bigstoryItemImage,
            link: bigstoryItemLink,
        }
        data.push(bigstoryItemObj);

        //#endregion



        //#region           TOP NEWS DIVISION
        await page.waitForSelector('html > body > #form1 div.maincontainer > div.container-fluid > div.mPadding > div.more-news-update > div.left-part > #ContentPlaceHolder1_LeadNews_dvLeadNews.col-sm-12 > div', {visible: true});
        const topNewsItems = await page.$$('html > body > #form1 div.maincontainer > div.container-fluid > div.mPadding > div.more-news-update > div.left-part > #ContentPlaceHolder1_LeadNews_dvLeadNews.col-sm-12 > div.news-list');

        for (let item of topNewsItems) {
            // Get Headline
            const topNewsHead = await item.evaluate(el => el.querySelector('div > div.news-description > h3 > a').innerText);
            // Get Link
            const topNewsLink = await item.evaluate(el => el.querySelector('a').href);
            // Get Image
            let topNewsImage;
            try {
                topNewsImage = await item.evaluate(el => el.querySelector('a > img.img-fluid').src);
            }
            catch (err) { };

            if (topNewsImage !== undefined) {
                const topNewObj = {
                    headline: topNewsHead,
                    image: topNewsImage,
                    link: topNewsLink,
                };
                data.push(topNewObj);
            }
            else {
                const topNewObj = {
                    headline: topNewsHead,
                    link: topNewsLink,
                };
                data.push(topNewObj);
            };
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




