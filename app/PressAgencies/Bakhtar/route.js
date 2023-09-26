 // // // //      BAKHTAR (Afghanistan)        ////
const { NextResponse } = require("next/server");
import puppeteer from 'puppeteer';

// let data = [];

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
        await page.goto('https://bakhtarnews.af/en/category/news/');

        // Get Headlines, Link, Body & Image - (  data[ {} ]  )
        const data = await page.$$eval("#posts-container > .post-item", (ele) => ele.map(item => (
            {
                headline: item.querySelector('.post-details > h2').innerText,
                body: item.querySelector('.post-details > p').innerText,
                link: item.querySelector('.post-details > h2 a').getAttribute('href'),
                image: item.querySelector('a > img').dataset.src,
            }
        )));



        // // // //     OUTPUT      // // // // // // //
        return NextResponse.json({data});
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



