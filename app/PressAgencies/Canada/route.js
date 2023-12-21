// // // //      CANADIAN PRESS (Canada)        ////
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
        await page.goto('https://www.nationalobserver.com/u/canadian-press');


        //#region           CONTENT ITEMS DIVISION
        await page.waitForSelector('html > body > div.site-container > main > div > section > div.pane-user > article > div.user-profile__content > div.view > div.view-content > div.view-content__inner > div.views-row', {visible: true});
        const contentItems = await page.$$('html > body > div.site-container > main > div > section > div.pane-user > article > div.user-profile__content > div.view > div.view-content > div.view-content__inner > div.views-row');

        for (let item of contentItems) {
            // Get Headline
            const contentHead = await item.evaluate(el => el.querySelector('article.node.node-article.node-teaser.teaser.teaser--default div.teaser__content h2.teaser__title a').innerText);
            // Get Body
            const contentBody = await item.evaluate(el => el.querySelector('article.node.node-article.node-teaser.teaser.teaser--default div.teaser__content div.teaser__text').innerText);
            // Get Image
            const contentImage = await item.evaluate(el => el.querySelector('article.node.node-article.node-teaser.teaser.teaser--default.teaser--has-img figure.teaser__img a img').src);
            // Get Link
            const contentLink = await item.evaluate(el => el.querySelector('article.node.node-article.node-teaser.teaser.teaser--default.teaser--has-img figure.teaser__img a').href);

            // Collate contentData & Push to "data" Array
            const contentObj = {
                headline: contentHead,
                body: contentBody,
                image: contentImage,
                link: contentLink,
            };
            data.push(contentObj);
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




