 // // // //      REUTERS (UK)        ////
import { NextResponse } from "next/server";
import puppeteer from 'puppeteer';

let data = [];
let related = [];


export async function GET () {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // headless: false,
        // defaultViewport: false,
    });
    const page = await browser.newPage();

    try {
        // Landing Page
        await page.goto('https://www.reuters.com/');

        // Get Main Story
        const mainContainer = await page.$("#main-content > div> div > div > ul > li:nth-child(1)");

        const mainHeadline = await mainContainer.evaluate(el => el.querySelector('a:nth-child(2)').textContent);
        const mainBody = await mainContainer.evaluate(el => el.querySelector('p').innerText);
        const mainLink = await mainContainer.evaluate(el => el.querySelector('a:nth-child(2)').href);
        const mainImage = await mainContainer.evaluate(el => el.querySelector('a:nth-child(2) > div > div.image > div > img').src);
        const mainRelated = await mainContainer.$$('#main-content > div > div > div > ul > li > ul.home-page-grid__home-hero__N90H7 > li > div > ul > li');

        try {
            for (let relatedItem of mainRelated) {
                const relatedLink = await relatedItem.evaluate(el => el.querySelector('a').href);
                const relatedHeadline = await relatedItem.evaluate(el => el.querySelector('a').innerText);
                related.push({
                    headline: relatedHeadline,
                    link: relatedLink,
                });
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
        }

        const mainObj = {
            headline: mainHeadline,
            body: mainBody,
            link: mainLink,
            image: mainImage,
            related,
        };
        related = [];
        data.push(mainObj);


        //      Get Secondary Story
        const secondaryHeadline = await mainContainer.evaluate(el => el.querySelector('#main-content > div > div > div > ul > li > ul.home-page-grid__home-hub__a11eg > li > div > a').innerText);
        const secondaryBody = await mainContainer.evaluate(el => el.querySelector('#main-content > div > div > div > ul > li > ul.home-page-grid__home-hub__a11eg > li > div > p').innerText);
        const secondaryLink = await mainContainer.evaluate(el => el.querySelector('#main-content > div > div > div > ul > li > ul.home-page-grid__home-hub__a11eg > li > div > a').href);

        const secondaryRelated = await mainContainer.$$('#main-content > div > div > div > ul > li > ul.home-page-grid__home-hub__a11eg > li:nth-child(1) > div > ul > li');

        try {
            for (let relatedItem of secondaryRelated) {
                const relatedHeadline = await relatedItem.evaluate(el => el.querySelector('a').innerText);
                const relatedLink = await relatedItem.evaluate(el => el.querySelector('a').href);

                related.push({
                    headline: relatedHeadline,
                    link: relatedLink,
                });
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
        }
        
        const secondaryObj = {
            headline: secondaryHeadline,
            body: secondaryBody,
            link: secondaryLink,
            related,
        };
        related = [];
        data.push(secondaryObj);


        //  Get Tertiary Story
        const tertiaryHeadline = await mainContainer.evaluate(el => el.querySelector('#main-content > div > div > div > ul > li > ul.home-page-grid__home-hub__a11eg > li:nth-child(2) > div > div.media-story-card__body__3tRWy > h3').innerText);
        const tertiaryBody = await mainContainer.evaluate(el => el.querySelector('#main-content > div > div > div > ul > li > ul.home-page-grid__home-hub__a11eg > li:nth-child(2) > div > div.media-story-card__body__3tRWy > p').innerText);
        const tertiaryLink = await mainContainer.evaluate(el => el.querySelector('#main-content > div > div > div > ul > li > ul.home-page-grid__home-hub__a11eg > li:nth-child(2) > div > div > a').href);
        const tertiaryImage = await mainContainer.evaluate(el => el.querySelector('#main-content > div > div > div > ul > li > ul.home-page-grid__home-hub__a11eg > li:nth-child(2) > div > div.media-story-card__placement-container__1R55- > a > div > div > div > img').src);

        const tertiaryObj = {
            headline: tertiaryHeadline,
            body: tertiaryBody,
            link: tertiaryLink,
            image: tertiaryImage,
        };
        data.push(tertiaryObj);


        //  Other Stories
        const otherItems = await page.$$("#main-content > div > div > div.content-layout__item__SC_GG > ul > li:nth-child(2) > ul > li");

        try {
            for (let item of otherItems) {
                try {
                    let otherImage;
                    const otherHeadline = await item.evaluate(ele => ele.querySelector('div > div.media-story-card__body__3tRWy > h3 > a').innerText);
                    const otherLink = await item.evaluate(el => el.querySelector('div > div.media-story-card__body__3tRWy > h3 > a').href);
                    try {
                        otherImage = await item.evaluate(el => el.querySelector('div > div.media-story-card__placement-container__1R55- > a > div > div.image > div > img').src);
                    } catch (err) {
                        otherImage = null;
                    };

                    const otherObj = {
                        headline: otherHeadline,
                        link: otherLink,
                        image: otherImage,
                    };
                    data.push(otherObj);
                }
                catch (err) {
                    const otherHeadline = await item.evaluate(ele => ele.querySelector('div > a').innerText);
                    const otherLink = await item.evaluate(el => el.querySelector('div > a').href);

                    const otherObj = {
                        headline: otherHeadline,
                        link: otherLink,
                    };
                    data.push(otherObj);
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

        // // // //     OUTPUT      // // // // // // //
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



