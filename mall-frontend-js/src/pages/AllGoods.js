import React from "react";
import {Breadcrumb} from "antd";

function AllGoods() {
    return (
        <div>
            <Breadcrumb style={{margin: '16px 0',}}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>ALl Items</Breadcrumb.Item>
            </Breadcrumb>
            这个是展示所有物品的页面
        </div>
    )
}

export default AllGoods;