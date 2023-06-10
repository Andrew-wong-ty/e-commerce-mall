import React, {useEffect, useState} from "react";
import {Avatar, Breadcrumb, Carousel, Image} from "antd";
import ImageCarousel from "../components/ImageCarousel";
import GoodsCard from "../components/GoodsCard";
import ProductDetail from "../components/ProductDetail";
import { Card} from 'antd';
import {resolvePath, useNavigate} from "react-router-dom";
import {getAllOnSaleProducts, getProductBySellerId} from "../configs/services";
const gridStyle = {
    width: '20%',
    textAlign: 'center',
};
const contentStyle = {
    marginLeft:'-50px',
    marginRight:'-50px'
};


function HomePage() {
    const navigate = useNavigate()
    const [productList,setProductList] = useState([])
    useEffect(() => {
        // 获取销量前10的商品
        getAllOnSaleProducts({pageSize:10, nthPage: 1}).then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200){
                const arrWithKey = response.object.goods.map((item) => {
                    const goodsDetailImagesArray = item.goodsDetailImages.split(";");
                    return { ...item, key: item.id, goodsDetailImages: goodsDetailImagesArray };
                });
                setProductList(arrWithKey)
                console.log("productList=>", arrWithKey)
            }
        }).catch(err=>{
            console.log("getAllOnSaleProducts err", err)
        })
    }, []);
    return (
        <div>
            <Breadcrumb style={{margin: '16px 0',}}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
            </Breadcrumb>
            <div style={contentStyle}>
                <Image
                    src="http://localhost:8080/files/download/81021d57-5f56-4729-8f5e-db56cb3b9795-FILE-pdd.jpg"
                    preview={false}
                />
            </div>
            <br/>
            <Card title="Top Sales">
                {
                    productList.map((item, index)=>(
                        <Card.Grid style={gridStyle} onClick={()=>{navigate(`details/${item.id}`)}} key={index}>
                            <ProductDetail
                                image={item.goodsDetailImages[0]}
                                price={`\$${item.goodsPrice}`}
                                name={item.goodsName}
                                description={item.goodsDescription}
                            />
                        </Card.Grid>
                    ))
                }
            </Card>


        </div>
    )
}

export default HomePage;