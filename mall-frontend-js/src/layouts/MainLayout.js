import React from "react";
import {Outlet} from "react-router-dom";
import "./MainLayout.css"
import {Layout, Menu, theme } from 'antd';
const { Header, Content, Footer } = Layout;
const MainLayout = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
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
                }}
            >
                {/*<div className="demo-logo" />*/}
                {/*<Menu*/}
                {/*    theme="dark"*/}
                {/*    mode="horizontal"*/}
                {/*    defaultSelectedKeys={['2']}*/}
                {/*    items={new Array(3).fill(null).map((_, index) => ({*/}
                {/*        key: String(index + 1),*/}
                {/*        label: `nav ${index + 1}`,*/}
                {/*    }))}*/}
                {/*/>*/}
                <div><span className="headline">E-Mall</span></div>
            </Header>
            <Content
                className="site-layout"
                style={{
                    padding: '0 50px',
                }}
            >

                <div
                    style={{
                        padding: 24,
                        minHeight: 380,
                        background: colorBgContainer,
                    }}
                >
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