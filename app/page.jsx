"use client"

import React, { useState } from "react";
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
      fetchCache: 'force-no-store',
      dynamic: "force-dynamic",
    });

    // res.setHeader('cache-control', 'no-store');
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
                <b>Open Global News</b> is committed to upholding the fundamental values of open, journalism, championing truth, diversity, and transparency in an ever-changing world of information.
          </p>
          

          <p>
                A free, global press serves as the cornerstone of democracy, empowering citizens with diverse, unfiltered information to make informed decisions and hold institutions accountable for a just and transparent society.
          </p>

          <p className="lastPara">
                Click on a news agency logo below to download the latest headlines.
          </p>
        </div>
      </div>
      }
      
      
      {/* //////////////////////////////////////////// */}
      {/*   Logo Selection Button List  */}
      {/* //////////////////////////////////////////// */}
      {selectDiv &&
        <div className="logoContainer flex-wrap">
        
          {/*     List of Agency Logos    */}
          {imageList.map((image, id) => {
            const srcArray = image.default.src.split("/");
            const wanted = srcArray[4];
            const wantedArray = wanted.split(".");
            const logoEndpoint = wantedArray[0];
            
            return (
              //    LOGO BUTTON
              <div key={id} className="button">
                <button
                    className="px-2 py-1 rounded-md"
                    onClick={() => {
                    setPresentImg(image.default.src);
                    handleClick(logoEndpoint);
                    }}
                >
                    <div className="group relative flex">
                    {/*     IMAGE    */}
                    <img
                        onMouseEnter = {(e) => { setAltText(e.target.alt)}}
                        src={image.default.src}
                        alt={logoEndpoint}
                    />
                    {/*    TOOLTIP      */}
                    <span className="scale-0 rounded bg-transparent p-2 text-xl font-bold text-red-300 group-hover:scale-100 toolTip">
                        {Countries[altText]}
                    </span>
                    </div>
                </button>
            </div>
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


      {/* ////////////////////////////////// */}
      {/*     Loading Spinner    */}
      {/* ////////////////////////////////// */}
      { isLoading &&
        <div className="loading">
          <div className="flex">
            <div className="spinner"></div>
            <p>Collecting required data...</p>
          </div>
        </div>
      }

  
      {/* //////////////////////////////////////////////// */}
      {/*     News Item Display Cards    */}
      {/* //////////////////////////////////////////////// */}
      {!selectDiv && 
        <div className="cardContainer">
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
                    {item.image && <img src={item.image} alt="Item Image" />}
                    {/*   Headline  */}
                    <h3>{item.headline}</h3>
                    {/*   Body  */}
                    {item.body && <p>{item.body}</p>}
                  </Link>
                }
                {/*    If LINK doesn't exist   */}
                {!item.link || item.link === undefined &&
                  <div>
                    {/*   Image  */}
                    {item.image && <img src={item.image} alt="Item Image" />}
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


