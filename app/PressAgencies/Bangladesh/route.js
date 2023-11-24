// // // //      BANGLADESH SANGBAD SANGSTHA (Bangladesh)        ////
import { NextResponse } from"next/server";
import puppeteer from 'puppeteer';

let data = [];
let headArray = [];
let imgArray = [];

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
        await page.goto('https://www.bssnews.net/');


        // #region           TOP ITEM DIVISION
        await page.waitForSelector('html > body > div.panel-body > div.homeTop > div:nth-of-type(1) > div.col-lg-9 > div.Homepage-Lead-Section > div.Toplead-news > div.row > div:nth-of-type(1) > div.main-lead > a', {visible: true});
        const topItem = await page.$('html > body > div.panel-body > div.homeTop > div:nth-of-type(1) > div.col-lg-9 > div.Homepage-Lead-Section > div.Toplead-news > div.row > div:nth-of-type(1) > div.main-lead > a');

        // Get Headline
        const topItemHead = await topItem.evaluate((el) => el.querySelector('div.main-lead-title > h4').innerText);
        // Get Image
        const topItemImage = await topItem.evaluate((el) => el.querySelector('div.image-lead > img').src);
        // Get Link
        const topItemLink = await topItem.evaluate((el) => el.href);

        // Push Collated Data &  to "data" Array
        const topItemObj = {
            headline: topItemHead,
            image: topItemImage,
            link: topItemLink,
        };

        data.push(topItemObj); 

        //#endregion


        //#region           TOP LIST ITEMS DIVISION
        await page.waitForSelector('html > body > div.panel-body > div.homeTop > div:nth-of-type(1) > div.col-lg-9 > div.Homepage-Lead-Section > div.Toplead-news > div.row > div:nth-of-type(2) > div.row > div.col-md-6', {visible: true});
        const topListItems = await page.$$('html > body > div.panel-body > div.homeTop > div:nth-of-type(1) > div.col-lg-9 > div.Homepage-Lead-Section > div.Toplead-news > div.row > div:nth-of-type(2) > div.row > div.col-md-6');

        for (let item of topListItems) {
            // Get Headline
            const topListHead = await item.evaluate(el => el.querySelector('div.hometop_sublead > div.py-2 > a > h6').innerText);
            // Get Image
            const topListImage = await item.evaluate(el => el.querySelector('div.tln_img > a > img').src);
            // Get Link
            const topListLink = await item.evaluate(el => el.querySelector('div.tln_img > a').href);

            // Collate topListData & Push to "data" Array
            const topListObj = {
                headline: topListHead,
                image: topListImage,
                link: topListLink,
            };

            data.push(topListObj);
        };
        
        //#endregion


        // #region           NATIONAL TOP ITEM DIVISION
        await page.waitForSelector('html > body > div.panel-body > div.homeTop > div.row > div.col-lg-9 > div.Bodymenu_Section > div:nth-of-type(1) div > div#bodymenu_withScroll > div.Menu_News > div.row > div:nth-of-type(1)', {visible: true});
        const nationalTopItem = await page.$('html > body > div.panel-body > div.homeTop > div.row > div.col-lg-9 > div.Bodymenu_Section > div:nth-of-type(1) div > div#bodymenu_withScroll > div.Menu_News > div.row > div:nth-of-type(1)');

        // Get Headline
        const nationalTopItemHead = await nationalTopItem.evaluate((el) => el.querySelector('div.lead_headline > a > h4').innerText);
        // Get Image
        const nationalTopItemImage = await nationalTopItem.evaluate((el) => el.querySelector('div:nth-of-type(1) > a > div > img').src);
        // Get Link
        const nationalTopItemLink = await nationalTopItem.evaluate((el) => el.querySelector('div.lead_headline > a').href);

        // Push Collated Data &  to "data" Array
        const nationalTopItemObj = {
            headline: nationalTopItemHead,
            image: nationalTopItemImage,
            link: nationalTopItemLink,
        };

        data.push(nationalTopItemObj); 

        //#endregion



        // #region           NATIONAL LIST ONE ITEM DIVISION

        // //   //  HEADER
        await page.waitForSelector('html > body > div.panel-body > div.homeTop > div.row > div.col-lg-9 > div.Bodymenu_Section > div:nth-of-type(1) div > div#bodymenu_withScroll > div.Menu_News > div.row > div:nth-of-type(2) > div.py-2', {visible: true});
        const nationalListOneHeader = await page.$$('html > body > div.panel-body > div.homeTop > div.row > div.col-lg-9 > div.Bodymenu_Section > div:nth-of-type(1) div > div#bodymenu_withScroll > div.Menu_News > div.row > div:nth-of-type(2) > div.py-2');

        for (let item of nationalListOneHeader) {
            // Get Headline
            const nationalListOneHead = await item.evaluate(el => el.querySelector('a > h4').innerText);

            // Push to "headArray"
            headArray.push(nationalListOneHead);
        };
        

        // //   //  IMAGE
        await page.waitForSelector('html > body > div.panel-body > div.homeTop > div.row > div.col-lg-9 > div.Bodymenu_Section > div:nth-of-type(1) div > div#bodymenu_withScroll > div.Menu_News > div.row > div:nth-of-type(2) > div.py-2', {visible: true});
        const nationalListOneImage = await page.$$('html > body > div.panel-body > div.homeTop > div.row > div.col-lg-9 > div.Bodymenu_Section > div:nth-of-type(1) div > div#bodymenu_withScroll > div.Menu_News > div.row > div:nth-of-type(2) > div.position-relative');

        for (let item of nationalListOneImage) {
            // Get Image
            const nationalListOneImg = await item.evaluate(el => el.querySelector('a > div > img').dataset.original);

            // Push to "imgArray"
            let tempArr = [];
            const imgRef = `https://www.bssnews.net${nationalListOneImg}`
            tempArr.push(imgRef);
            const linkRef = await item.evaluate(el => el.querySelector('a').href);
            tempArr.push(linkRef);
            imgArray.push(tempArr);
            tempArr = [];
        };
        
        for (let index = 0; index < headArray.length; index++) {
            let nationalListOneObj = {
                headline: headArray[index],
                image: imgArray[index][0],
                link: imgArray[index][1]
            };

            data.push(nationalListOneObj)
        };
        
        //#endregion



        //#region           NATIONAL LIST TWO ITEMS DIVISION
        await page.waitForSelector('html > body > div.panel-body > div.homeTop > div.row > div.col-lg-9 > div.Bodymenu_Section > div:nth-of-type(1) div > div#bodymenu_withScroll > div.Menu_News > div.row > div#scroll_news > div#mCSB_1 > div#mCSB_1_container > div.News-List > div.row > div', {visible: true});
        const nationalListTwoItems = await page.$$('html > body > div.panel-body > div.homeTop > div.row > div.col-lg-9 > div.Bodymenu_Section > div:nth-of-type(1) div > div#bodymenu_withScroll > div.Menu_News > div.row > div#scroll_news > div#mCSB_1 > div#mCSB_1_container > div.News-List > div.row > div');

        for (let item of nationalListTwoItems) {
            // Get Headline
            const nationalListTwoHead = await item.evaluate(el => el.querySelector('a > div > div.media-body > h5').innerText);
            // Get Image
            const nationalListTwoImage = await item.evaluate(el => el.querySelector('a > div > div.media_img_sm > img').dataset.original);
            let tempImg = `https://www.bssnews.net${nationalListTwoImage}`
            // Get Link
            const nationalListTwoLink = await item.evaluate(el => el.querySelector('a').href);

            // Collate nationalListTwoData & Push to "data" Array
            const nationalListTwoObj = {
                headline: nationalListTwoHead,
                image: tempImg,
                link: nationalListTwoLink,
            };

            data.push(nationalListTwoObj);
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




