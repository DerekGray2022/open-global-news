// // // //      ASSOCIATED PRESS OF PAKISTAN (Pakistan)        ////
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
        await page.goto('https://www.app.com.pk/');


        // #region           TOP ITEM DIVISION
        await page.waitForSelector('html > body > div#page > div#content > div#primary > main#main > div.single-post-left > article > div.entry-content > section.wpb-content-wrapper > div.home-sirst-section > div > div.vc_column-inner > div.wpb_wrapper > div.container > div.first-post-section > div.vc_column-inner > div.wpb_wrapper > div.vc_grid-container-wrapper > div.vc_grid-container > div.vc_grid > div', {visible: true});
        const topItem = await page.$('html > body > div#page > div#content > div#primary > main#main > div.single-post-left > article > div.entry-content > section.wpb-content-wrapper > div.home-sirst-section > div > div.vc_column-inner > div.wpb_wrapper > div.container > div.first-post-section > div.vc_column-inner > div.wpb_wrapper > div.vc_grid-container-wrapper > div.vc_grid-container > div.vc_grid > div');

        // Get Headline
        const topItemHead = await topItem.evaluate((el) => el.querySelector('div.first-post-meta-value > div > div.vc_column-inner > div.wpb_wrapper > div.vc_custom_heading > h3 > a').innerText);
        // Get Image
        const topItemImage = await topItem.evaluate((el) => el.querySelector('div.first-section-img > div.wpb_column > div.vc_column-inner > div.wpb_wrapper > div.wpb_single_image > figure.vc_figure > a > img').src);
        // Get Link
        const topItemLink = await topItem.evaluate((el) => el.querySelector('div.first-section-img > div.wpb_column > div.vc_column-inner > div.wpb_wrapper > div.wpb_single_image > figure.vc_figure > a').href);

        // Push Collated Data &  to "data" Array
        const topItemObj = {
            headline: topItemHead,
            image: topItemImage,
            link: topItemLink,
        };

        data.push(topItemObj);

        //#endregion



        //#region           MULTIPLE ITEMS DIVISION
        await page.waitForSelector('html > body > div#page > div#content > div#primary > main#main > div > article > div.entry-content > section > div.home-sirst-section > div.wpb_column > div.vc_column-inner > div.wpb_wrapper > div > div.first-post-sidebar > div.vc_column-inner > div.wpb_wrapper > div.vc_grid-container-wrapper', {visible: true});
        const sideBarItems = await page.$$('html > body > div#page > div#content > div#primary > main#main > div > article > div.entry-content > section > div.home-sirst-section > div.wpb_column > div.vc_column-inner > div.wpb_wrapper > div > div.first-post-sidebar > div.vc_column-inner > div.wpb_wrapper > div.vc_grid-container-wrapper');

        for (let item of sideBarItems) {
            // Get Headline
            const sideBarHead = await item.evaluate(el => el.querySelector('div.vc_grid-container > div.vc_pageable-wrapper > div.vc_pageable-slide-wrapper > div.wpb_row > div:nth-of-type(2) > div.vc_column-inner > div.wpb_wrapper > div.sidebar-post-title > div > a').innerText);
            // Get Image
            const sideBarImage = await item.evaluate(el => el.querySelector('div.vc_grid-container > div.vc_pageable-wrapper > div.vc_pageable-slide-wrapper > div.wpb_row > div:nth-of-type(1) > div.vc_column-inner > div.wpb_wrapper > div.sidebar-post-img > figure.vc_figure > a > img').src);
            // Get Link
            const sideBarLink = await item.evaluate(el => el.querySelector('div.vc_grid-container > div.vc_pageable-wrapper > div.vc_pageable-slide-wrapper > div.wpb_row > div:nth-of-type(1) > div.vc_column-inner > div.wpb_wrapper > div.sidebar-post-img > figure.vc_figure > a').href);

            // Collate sideBarData & Push to "data" Array
            const sideBarObj = {
                headline: sideBarHead,
                image: sideBarImage,
                link: sideBarLink,
            };

            data.push(sideBarObj);
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




