// // // //      ALBANIAN TLEGRAPHIC AGENCY (Albania)        ////
import { NextResponse } from"next/server";
import puppeteer from 'puppeteer';

let data = [];
let temp = [];

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
        await page.goto('http://en.ata.gov.al/');


        // #region           TOP ITEM DIVISION
        await page.waitForSelector('html > body > div#td-outer-wrap > div.td-main-content-wrap > div.tdc-content-wrap > div#tdi_2 > div.tdc_zone > div#tdi_4 > div.vc_row > div.vc_column > div.wpb_wrapper > div.td_block_wrap > div#tdi_8 > div.td-big-grid-wrapper > div.td_module_mx21', {visible: true});
        const topItem = await page.$('html > body > div#td-outer-wrap > div.td-main-content-wrap > div.tdc-content-wrap > div#tdi_2 > div.tdc_zone > div#tdi_4 > div.vc_row > div.vc_column > div.wpb_wrapper > div.td_block_wrap > div#tdi_8 > div.td-big-grid-wrapper > div.td_module_mx21');

        // Get Headline
        const topItemHead = await topItem.evaluate((el) => el.querySelector('div.td-meta-info-container > div.td-meta-align > div.td-big-grid-meta > h3 > a').innerText);
        // Get Image
        const image = await topItem.evaluate((el) => el.querySelector('div.td-module-image > div.td-module-thumb > a > span').style.backgroundImage);
        const topItemImage = image.split('"')[1];
        // Get Link
        const topItemLink = await topItem.evaluate((el) => el.querySelector('div.td-module-image > div.td-module-thumb > a').href);

        // Push Collated Data &  to "data" Array
        const topItemObj = {
            headline: topItemHead,
            image: topItemImage,
            link: topItemLink,
        };

        data.push(topItemObj); 

        //#endregion



        //#region           TOP EXTRA ITEMS DIVISION
        await page.waitForSelector('html > body > div#td-outer-wrap > div.td-main-content-wrap > div.tdc-content-wrap > div#tdi_2 > div.tdc_zone > div#tdi_4 > div.vc_row > div.vc_column > div.wpb_wrapper > div.td_block_wrap > div#tdi_8 > div.td-big-grid-wrapper > div.td-big-grid-scroll > div.td_module_mx21', {visible: true});
        const topExtraItems = await page.$$('html > body > div#td-outer-wrap > div.td-main-content-wrap > div.tdc-content-wrap > div#tdi_2 > div.tdc_zone > div#tdi_4 > div.vc_row > div.vc_column > div.wpb_wrapper > div.td_block_wrap > div#tdi_8 > div.td-big-grid-wrapper > div.td-big-grid-scroll > div.td_module_mx21');

        for (let item of topExtraItems) {
            // Get Headline
            const topExtraHead = await item.evaluate(el => el.querySelector('div.td-meta-info-container > div.td-meta-align > div.td-big-grid-meta > h3 > a').innerText);
            // Get Background Image
            const image = await item.evaluate((el) => el.querySelector('div.td-module-image > div > a > span').style.backgroundImage);
            const topExtraImage = image.split('"')[1];
            // Get Link
            const topExtraLink = await item.evaluate(el => el.querySelector('div.td-module-image > div > a').href);

            // Collate topExtraData & Push to "data" Array
            const topExtraObj = {
                headline: topExtraHead,
                image: topExtraImage,
                link: topExtraLink,
            };

            data.push(topExtraObj);
        };
        
        //#endregion


        // #region           SECONDARY TOP ITEM DIVISION
        await page.waitForSelector('html > body > div#td-outer-wrap > div.td-main-content-wrap > div.tdc-content-wrap > div#tdi_2 > div.tdc_zone > div#tdi_13 > div.vc_row > div.vc_column.tdi_16 > div.wpb_wrapper > div.td_block_wrap > div#tdi_17 > div.td-block-row > div:nth-of-type(1)', {visible: true});
        const secondaryTopItem = await page.$('html > body > div#td-outer-wrap > div.td-main-content-wrap > div.tdc-content-wrap > div#tdi_2 > div.tdc_zone > div#tdi_13 > div.vc_row > div.vc_column.tdi_16 > div.wpb_wrapper > div.td_block_wrap > div#tdi_17 > div.td-block-row > div:nth-of-type(1)');

        // Get Headline
        const secondaryTopItemHead = await secondaryTopItem.evaluate((el) => el.querySelector('div > h3 > a').innerText);
        // Get Body
        const secondaryTopItemBody = await secondaryTopItem.evaluate((el) => el.querySelector('div > div.td-excerpt').innerText);
        // Get Image
        const secondaryTopItemImage = await secondaryTopItem.evaluate((el) => el.querySelector('div > div.td-module-image > div.td-module-thumb > a > img').src);
        // Get Link
        const secondaryTopItemLink = await secondaryTopItem.evaluate((el) => el.querySelector('div > h3 > a').href);

        // Push Collated Data &  to "data" Array
        const secondaryTopItemObj = {
            headline: secondaryTopItemHead,
            body: secondaryTopItemBody,
            image: secondaryTopItemImage,
            link: secondaryTopItemLink,
        };

        data.push(secondaryTopItemObj); 

        //#endregion



        //#region           SECONDARY LIST ITEMS DIVISION
        await page.waitForSelector('html > body > div#td-outer-wrap > div.td-main-content-wrap > div.tdc-content-wrap > div#tdi_2 > div.tdc_zone > div#tdi_13 > div.vc_row > div.vc_column.tdi_16 > div.wpb_wrapper > div.td_block_wrap > div#tdi_17 > div.td-block-row > div:nth-of-type(2) > div.td_module_6', {visible: true});
        const secondaryListItems = await page.$$('html > body > div#td-outer-wrap > div.td-main-content-wrap > div.tdc-content-wrap > div#tdi_2 > div.tdc_zone > div#tdi_13 > div.vc_row > div.vc_column.tdi_16 > div.wpb_wrapper > div.td_block_wrap > div#tdi_17 > div.td-block-row > div:nth-of-type(2) > div.td_module_6');

        for (let item of secondaryListItems) {
            // Get Headline
            const secondaryListHead = await item.evaluate(el => el.querySelector('div.item-details > h3 > a').innerText);
            // Get Image
            const secondaryListImage = await item.evaluate(el => el.querySelector('div.td-module-thumb > a > img').src);
            // Get Link
            const secondaryListLink = await item.evaluate(el => el.querySelector('div.td-module-thumb > a').href);

            // Collate secondaryListData & Push to "data" Array
            const secondaryListObj = {
                headline: secondaryListHead,
                image: secondaryListImage,
                link: secondaryListLink,
            };

            data.push(secondaryListObj);
        };
        
        //#endregion



        //#region           TERCIARY LIST ITEMS DIVISION
        await page.waitForSelector('html > body > div#td-outer-wrap > div.td-main-content-wrap > div.tdc-content-wrap > div#tdi_2 > div.tdc_zone > div#tdi_13 > div.vc_row > div.vc_column > div.wpb_wrapper > div.td_block_wrap > div#tdi_20 > div.td-block-span12', {visible: true});
        const terciaryListItems = await page.$$('html > body > div#td-outer-wrap > div.td-main-content-wrap > div.tdc-content-wrap > div#tdi_2 > div.tdc_zone > div#tdi_13 > div.vc_row > div.vc_column > div.wpb_wrapper > div.td_block_wrap > div#tdi_20 > div.td-block-span12');

        for (let item of terciaryListItems) {
            // Get Headline
            const terciaryListHead = await item.evaluate(el => el.querySelector('div > div.item-details > h3 > a').innerText);
            // Get Image
            const terciaryListImage = await item.evaluate(el => el.querySelector('div > div.td-module-thumb > a > img').src);
            // Get Link
            const terciaryListLink = await item.evaluate(el => el.querySelector('div > div.td-module-thumb > a').href);

            // Collate terciaryListData & Push to "data" Array
            const terciaryListObj = {
                headline: terciaryListHead,
                image: terciaryListImage,
                link: terciaryListLink,
            };

            data.push(terciaryListObj);
        };
        
        //#endregion



        // #region      DELETE DUPLICATES

        let isOriginal = true;
        data.map((item) => {
            if (temp.length > 0) {
                temp.map((tempItem) => {
                    if (tempItem.headline === item.headline) {
                        isOriginal = false;
                    };
                });
            };
            
            if (isOriginal) {
                temp.push(item)
            };

            isOriginal = true;
        });

        data = temp;

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




