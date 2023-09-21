"use client"

import React, {useState} from "react";
import Link from "next/link";
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
    subsets: ['latin'],
    weight: ['400', '700', '900']
});

//      COMPONENTS
const images = require.context('../logos', true);
const imageList = images.keys().map(image => images(image));
import Countries from '../json/countries.json';
import Titles from '../json/titles.json';

export default function DataHandler() {
    //  Use States
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectDiv, setSelectDiv] = useState(true);
    const [altText, setAltText] = useState("");
    const [presentImg, setPresentImg] = useState(null);
    const [suppObj, setSuppObj] = useState({});

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
        //      TODO    res.status = 500 bug fix
        const data = await res.json();
        const newsData = data.data;

        setNews(newsData);
        setIsLoading(false);
    };


    return (
        <div>
            
            {/* /////////////////////////////////////////// */}
            {/*         Opening Text            */}
            {/* /////////////////////////////////////////// */}
            <div className="introContainer">
                <p><b>Open Global News</b> is committed to upholding the fundamental values of open, uncensored journalism, championing truth, diversity, and transparency in an ever-changing world of information.</p>

                <p>A free, uncensored global press serves as the cornerstone of democracy, empowering citizens with diverse, unfiltered information to make informed decisions and hold institutions accountable for a just and transparent society.</p>

                <p className="lastPara">Click on a news agency logo below to download the latest headlines.</p>
            </div>
            
            {/* /////////////////////////////////////////// */}
            {/*   Logo Selection Button  */}
            {/* /////////////////////////////////////////// */}
            {selectDiv &&
                <div className="container">
                
                {/*     List of Agency Logos    */}
                {imageList.map((image, id) => {
                    const srcArray = image.default.src.split("/");
                    const wanted = srcArray[4];
                    const wantedArray = wanted.split(".");
                    const logoEndpoint = wantedArray[0];
                    
                    return (
                        <button
                                key={id}
                            className="px-2 py-1 rounded-md"
                            onClick={() => {
                                setPresentImg(image.default.src);
                                handleClick(logoEndpoint);
                            }}
                        >
                        <div className="group relative flex justify-center">
                            <img
                                onMouseEnter = {(e) => {
                                    setAltText(e.target.alt);
                                }}
                                src={image.default.src}
                                alt={logoEndpoint}
                                />
                                <span className="scale-0 rounded bg-gray-800 p-2 text-base font-bold text-white group-hover:scale-100 toolTip">
                                    {Countries[altText]}
                                </span>
                        </div>
                        </button>
                    )
                })}
                </div>
            }


            {/* /////////////////////////////////////////// */}
            {/*     BACK Button    */}
            {/* /////////////////////////////////////////// */}
            {!selectDiv && 
                <div className="backButton">
                    <button onClick={() => { setSelectDiv(true) }}>
                        BACK
                    </button> 
                </div> 
            }


            {/* /////////////////////////////////////////// */}
            {/*     Is Loading Spinner    */}
            {/* /////////////////////////////////////////// */}
            { isLoading &&
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            }

        
            {/* /////////////////////////////////////////// */}
            {/*     News Item Display Cards    */}
            {/* /////////////////////////////////////////// */}
            {!selectDiv && 
                <div>
                    {/*     Selected Agency's Logo    */}
                    {console.log(suppObj)}
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


