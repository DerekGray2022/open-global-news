// // // //      HAARETZ (Israel)        ////
import { NextResponse } from"next/server";
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
        await page.goto('https://www.haaretz.com/');


        // #region           TOP ITEM DIVISION
        await page.waitForSelector('html > body > div#__next > div.a > main#pageRoot > section.ix > div > div > article', {visible: true});
        const topItem = await page.$('html > body > div#__next > div.a > main#pageRoot > section.ix > div > div > article');

        // Get Headline
        const topItemHead = await topItem.evaluate((el) => el.querySelector('div.lz.ma.mb > div.mq.mr.ms.mt.mu.mv.mw.mx > a > h1 > span').innerText);
        // Get Image
        const topItemImage = await topItem.evaluate((el) => el.querySelector('div.kl.ae.km.kn > a > div.jc.ko > div > div.lj.f.ae.lk.ll.lm.ln.lo.fa.ez.lp.lq.lr.ls > picture > img').src);
        // Get Link
        const topItemLink = await topItem.evaluate((el) => el.querySelector('div.kl.ae.km.kn > a').href);
        
        // GET RELATED ITEMS
        const topitemRelated = await page.$$('html > body > div#__next > div > main#pageRoot > section.f.g.ix > div > div > article > div.nw.nx.br.ny.nz.oa.ac > ul > li');

        for (let item of topitemRelated) {
            //  Get Headline
            const otherHead = await item.evaluate(ele => ele.querySelector('a').innerText);
            // Get Link
            const otherLink = await item.evaluate(ele => ele.querySelector('a').href);

            // Collate Related Stories & Push to "related" Array
            const relate = {
                headline: otherHead,
                link: otherLink,
            };

            related.push(relate);
        };

        // Push Collated Data &  to "data" Array
        const topItemObj = {
            headline: topItemHead,
            image: topItemImage,
            link: topItemLink,
            related,
        };

        data.push(topItemObj);

        //#endregion



        //#region           TOP LIST ITEMS DIVISION
        await page.waitForSelector('html > body > div#__next > div > main#pageRoot > div > section.f.g.pk.pl > div > article', {visible: true});
        const topListItems = await page.$$('html > body > div#__next > div > main#pageRoot > div > section.f.g.pk.pl > div > article');

        for (let item of topListItems) {
            // Get Headline
            let topListHead;
            try {
                topListHead = await item.evaluate(el => el.querySelector('div:nth-child(2) > a > h2 > span').innerText);
            }
            catch (error) {
                topListHead = await item.evaluate(el => el.querySelector('div:nth-child(2) > a > h2').innerText);
            };
            // Get Image
            const topListImage = await item.evaluate(el => el.querySelector('div:nth-child(1) > a > div > picture > img').src);
            // Get Link
            const topListLink = await item.evaluate(el => el.querySelector('div:nth-child(1) > a').href);

            // Collate topListData & Push to "data" Array
            const topListObj = {
                headline: topListHead,
                image: topListImage,
                link: topListLink,
            };

            data.push(topListObj);
        };
        
        //#endregion



        //#region           ESSENTIAL ITEMS DIVISION
        await page.waitForSelector('html > body > div#__next > div > main#pageRoot > div > section.f.g.ix > div > article', {visible: true});
        const essentialItems = await page.$$('html > body > div#__next > div > main#pageRoot > div > section.f.g.ix > div > article');

        for (let item of essentialItems) {
            // Get Headline
            const essentialHead = await item.evaluate(el => el.querySelector('div:nth-child(2) > a > h3').innerText);
            // Get Image
            const essentialImage = await item.evaluate(el => el.querySelector('div:nth-child(1) > a > div > picture > img').src);
            // Get Link
            const essentialLink = await item.evaluate(el => el.querySelector('div:nth-child(1) > a').href);

            // Collate essentialData & Push to "data" Array
            const essentialObj = {
                headline: essentialHead,
                image: essentialImage,
                link: essentialLink,
            };

            data.push(essentialObj);
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




