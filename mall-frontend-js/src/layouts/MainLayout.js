import {
    ShoppingCartOutlined,
    UserOutlined
} from '@ant-design/icons';
import React, {useState} from "react";
import {Outlet,Link } from "react-router-dom";
import "./MainLayout.css"
import {Layout, Menu, theme ,Input, Space, Col, Row } from 'antd';
const { Search } = Input;
const { Header, Content, Footer } = Layout;

const MainLayout = () => {
    const {role,setRole} = useState("user"); // 用户身份标识, user or seller
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const searchGoods = (value) => {
        console.log("Search:", value);
    }
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
                        <span className="linkIcon"><UserOutlined /></span>
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