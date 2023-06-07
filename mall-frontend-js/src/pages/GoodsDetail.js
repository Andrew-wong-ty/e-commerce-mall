import { MinusOutlined, PlusOutlined, QuestionOutlined } from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {getAllOnSaleProducts, getGoodsByGoodsId} from "../configs/services";
import {Col, message, Row, Image, InputNumber, Button, Divider, Card} from 'antd';
const ButtonGroup = Button.Group;
const imageStyle = {
    display: "block",
    margin: "auto",
};

const GoodsDetail = () => {
    const { detailId } = useParams(); // 获取路由参数 detailId
    const [goodsDetail, setGoodsDetail] = useState({});
    const [purchaseNum, setPurchaseNum] = React.useState(1);
    useEffect(() => {
        // 获取销量前10的商品
        getGoodsByGoodsId({goodsId:detailId}).then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200){
                message.success("Obtain goods success")
                const goodsDetailImagesArray = response.object.goodsDetailImages.split(";");
                setGoodsDetail({ ...response.object,  goodsDetailImages: goodsDetailImagesArray })
            }
        }).catch(err=>{
            console.log("getAllOnSaleProducts err", err)
        })
    }, []);


    const handleOnChange = (newValue) => {
        setPurchaseNum(newValue);
    };
    return (
        <div>
            <div style={{ marginTop: "30px" }}></div>
            <Card title="Details">
            <Row>
                <Col span={12} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ width: "50%", textAlign: "center" }}>
                        {goodsDetail.goodsDetailImages && goodsDetail.goodsDetailImages.length > 0 ? (
                            <Image src={goodsDetail.goodsDetailImages[0]} />
                        ) : null}
                    </div>
                </Col>

                <Col span={12}>
                    <div style={{ marginLeft: "30px",marginRight: "45px" }}>
                        <span style={{ fontSize: "40px" }}>
                            {goodsDetail.goodsName ? (
                                <>{goodsDetail.goodsName}</>
                            ) : null}
                        </span>
                        <Row>
                            <Col span={18}>
                                <p style={{ fontSize: "18px" }}>
                                    {goodsDetail.goodsHeadline ? (<>{goodsDetail.goodsHeadline}</>) : null}
                                </p>
                            </Col>
                            <Col span={6}>
                                <h1>
                                    {goodsDetail.goodsPrice ? (<>${goodsDetail.goodsPrice}</>) : null}
                                </h1>
                            </Col>
                        </Row>
                        <div>
                            <p style={{ fontSize: "15px"}}>
                                {goodsDetail.goodsDescription ? (<>{goodsDetail.goodsDescription}</>) : null}
                            </p>
                        </div>
                        <Divider />
                        <div style={{ margin: "10px 0" }}>
                            <span style={{ fontSize: "17px", marginRight: "8px" }}>Number</span>
                            <ButtonGroup>
                                <Button onClick={()=>{if(purchaseNum>1) setPurchaseNum(purchaseNum-1)}} icon={<MinusOutlined />} />
                                <Button>{purchaseNum}</Button>
                                <Button onClick={()=>{setPurchaseNum(purchaseNum+1)}} icon={<PlusOutlined />} />
                            </ButtonGroup>
                        </div>
                        <Divider />
                            <Button type="primary" size="large" style={{ marginRight: "8px" }}>
                                <span style={{ fontSize: "16px" }}>Add to Cart</span>
                            </Button>
                            <Button size="large">
                                <span style={{ fontSize: "16px" }}>Buy it now</span>
                            </Button>

                        {/*<Row>*/}
                        {/*    <Col span={12}>*/}
                        {/*        <div style={{ display: "flex", justifyContent: "center" }}>col-12</div>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={12}>*/}
                        {/*        <div style={{ display: "flex", justifyContent: "center" }}>col-12</div>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                    </div>
                </Col>
            </Row>
            </Card>
            <br/>
            <div>
                {goodsDetail.goodsDetailImages && goodsDetail.goodsDetailImages.length > 0 ? (
                    goodsDetail.goodsDetailImages.map((image, index) => (
                        index > 0 && <div style={{ display: "flex", justifyContent: "center" }}>
                            <Image key={index} src={image} preview={false}/>
                        </div>
                    ))
                ) : (
                    <p>空列表</p>
                )}
            </div>
        </div>
    );
};

export default GoodsDetail;