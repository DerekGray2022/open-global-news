"use client"

import React, {useState} from "react";
import Link from "next/link";

// 		Components
import apImage from '../logos/AssocPress.jpg';
// import apText from '../Logos/USA/AssocPress/AssocPress.json';

const images = require.context('../logos', true);
const imageList = images.keys().map(image => images(image));

export default function DataHandler() {
    //  Use States
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectDiv, setSelectDiv] = useState(true);

    //  Functions
    const handleClick = async (endpoint) => {
        setNews([]);
        setSelectDiv(false);
        setIsLoading(true);

        const endpointString = `/PressAgencies/${endpoint}`;
        const res = await fetch(endpointString, {
            method: "GET",
            next: {
                revalidate: 0
            },
        });
        const data = await res.json();
        const newsData = data.data;

        setNews(newsData);

        setIsLoading(false);
    };


    return (
        <div>
            {/* ////////////////////////////////////////////////// */}
            {/*   Logo Selection Button  */}
            {/* ////////////////////////////////////////////////// */}
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
                            <img src={image.default.src} alt="Story Image" />
                        </button>
                        )
                    })}
            </div>}


            {/* ////////////////////////////////////////////////// */}
            {/*     Is Loading Spinner    */}
            {/* ////////////////////////////////////////////////// */}
			{ isLoading &&
				<div className="loading">
					<div className="spinner"></div>
					<p>Loading...</p>
                </div>}


            {/* ////////////////////////////////////////////////// */}
            {/*     BACK Button    */}
            {/* ////////////////////////////////////////////////// */}
            {!selectDiv && 
                <div>
                    <button onClick={() => { setSelectDiv(true) }}>
                        BACK
                    </button> 
                </div> 
            }

            
            {/* ////////////////////////////////////////////////// */}
            {/*     News Item Display Cards    */}
            {/* ////////////////////////////////////////////////// */}
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


