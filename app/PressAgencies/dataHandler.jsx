"use client"

import React, {useState} from "react";
import Link from "next/link";

const images = require.context('../logos', true);
const imageList = images.keys().map(image => images(image));

export default function DataHandler() {
    //  Use States
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectDiv, setSelectDiv] = useState(true);

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
            <div className="introContainer">
                <p><b>Open Global News</b> is committed to upholding the fundamental values of open, uncensored journalism, championing truth, diversity, and transparency in an ever-changing world of information.</p>

                <p>A free, uncensored global press serves as the cornerstone of democracy, empowering citizens with diverse, unfiltered information to make informed decisions and hold institutions accountable for a just and transparent society.</p>

                <p className="lastPara">Click on a news agency logo below to download the latest headlines.</p>
            </div>
            
            {/* ////////////////////////////////////////////// */}
            {/*   Logo Selection Button  */}
            {/* ////////////////////////////////////////////// */}
            {selectDiv &&
                    <div className="container">
                    
                    {imageList.map((image, id) => {
                        const srcArray = image.default.src.split("/");
                        const wanted = srcArray[4];
                        const wantedArray = wanted.split(".");
                        const logoEndpoint = wantedArray[0];
                        
                        return (
                            <button key={id} className="px-2 py-1 rounded-md" onClick={(e) => {
                            e.preventDefault();
                            handleClick(logoEndpoint);
                            }}>
                            <img src={image.default.src} alt={logoEndpoint} />
                        </button>
                        )
                    })}
                </div>
            }


            {/* ////////////////////////////////////////////// */}
            {/*     BACK Button    */}
            {/* ////////////////////////////////////////////// */}
            {!selectDiv && 
                <div className="button">
                    <button onClick={() => { setSelectDiv(true) }}>
                        BACK
                    </button> 
                </div> 
            }


            {/* ////////////////////////////////////////////// */}
            {/*     Is Loading Spinner    */}
            {/* ////////////////////////////////////////////// */}
            { isLoading &&
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            }

        
            {/* ////////////////////////////////////////////// */}
            {/*     News Item Display Cards    */}
            {/* ////////////////////////////////////////////// */}
            {!selectDiv && 
                <div>
                    {!isLoading && news.map((item, id) => (
                        <div key={id} className="card itemCard">
                            <Link href={item.link} target="_blank" rel="noreferrer">
                                {item.image && <img src={item.image} alt="Story Image" />}
                                <h3>{item.headline}</h3>
                                {item.body && <p>{item.body}</p>}
                            </Link>
                            {item.related && 
                                <div>
                                    <h4>Related</h4>
                                    <ul>
                                        {item.related.map(( item, id) => (
                                            <li key={id}>
                                                <Link href={item.link}>{ item.headline}</Link>
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


