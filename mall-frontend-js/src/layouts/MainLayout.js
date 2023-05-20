import {useDispatch} from "react-redux";
import {setCount, loginStatus, logoutStatus} from "../features/userSlice";
import {
    ShoppingCartOutlined,
    UserOutlined
} from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import {Outlet,Link } from "react-router-dom";
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
    const dispatch = useDispatch()
    useEffect(() => {
        // 在页面初始化的时候验证本地的JWT token是否过期, 如果没有过期, 后台会解析JWT token并且返回里面的内容, 包括(user id, name, identity)
        postAccessToken().then(res=>{
            const response = JSON.parse(res.data)
            dispatch(loginStatus(response.object))
        }).catch(err=>{
            console.log("本地无身份或身份过期, err:", err)
            dispatch(logoutStatus())
        })
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
                        <span className="headlineText">E-Commerce Mall</span>
                    </Col>
                    <Col span={12}>
                        <Search
                            placeholder="Search input item"
                            onSearch={searchGoods}
                            className="search"
                        />
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

                        <span className="linkIcon"><ShoppingCartOutlined /></span>
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