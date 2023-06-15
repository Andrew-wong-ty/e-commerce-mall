import React, {useEffect, useState} from "react";
import {Breadcrumb, Card, Pagination} from "antd";
import ProductDetail from "../components/ProductDetail";
import {useNavigate} from "react-router-dom";
import {getAllOnSaleProducts} from "../configs/services";
const gridStyle = {
    width: '20%',
    textAlign: 'center',
};

function AllGoods() {
    const navigate = useNavigate()
    const [productList,setProductList] = useState([])
    const [pageSize,setPageSize] = useState(10)
    const [nthPage,setNthPage] = useState(1)
    const [totalItem,setTotalItem] = useState(1)
    useEffect(() => {
        getAllOnSaleProducts({pageSize:pageSize, nthPage: nthPage}).then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200){
                const arrWithKey = response.object.goods.map((item) => {
                    const goodsDetailImagesArray = item.goodsDetailImages.split(";");
                    return { ...item, key: item.id, goodsDetailImages: goodsDetailImagesArray };
                });
                setProductList(arrWithKey)
                setTotalItem(response.object.totalElements)
                console.log("productList=>", arrWithKey)
            }
        }).catch(err=>{
            console.log("getAllOnSaleProducts err", err)
        })
    }, [nthPage, pageSize]);
    const onShowSizeChange = (current, pageSize) => {
        setNthPage(current);setPageSize(pageSize);
    };
    const onPageAndSizeChange = (page, pageSize) => {
        setNthPage(page);setPageSize(pageSize);
    }
    return (
        <div>
            <Breadcrumb style={{margin: '16px 0',}}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>All Items</Breadcrumb.Item>
            </Breadcrumb>
            <Card >
                {
                    productList.map((item, index)=>(
                        <Card.Grid style={gridStyle} onClick={()=>{navigate(`/details/${item.id}`)}}>
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
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Pagination
                    showSizeChanger
                    onShowSizeChange={onShowSizeChange}
                    onChange={onPageAndSizeChange}
                    defaultCurrent={nthPage}
                    total={totalItem}
                    showTotal={(total) => `Total ${total} items`}
                />
            </div>

        </div>
    )
}

export default AllGoods;