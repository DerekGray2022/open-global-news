// // // //      XINHUA (China)        ////
import { NextResponse } from"next/server";
import puppeteer from 'puppeteer';

let data = [];
let carouselData = [];
let isDuplicate = false;

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
        await page.goto('https://english.news.cn/');


        //#region           CAROUSEL NEWS ITEMS
        await page.waitForSelector('#focusMedia > div.swiper-container > div.swiper-wrapper > div.swiper-slide', {visible: true});
        const carouselContainer = await page.$$('#focusMedia > div.swiper-container > div.swiper-wrapper > div.swiper-slide');

        try {
            for (let item of carouselContainer) {
                //  Get Headline
                const carouselHead = await item.evaluate(ele => ele.querySelector('div.tit > a').innerText);
                //  Get Headline
                const carouselImage = await item.evaluate(ele => ele.querySelector('div.img > a > img').src);
                // Get Link
                const carouselLink = await item.evaluate(ele => ele.querySelector('div.img > a ').href);

                //  Create carousel Object
                const carouselObj = {
                        headline: carouselHead,
                        image: carouselImage,
                        link: carouselLink,
                };

                //  Disgard Duplicate carouselObj
                for (let num = 0; num < carouselData.length; num++) {
                    if (carouselObj.headline === carouselData[num].headline) {
                        isDuplicate = true;
                    };
                };

                if (!isDuplicate) {
                    carouselData.push(carouselObj);
                };

                isDuplicate = false;
            };

            carouselData.forEach((obj) => {
                data.push(obj);
            });
        }
        catch (err) {
            return NextResponse.json(
                { error: `No response from Associated Press. : ${err.message}` },
                { status: 400 }
		    );
        };

        //#endregion





        // #region           TOP ITEMS DIVISION
        await page.waitForSelector('body > div.area.main > div > div.headnews', {visible: true});
        const itemsContainer = await page.$('body > div.area.main > div > div.headnews');


        // Get Head Item
        const topitemHead = await itemsContainer.evaluate((el) => el.querySelector('#headline > h1 > a').innerText);
        // Get Body
        const topitemBody = await itemsContainer.evaluate((el) => el.querySelector('#headline > p').innerText);
        // // Get Image
        // const topitemImage = await itemsContainer.evaluate((el) => el.querySelector(' picture > img').src);
        // Get Link
        const topitemLink = await itemsContainer.evaluate((el) => el.querySelector('#headline > h1 > a').href);

        const topItemObj = {
            headline: topitemHead,
            body: topitemBody,
            link: topitemLink,
        };

        data.push(topItemObj);

        // Get Left-Side List Items
        const leftSideList = await itemsContainer.$$('div > div.headnews-left.left > ul > li');
        try {
            for (let item of leftSideList) {
                //  Get Headline
                const leftSideHead = await item.evaluate(ele => ele.querySelector('div > div.headnews-left.left > ul > li > a').innerText);
                // Get Link
                const leftSideLink = await item.evaluate(ele => ele.querySelector('div > div.headnews-left.left > ul > li > a').href);

                // Collate Related Stories & Push to "related" Array
                const relate = {
                    headline: leftSideHead,
                    link: leftSideLink,
                };
                data.push(relate);
            };
        }
        catch (err) {
            return NextResponse.json(
                { error: `No response from Associated Press. : ${err.message}` },
                { status: 400 }
		    );
        };

        //#endregion





        //#region           BOTTOM PIC LIST DIVISION
        await itemsContainer.waitForSelector('#focusBottomPicList', {visible: true});
        const bottomPicList = await itemsContainer.$$('#focusBottomPicList > .item');

        
        for (let item of bottomPicList) {
            // Get Headline
            const bottomPicListHead = await item.evaluate(el => el.querySelector('.tit > a').innerText);
            // Get Image
            const bottomPicListImage = await item.evaluate(el => el.querySelector('.img > a > img').src);
            // Get Link
            const bottomPicListLink = await item.evaluate(el => el.querySelector('.tit > a').href);


            // Collate bottomPicListData & Push to "data" Array
            const bottomPicListObj = {
                headline: bottomPicListHead,
                image: bottomPicListImage,
                link: bottomPicListLink,
            };
            data.push(bottomPicListObj);
        };

        //#endregion




        //#region           RIGHT SIDE ITEMS LIST DIVISION
        await itemsContainer.waitForSelector('div > .headnews-right', {visible: true});
        const rightSide = await itemsContainer.$('div > .headnews-right');

        // Get Top Item Headline
        const rightSideTopHead = await rightSide.evaluate(el => el.querySelector('#focusRightPicList > div > div.tit > a').innerText);
        // Get Top Item Image
        const rightSideTopImage = await rightSide.evaluate(el => el.querySelector('#focusRightPicList > div > .img > a > img').src);
        // Get Top Item Link
        const rightSideTopLink = await rightSide.evaluate(el => el.querySelector('#focusRightPicList > div > .img > a').href);

        const rightSideTopObj = {
            headline: rightSideTopHead,
            image: rightSideTopImage,
            link: rightSideTopLink,
        };
        
        data.push(rightSideTopObj);


        //  Get Other Items
        await itemsContainer.waitForSelector('.list > ul > li', {visible: true});
        const rightSideOther = await itemsContainer.$$('.list > ul > li');

        for (let item of rightSideOther) {
            // Get Top Item Headline
            const rightSideOtherHead = await item.evaluate(el => el.querySelector('a').innerText);
            // Get Top Item Link
            const rightSideOtherLink = await item.evaluate(el => el.querySelector('a').href);


            // Collate rightSideData & Push to "data" Array
            const rightSideObj = {
                headline: rightSideOtherHead,
                link: rightSideOtherLink,
            };
            data.push(rightSideObj);
        };

        //     #endregion

        return NextResponse.json({ data });
    }
    catch (err) {
        return NextResponse.json(
            { error: `Associated Press failed to load : ${err.message}` },
            { status: 400 }
        );
    }
    finally {
        await browser.close();
    };
};




