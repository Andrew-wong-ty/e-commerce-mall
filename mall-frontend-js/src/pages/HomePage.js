import {CheckCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import cashBack from "../asset/bannerCash.jpg"
import left1 from "../asset/left1.jpg"
import left2 from "../asset/left2.jpg"
import left3 from "../asset/left3.jpg"
import right1 from "../asset/right1.jpg"
import right2 from "../asset/right2.jpg"
import avatar from "../asset/avatar.jpg"
import Bags from  "../asset/Bags.jpg"
import Cameras from  "../asset/Cameras.jpg"
import Clothes from  "../asset/Clothes.jpg"
import Kids from  "../asset/Kids.jpg"
import Glasses from  "../asset/Glasses.jpg"
import Laptops from  "../asset/Laptops.jpg"
import Makeup from  "../asset/Makeup.jpg"
import Shoes from  "../asset/Shoes.jpg"
import Mobile from  "../asset/Mobile.jpg"
import Food from  "../asset/Foods.jpg"
import instruction from "../asset/instruction.png"
import React, {useEffect, useState} from "react";
import {Avatar, Breadcrumb, Carousel, Image, message, notification, Row, Col} from "antd";
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
const cateGridStyle = {
    width: '10%',
    textAlign: 'center',
    margin: "0px",
    cursor: "pointer"
};
const contentStyle = {
    marginLeft:'-50px',
    marginRight:'-50px'
};

const categories = [
    {image: Bags, key:"BAGS", name:"Bags",},
    {image: Cameras, key:"CAMERAS", name:"Cameras",},
    {image: Clothes, key:"CLOTHES", name:"Clothes",},
    {image: Kids, key:"KIDS", name:"Kids",},
    {image: Glasses, key:"GLASSES", name:"Glasses",},
    {image: Mobile, key:"MOBILE", name:"Mobile",},
    {image: Makeup, key:"MAKEUP", name:"Makeup",},
    {image: Shoes, key:"SHOES", name:"Shoes",},
    {image: Laptops, key:"LAPTOPS", name:"Laptops",},
    {image: Food, key:"FOOD", name:"Food",},
]


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

    const openNotification = () => {
        notification.open({
            type: "success",
            message: 'Test user and seller account:',
            description: <div>
                <span>User->username: abcd, password:123456</span>
                <br/>
                <span>Seller->username: Grocery2, password:123456</span>
                <br/>
                <div style={{margin:"10px"}}>
                    <Image
                        preview={false}
                        src={instruction}
                    />
                </div>
            </div>,
            duration: null,
            style: {
                marginTop: '40px'
            },
            placement: "topLeft"
        });
    };

    useEffect(()=>{
        openNotification()
    },[])
    return (
        <div>
            <Breadcrumb style={{margin: '16px 0',}}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
            </Breadcrumb>
            <div style={contentStyle}>
                <Row>
                    <Col span={16}>
                        <div style={{marginTop:"0.9%"}}>
                            <Carousel autoplay >
                                <Image preview={false} src={left1} width={"100%"}/>
                                <Image preview={false} src={left2} width={"100%"}/>
                                <Image preview={false} src={left3} width={"100%"}/>
                            </Carousel>
                        </div>

                    </Col>
                    <Col span={8}>
                        <Row>
                            <Col span={24}>
                                <div style={{margin:"1.5% 0% 0.5% 1%"}}>
                                    <Image preview={false} src={right1} width={"100%"}/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <div style={{margin:"0.5% 0% 1% 1%"}}>
                                    <Image preview={false} src={right2} width={"100%"}/>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>

            <br/>

            <Card title="CATEGORIES">
                {
                    categories.map((item, index)=>(
                        <Card.Grid style={cateGridStyle} onClick={()=>{navigate(`/all?category=${item.key}`)}} key={index}>
                            <div><Image src={item.image} preview={false}/><span style={{fontWeight:"700"}}>{item.name}</span></div>
                        </Card.Grid>
                    ))
                }
            </Card>
            <br/>
            <Card title={<>
                <span style={{fontWeight:"700"}}>TOP SALES</span>
                <span style={{color:"grey"}}>    | <CheckCircleOutlined /> 100% Authentic | <CheckCircleOutlined /> 7-Day Returns | <CheckCircleOutlined /> Shipping Discounts
                </span>
                <span onClick={()=>{navigate("/all")}} style={{color:"orange", marginLeft:"10px", cursor:"pointer"}}> <RightCircleOutlined /> See All</span>
            </>}>
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
            <br/>
            <div><Image width={"100%"} src={cashBack} preview={false}/></div>


        </div>
    )
}

export default HomePage;