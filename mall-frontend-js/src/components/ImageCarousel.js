import React from "react";
import { Carousel } from "antd";
import "./General.css";

const ImageCarousel = ({ images, autoplay = true }) => {
    return (
        <Carousel autoplay={autoplay}>
            {images.map((image, index) => (
                <div key={index} className="carousel-slide">
                    <img src={image} alt={`Image ${index}`} className="carousel-image" />
                </div>
            ))}
        </Carousel>
    );
};


export default ImageCarousel;