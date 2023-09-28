"use client"

import React, { useState, createElement } from "react";
import Link from "next/link";
import { Orbitron } from 'next/font/google';

//      FONTS
const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900']
});

//      COMPONENTS
//  Images
const images = require.context('./logos', true);
const imageList = images.keys().map(image => images(image));
import ScrollToTop from "./scrollToTop";

//  JSON
import Countries from './json/countries.json';
import Titles from './json/titles.json';

//     Fixing Vercel Caching Bug?
//     vercel.json has been added.
export const fetchCache = 'force-no-store';
export const dynamic = "force-dynamic";
export const revalidate = 0;

// //    Create Seperate Divisions & Arrays
// const div01 = createElement('div', {className: "div01"});
// const div02 = createElement('div', {className: "div02"});
// const div03 = createElement('div', {className: "div03"});
// let div01Array = [];
// let div02Array = [];
// let div03Array = [];

// //  Get Number of Buttons
// const listSize = imageList.length;

// //    Set-Up for 2-Column Layout
// const col02 = listSize / 2;
// const col02Int = col02.toFixed(0);
// //    Set-Up for 3-Column Layout
// const col03 = listSize / 3;
// const col03Int = col03.toFixed(0);
// const col03Mod = (col03 % 3).toFixed(0);



//    MAIN FUNCTION
export default function Home() {
  //  Use States
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectDiv, setSelectDiv] = useState(true);
  const [altText, setAltText] = useState("");
  const [presentImg, setPresentImg] = useState(null);

  //  Functions
  const handleClick = async (endpoint, e) => {
    setNews([]);
    setSelectDiv(false);
    setIsLoading(true);

    const endpointString = `/PressAgencies/${endpoint}`;
    const res = await fetch(endpointString, {
      method: "GET",
      next: {
        revalidate: 0,
      },
      cache: 'no-store',
    });

    const data = await res.json();
    const newsData = data.data;
    
    setNews(newsData);
    setIsLoading(false);
  };


  return (
    <div> 
      {/* //////////////////////////////////////// */}
      {/*         Opening Text            */}
      {/* //////////////////////////////////////// */}
      {selectDiv &&
      <div>
        <ScrollToTop />
        <div className="introContainer">
          <p>
            <b>Open Global News</b> is committed to upholding the fundamental values of open, uncensored journalism, championing truth, diversity, and transparency in an ever-changing world of information.
          </p>

          <p>
            A free, uncensored global press serves as the cornerstone of democracy, empowering citizens with diverse, unfiltered information to make informed decisions and hold institutions accountable for a just and transparent society.
          </p>

          <p className="lastPara">
            Click on a news agency logo below to download the latest headlines.
          </p>
        </div>
      </div>
      }
      
      
      {/* ///////////////////////////////////////////// */}
      {/*   Logo Selection Button List  */}
      {/* ///////////////////////////////////////////// */}
      {selectDiv &&
        <div className="container grid grid-cols-2">
          
          {/*     Loop Through List of Agency Logos    */}
          {imageList.map((image, id) => {
            //    Get Endpoint for Selected Agency
            const srcArray = image.default.src.split("/");
            const wanted = srcArray[4];
            const wantedArray = wanted.split(".");
            const logoEndpoint = wantedArray[0];

            if (window.innerWidth >= 640) {
              console.log(window.innerWidth);
              //    Sort Buttons into 2 Seperate Divisions
              if(id < col02Int) {
                div01Array.push(image);
                div01.appenChild(div01Array);
              }
              else{
                div02Array.push(image);
              };
            };
            
            return (
              //    LOGO BUTTON
              <button
                key={id}
                className="px-2 py-1 rounded-md col-span-1"
                onClick={() => {
                  setPresentImg(image.default.src);
                  handleClick(logoEndpoint);
                }}
              >
                <div className="group relative flex justify-center">
                  {/*     IMAGE    */}
                  <img
                    onMouseEnter = {(e) => { setAltText(e.target.alt)}}
                    src={image.default.src}
                    alt={logoEndpoint}
                  />
                  {/*    TOOLTIP      */}
                  <span className="scale-0 rounded bg-gray-800 p-2 text-base font-bold text-white group-hover:scale-100 toolTip">
                    {Countries[altText]}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      }


      {/* //////////////////////////// */}
      {/*     BACK Button    */}
      {/* //////////////////////////// */}
      {!selectDiv && 
          <div id="backButton">
            <ScrollToTop />
            <button onClick={() => { setSelectDiv(true) }}>
              BACK
            </button> 
          </div> 
      }


      {/* ///////////////////////////////////// */}
      {/*     Is Loading Spinner    */}
      {/* ///////////////////////////////////// */}
      { isLoading &&
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      }

  
      {/* //////////////////////////////////////////////// */}
      {/*     News Item Display Cards    */}
      {/* //////////////////////////////////////////////// */}
      {!selectDiv && 
        <div>
          {/*     Selected Agency's Logo    */}
          {!isLoading &&
            <div>
              <div className="logoButtonWrap">
                <div className="logoButton">
                  <img src={presentImg} alt={"pic"} />
                </div>
                <h2 className={orbitron.className}>
                  {Titles[altText][0]}
                </h2>
                <h3 className="text-3xl font-medium">
                  {Titles[altText][1]}
                </h3>
              </div>
            </div>
          }

          {/*    Card     */}
          {!isLoading && news.map((item, id) => (
              <div key={id} className="card itemCard">
                {/*     If LINK exists    */}
                {item.link &&
                  <Link href={item.link} target="_blank" rel="noreferrer">
                  {/*   Image  */}
                  {item.image && <img src={item.image} alt="Story Image" />}
                  {/*   Headline  */}
                  <h3>{item.headline}</h3>
                  {/*   Body  */}
                  {item.body && <p>{item.body}</p>}
                  </Link>
                }
                {/*    If LINK doesn't exist   */}
                {!item.link &&
                  <div>
                    {/*   Image  */}
                    {item.image && <img src={item.image} alt="Story Image" />}
                    {/*   Headline  */}
                    <h3>{item.headline}</h3>
                    {/*   Body  */}
                    {item.body && <p>{item.body}</p>}
                  </div>
                }
                {/*     Related Items    */}
                {item.related && 
                  <div>
                    <h4>Related</h4>
                    <ul>
                      {item.related.map(( item, id) => (
                        <li key={id}>
                          {/*     Link    */}
                          <Link href={item.link}>
                            {/*     Headline    */}
                            {item.headline}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
              }
            </div>
          ))}
        </div>
      }	
  </div>
  );
};


