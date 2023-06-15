import {MinusCircleOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {validateJwt} from "../utils/serviceUtils";
import Constant from "../store/constant";
import {useNavigate} from "react-router-dom";
import {Button, Col, Image, message, Pagination, Row, Table, Tag} from "antd";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {postAddOrUpdateCart, postDeleteCart, postGetUserCart, postMultipleOrdering} from "../configs/services";
const ButtonGroup = Button.Group;

function Cart() {
    const [userId, setUserId] = useState(-1);
    const [cartList, setCartList] = useState([])
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderDisable, setOrderDisable] = useState(true);
    const [pageSize,setPageSize] = useState(10)
    const [nthPage,setNthPage] = useState(1)
    const [totalItem,setTotalItem] = useState(1)
    const [selectedGoods, setSelectedGoods] = useState([])
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onShowSizeChange = (current, pageSize) => {
        setNthPage(current);setPageSize(pageSize);
    };
    const onPageAndSizeChange = (page, pageSize) => {
        setNthPage(page);setPageSize(pageSize);
    }
    const onSelectChange = (newSelectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        // const selectedCart = cartList.filter(
        //     item => newSelectedRowKeys.includes(item.key)
        // );
        // setSelectedGoods(selectedCart);
        // console.log('selectedCart: ', selectedCart);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    useEffect(()=>{
        console.log("selectedGoods被改变!")
        const totalPrice = selectedGoods.reduce(
            (accumulator, currentValue) =>
                accumulator + currentValue.goodsDiscount * currentValue.goodsPrice*currentValue.goodsNum,
            0
        );
        console.log("total Price: ", totalPrice )
        setTotalPrice(totalPrice);
    }, [selectedGoods])
    useEffect(()=>{
        console.log("selectedRowKeys被改变!")
        const selectedCart = cartList.filter(
            item => selectedRowKeys.includes(item.key)
        );
        setSelectedGoods(selectedCart);
        if(selectedRowKeys.length!==0) setOrderDisable(false);
        else setOrderDisable(true);
    }, [selectedRowKeys])
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
                const selectedKey = selectedRowKeys.filter(item=>item!==record.key)
                const arr = Array.from({ length: selectedKey.length }, (_, index) => index);
                setSelectedRowKeys(arr)
                console.log("selectedKey=>", selectedKey)
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

    const generateOrder = () => {
        if(userId===-1) {
            message.error("User is invalid")
        }
        const newArray = selectedGoods.map((item) => ({
            userId: userId, // replace with your user ID
            goodsId: item.goodsId,
            goodsNum: item.goodsNum,
            cartId: item.cartId,
        }));
        postMultipleOrdering(newArray).then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200) {
                message.success("Order is generated, check it at \"My Orders\"")
                // 重新获取购物车
                fetchCart()
                setSelectedRowKeys([])
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
            <Row>
                <Col span={12}>
                     <h2>{selectedRowKeys.length} items selected, totally ${totalPrice.toFixed(2)}</h2>
                </Col>
                <Col span={12}>
                    <div style={{float:"right", marginTop:"15px"}}>
                        <Button
                            type="primary"
                            disabled={orderDisable}
                            onClick={()=>{generateOrder()}}
                        >Order now!</Button>
                    </div>
                </Col>
            </Row>

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