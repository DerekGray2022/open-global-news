//  PALESTINE INFORMATION CENTRE (Palestinian Territories)  ////
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
        await page.goto('https://english.palinfo.com/categories/Daily-News');


        // #region           TOP ITEM DIVISION
        await page.waitForSelector('html > body > form > div.HomeContent > div.ContainerpalinfoContainer > div.palinfoContainer > div.ContentpalinfoContainer > div.row > div.ContentShead > div:nth-of-type(1)', {visible: true});
        const topItem = await page.$('html > body > form > div.HomeContent > div.ContainerpalinfoContainer > div.palinfoContainer > div.ContentpalinfoContainer > div.row > div.ContentShead > div:nth-of-type(1)');

        // Get Headline
        const topItemHead = await topItem.evaluate((el) => el.querySelector('div.Containerbredcrump > div > div > a.headPD').innerText);
        // Get Body
        const topItemBody = await topItem.evaluate((el) => el.querySelector('div:nth-of-type(3) > div:nth-of-type(1) >  div > div > div.collg4Cat > p').innerText);
        // Get Image
        const topItemImage = await topItem.evaluate((el) => el.querySelector('div:nth-of-type(3) > div:nth-of-type(1) >  div > div > div.collg8Cat > div > div > div > img').src);
        // Get Link
        const topItemLink = await topItem.evaluate((el) => el.querySelector('div.Containerbredcrump > div > div > a.headPD').href);

        // Push Collated Data &  to "data" Array
        const topItemObj = {
            headline: topItemHead,
            body: topItemBody,
            image: topItemImage,
            link: topItemLink,
        };

        data.push(topItemObj);

        //#endregion



        //#region           LIST ITEMS DIVISION
        await page.waitForSelector('html > body > form > div.HomeContent > div.ContainerpalinfoContainer > div.palinfoContainer > div.ContentpalinfoContainer > div.row > div.ContentShead > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2) > div > ul > li', {visible: true});
        const listItems = await page.$$('html > body > form > div.HomeContent > div.ContainerpalinfoContainer > div.palinfoContainer > div.ContentpalinfoContainer > div.row > div.ContentShead > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2) > div > ul > li');

        for (let item of listItems) {
            // Get Headline
            const listHead = await item.evaluate(el => el.querySelector('a > div.p > p').innerText);
            // Get Image
            const listImage = await item.evaluate(el => el.querySelector('a > div.img > img').src);
            // Get Link
            const listLink = await item.evaluate(el => el.querySelector('a').href);

            // Collate listData & Push to "data" Array
            const listObj = {
                headline: listHead,
                image: listImage,
                link: listLink,
            };

            data.push(listObj);
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




