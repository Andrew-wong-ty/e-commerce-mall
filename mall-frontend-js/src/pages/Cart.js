import {MinusCircleOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {validateJwt} from "../utils/serviceUtils";
import Constant from "../store/constant";
import {useNavigate} from "react-router-dom";
import {Button, Image, Pagination, Table, Tag} from "antd";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {postAddOrUpdateCart, postDeleteCart, postGetUserCart} from "../configs/services";
const ButtonGroup = Button.Group;

function Cart() {
    const [userId, setUserId] = useState(-1);
    const [cartList, setCartList] = useState([])
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [pageSize,setPageSize] = useState(10)
    const [nthPage,setNthPage] = useState(1)
    const [totalItem,setTotalItem] = useState(1)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onShowSizeChange = (current, pageSize) => {
        setNthPage(current);setPageSize(pageSize);
    };
    const onPageAndSizeChange = (page, pageSize) => {
        setNthPage(page);setPageSize(pageSize);
    }
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    useEffect(()=>{
        validateJwt().then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200 && response.object.identity===Constant.BUYER_IDENTITY) {
                console.log("user jwt=>", response.object)
                setUserId(response.object.userId);
            } else {
                navigate("/login")
            }
        }).catch(err=>{
            console.log("验证不通过, 本地不存在ACCESS-TOKEN; err",err)
            navigate("/login")
        })
    },[])
    const fetchCart = () =>{
        postGetUserCart({userId:userId, nthPage:nthPage, pageSize: pageSize}).then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200) {
                console.log(response)
                const newObjList = response.object.carts.map((item, index) => {
                    return { key: index, ...item };
                });
                setCartList(newObjList)
            } else {
            }
        }).catch(err=>{
        })
    }
    useEffect(()=>{
        if(userId===-1) return;
        setLoading(true)
        fetchCart()
        setLoading(false)
    },[userId])

    const deleteCart = (record) => {
        if(userId===-1) return;
        setLoading(true)
        const postRecord = { ...record, userId:userId };
        postDeleteCart(postRecord).then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200) {
                fetchCart()
            }
        })
        setLoading(false)
    }
    const updateGoodsNum = (record, num) => {
        console.log("record=>", record)
        if(userId===-1) return;
        const postRecord = { ...record, num: num, userId:userId }; // 这里的num是变化的数量, 而不是最终的数量
        console.log("newRecord=>", postRecord)
        postAddOrUpdateCart(postRecord).then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200) {
                // 离线更改本地的记录
                const newCartList = cartList.map(item => {
                    if (item.key === record.key) {
                        return {
                            ...item,
                            goodsNum: record.goodsNum+num
                        };
                    }
                    return item;
                });
                setCartList(newCartList)
            }
        })
    }

    const columns = [
        {
            title: '',
            dataIndex: 'goodsImage',
            key: 'goodsImage',
            align: 'center',
            render: (imageUrl) => <Image src={imageUrl} height={90}/>,
        },
        {
            title: 'Goods Name',
            dataIndex: 'goodsName',
            key: 'goodsName',
            align: 'center',
        },
        {
            title: 'Price',
            dataIndex: 'goodsPrice',
            key: 'goodsPrice',
            align: 'center',
        },
        {
            title: 'Discount',
            dataIndex: 'goodsDiscount',
            key: 'goodsDiscount',
            align: 'center',
        },
        {
            title: 'Number',
            key: 'action1',
            align: 'center',
            render: (_, record) => (
                <ButtonGroup>
                    <Button key="0" onClick={()=>{
                        updateGoodsNum(record, -1)
                    }} icon={<MinusOutlined />} />
                    <Button key="1">{record.goodsNum}</Button>
                    <Button key="2" onClick={()=>{
                        updateGoodsNum(record, 1)
                    }} icon={<PlusOutlined />} />
                </ButtonGroup>
            ),
        },
        {
            title: '',
            key: 'action2',
            align: 'center',
            render: (_, record) => (
                <Button onClick={()=>{deleteCart(record)}} type="circle" >
                    <span style={{fontSize:'20px', color:'red'}}>
                        <MinusCircleOutlined />
                    </span>
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h1>Cart</h1>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                loading={loading}
                dataSource={cartList}
                pagination={false}
            />
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

export default Cart;