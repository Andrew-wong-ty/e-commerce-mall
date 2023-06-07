import React from "react";
import "./General.css";
import {Image} from "antd";

const ProductDetail = ({image, price, name, description  }) => {
    return (
        <div>
            <Image preview={false} src={image}/>
            <br/>
            <div className="product-detail">
                <div className="product-detail-price">{price}</div>
                <div className="product-detail-name">{name}</div>
                <div className="product-detail-description">{description}</div>
            </div>
        </div>
    );
};

export default ProductDetail;