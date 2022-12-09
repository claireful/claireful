import React from 'react';
import "./home.css";
const photo_1 = require("../../utils/photo-home-1.jpg");


export const Home = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
            <img src={photo_1} className="photo-home" alt="image cookie" />
            <div className="home-text-container">
                <div className='home-text'>Cookies Healthy et faits maison</div>
            </div>
        </div>
    )
}
