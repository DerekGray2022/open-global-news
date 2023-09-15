 // // // //      BAKHTAR (Afghanistan)        ////
const { NextResponse } = require("next/server");
import puppeteer from 'puppeteer';


export async function GET () {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // headless: false,
        // defaultViewport: false,
    });
    const page = await browser.newPage();

    //  #posts-container > li.post-item.post-687859.post.type-post.status-publish.format-standard.has-post-thumbnail.category-news.category-social.category-education.tie-standard > a > img

    //  #posts-container > li.post-item.post-687865.post.type-post.status-publish.format-standard.has-post-thumbnail.category-politics.category-news.category-top-en.category-social.tie-standard > a > img

    try {
        // Landing Page
        await page.goto('https://bakhtarnews.af/en/category/news/');

        // Get Headlines, Link, Body & Image - (  data[ {} ]  )
        const data = await page.$$eval("#posts-container > .post-item", (ele) => ele.map(item => ({
            headline: item.querySelector('.post-details > h2').innerText,
            link: item.querySelector('.post-details > h2 a').getAttribute('href'),
            body: item.querySelector('.post-details > p').innerText,
            image: item.querySelector('a > img').src,
        })));



        // // // //     OUTPUT      // // // // // // //
        return NextResponse.json({data} );
    }
    catch (err) {
        return NextResponse.json(
            { error: `Bakhtar failed to load : ${err.message}` },
            { status: 400 }
        );
    }
    finally {
        await browser.close();
    }
};



