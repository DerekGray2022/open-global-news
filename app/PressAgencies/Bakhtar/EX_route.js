 // // // //      BAKHTAR (Afghanistan)        ////
const { NextResponse } = require("next/server");
const puppeteer = require('puppeteer');

const imgArray = [];

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
        await page.goto('https://bakhtarnews.af/en/');

        // Get Headlines - (  data[ {} ]  )
        let data = await page.$$eval(".tie-standard > .thumb-overlay > .thumb-content", (ele) => ele.map(item => ({
            headline: item.querySelector('h2').innerText,
            link: item.querySelector('h2 a').getAttribute('href'),
        })));
        
        // Get Image - (  imgArray[ ]  )
        const background = await page.$$eval('.tie-standard', (ele) => ele.map(el => window.getComputedStyle(el).backgroundImage));
        background.map((image) => {
            const backgroundImage = image.split(`"`)[1];
            if (backgroundImage !== undefined) {
                imgArray.push(backgroundImage);
            };
        });
        
        // Merge data[ {} ] + imgArray[ ]
        data.map((title, index) => {
            title.image = imgArray[index];
        });



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



