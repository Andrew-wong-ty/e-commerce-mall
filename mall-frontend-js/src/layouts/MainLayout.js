import {validateIdentification} from "../utils/serviceUtils";
import {useDispatch} from "react-redux";
import {setCount, loginStatus, logoutStatus} from "../features/userSlice";
import {
    ShoppingCartOutlined,
    UserOutlined
} from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import {Outlet, Link, useNavigate} from "react-router-dom";
import "./MainLayout.css"
import {Layout, Menu, theme ,Input, Space, Col, Row } from 'antd';
import UserIcon from "../components/UserIcon";
import {postAccessToken} from "../configs/services";
const { Search } = Input;
const { Header, Content, Footer } = Layout;



const MainLayout = () => {
    // const {
    //     token: { colorBgContainer },
    // } = theme.useToken();
    const searchGoods = (value) => {
        console.log("Search:", value);
    }
    const navigate = useNavigate();
    const dispatch = useDispatch()
    useEffect(() => {
        // 在页面初始化的时候验证本地的JWT token是否过期, 如果没有过期, 后台会解析JWT token并且返回里面的内容, 包括(user id, name, identity)
        validateIdentification(dispatch)
    }, []);
    return (
        <Layout>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    height: '60px'
                }}
            >
                <Row className="headline">
                    <Col span={6}>
                        <span className="headlineText" onClick={()=>{navigate("/")}}>E-Commerce Mall</span>
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={10}>
                        <Search
                            placeholder="Search input item"
                            onSearch={searchGoods}
                            className="search"
                        />
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={2}>
                        <Link to={`all`}>
                            <span className="linkText">Goods</span>
                        </Link>
                    </Col>
                    <Col span={2}>
                        {/*<span className="linkIcon"><UserOutlined /></span>*/}
                        <div className="linkIcon">
                            <UserIcon/>
                        </div>

                    </Col>
                    <Col span={2}>

                        <span className="linkIcon" onClick={()=>{navigate("cart")}}><ShoppingCartOutlined /></span>
                    </Col>
                </Row>
            </Header>
            <Content className="site-layout">
                <div className="container">
                    <Outlet/>
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                E-Mall ©2023 Created by Tianyin Wang
            </Footer>
        </Layout>
    );
};
export default MainLayout;