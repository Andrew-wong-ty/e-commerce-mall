import nothing from "../asset/nothing.png"
import React, {useEffect, useState} from "react";
import {Breadcrumb, Card, Pagination, Image} from "antd";
import ProductDetail from "../components/ProductDetail";
import {useNavigate, useParams} from "react-router-dom";
import {getAllOnSaleProducts, getFuzzySearchProducts, getGoodsByCategory} from "../configs/services";
import {useLocation, useSearchParams} from "react-router-dom";

const gridStyle = {
    width: '20%',
    textAlign: 'center',
};

function AllGoods() {
    const [search, setSearch] = useSearchParams()
    const category = search.get('category')
    const navigate = useNavigate()
    const location = useLocation();
    const [productList,setProductList] = useState([])
    const [pageSize,setPageSize] = useState(10)
    const [nthPage,setNthPage] = useState(1)
    const [totalItem,setTotalItem] = useState(1)
    useEffect(()=>{
        if(category!=null) {
            getGoodsByCategory({goodsCategory: category, pageSize:pageSize, nthPage: nthPage}).then(res=>{
                const response = JSON.parse(res.data)
                if(response.code===200){
                    const arrWithKey = response.object.goods.map((item) => {
                        const goodsDetailImagesArray = item.goodsDetailImages.split(";");
                        return { ...item, key: item.id, goodsDetailImages: goodsDetailImagesArray };
                    });
                    setProductList(arrWithKey)
                    setTotalItem(response.object.totalElements)
                }
            })
        }
    },[nthPage, pageSize])
    useEffect(() => {
        if(category!=null) return;
        console.log("location INFO:", location.state)
        let searchContent;
        if(location.state!==null && location.state.search.trim().length !== 0) {
            searchContent = location.state.search;
        } else {
            searchContent = "";
        }
        getFuzzySearchProducts({goodsName: searchContent, pageSize:pageSize, nthPage: nthPage}).then(res=>{
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

        // getAllOnSaleProducts({pageSize:pageSize, nthPage: nthPage}).then(res=>{
        //     const response = JSON.parse(res.data)
        //     if(response.code===200){
        //         const arrWithKey = response.object.goods.map((item) => {
        //             const goodsDetailImagesArray = item.goodsDetailImages.split(";");
        //             return { ...item, key: item.id, goodsDetailImages: goodsDetailImagesArray };
        //         });
        //         setProductList(arrWithKey)
        //         setTotalItem(response.object.totalElements)
        //         console.log("productList=>", arrWithKey)
        //     }
        // }).catch(err=>{
        //     console.log("getAllOnSaleProducts err", err)
        // })
    }, [nthPage, pageSize, location]);
    const onShowSizeChange = (current, pageSize) => {
        setNthPage(current);setPageSize(pageSize);
    };
    const onPageAndSizeChange = (page, pageSize) => {
        setNthPage(page);setPageSize(pageSize);
    }
    return (
        <div>
            <Breadcrumb style={{margin: '16px 0',}}>
                <Breadcrumb.Item key="0">Home</Breadcrumb.Item>
                <Breadcrumb.Item key="1">All Items</Breadcrumb.Item>
            </Breadcrumb>
            {location.state!==null && location.state.search.trim().length !== 0 ? <div style={{marginBottom: "10px"}}>Search Results for '{location.state.search}' </div> : null}
            {category!==null ?
                <div style={{marginBottom:"10px"}}>
                    <span style={{fontWeight:"600"}}>Category:</span> <span>{category}</span>
                </div>
                :null}
            {productList.length===0?
                <div style={{textAlign:"center"}}>
                    <Image
                        preview={false}
                        src={nothing}
                        width={"50%"}
                    />
                </div>
                :
                <>
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
                </>

            }


        </div>
    )
}

export default AllGoods;