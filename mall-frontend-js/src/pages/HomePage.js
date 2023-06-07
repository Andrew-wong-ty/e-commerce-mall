import React, {useEffect, useState} from "react";
import {Avatar, Breadcrumb, Carousel, Image} from "antd";
import ImageCarousel from "../components/ImageCarousel";
import GoodsCard from "../components/GoodsCard";
import ProductDetail from "../components/ProductDetail";
import { Card} from 'antd';
import {resolvePath, useNavigate} from "react-router-dom";
import {getAllOnSaleProducts, getProductBySellerId} from "../configs/services";
const { Meta } = Card;
const gridStyle = {
    width: '20%',
    textAlign: 'center',
};
const images = [
    'http://120.24.230.237:9898/files/c14b051471134fbc9e00ab29ca12b226',
    'http://120.24.230.237:9898/files/a32e0b75fc314cbdb719d6be16e3a326',
    'http://120.24.230.237:9898/files/832da423f59a426fac5af011885cc6a6',
];
const goods = [
    {
        image: "http://localhost:8080/files/download/570119d0-0ec1-450c-ba3f-bf1a04243396-FILE-QQ%E6%88%AA%E5%9B%BE20211201031325.jpg",
        id:'1',
    },
    {
        image: "http://localhost:8080/files/download/570119d0-0ec1-450c-ba3f-bf1a04243396-FILE-QQ%E6%88%AA%E5%9B%BE20211201031325.jpg",
        id:'2',
    },
    {
        image: "http://localhost:8080/files/download/570119d0-0ec1-450c-ba3f-bf1a04243396-FILE-QQ%E6%88%AA%E5%9B%BE20211201031325.jpg",
        id:'3',
    },
    {
        image: "http://localhost:8080/files/download/570119d0-0ec1-450c-ba3f-bf1a04243396-FILE-QQ%E6%88%AA%E5%9B%BE20211201031325.jpg",
        id:'4',
    },
]

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
                />
            </div>
            <br/>
            <Card title="Top Sales">
                {
                    productList.map((item, index)=>(
                        <Card.Grid style={gridStyle} onClick={()=>{navigate(`details/${item.id}`)}}>
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