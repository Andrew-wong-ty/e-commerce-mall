import React, {useEffect, useState} from "react";
import {validateJwt} from "../utils/serviceUtils";
import Constant from "../store/constant";
import {useNavigate} from "react-router-dom";
import {Button, Col, Image, message, Pagination, Row, Table, Tag} from "antd";
import {MinusOutlined, PlusOutlined, MinusCircleOutlined} from "@ant-design/icons";
import {
    postDeleteFailedOrder, postGetSellerOrder,
    postGetUserOrder, postMakeDeliver
} from "../configs/services";
const ButtonGroup = Button.Group;

function UserOrder() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderList, setOrderList] = useState([])
    const [sellerId, setSellerId] = useState(-1);
    const [totalItem,setTotalItem] = useState(0)
    const [pageSize,setPageSize] = useState(5)
    const [nthPage,setNthPage] = useState(1)
    const onShowSizeChange = (current, pageSize) => {
        setNthPage(current);setPageSize(pageSize);
    };
    const onPageAndSizeChange = (page, pageSize) => {
        setNthPage(page);setPageSize(pageSize);
    }
    useEffect(()=>{
        validateJwt().then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200 && response.object.identity===Constant.SELLER_IDENTITY) {
                setSellerId(response.object.userId);
            } else {
                navigate("/login")
            }
        }).catch(err=>{
            console.log("验证不通过, 本地不存在ACCESS-TOKEN; err",err)
            navigate("/login")
        })
    },[])

    const fetchOrders = () => {
        if(sellerId===-1) return;
        postGetSellerOrder({sellerId:sellerId, nthPage:nthPage, pageSize:pageSize}).then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200) {
                const newObjList = response.object.orders.map((item, index) => {
                    return { key: index, ...item };
                });
                setOrderList(newObjList)
                setTotalItem(response.object.totalElement)
            }
        }).catch(err=>{

        })
    }

    useEffect(()=>{
        if(sellerId===-1) return;
        setLoading(true)
        fetchOrders()
        setLoading(false)
    },[sellerId, nthPage, pageSize])

    const makeDeliver = (record) =>{
        postMakeDeliver({orderId:record.orderId}).then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200) {
                message.success("Status is updated")
                fetchOrders()
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
            title: 'Number',
            width: 10,
            dataIndex: 'goodsNum',
            key: 'goodsNum',
            align: 'center',
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            align: 'center',
        },

        {
            title: 'Order Date',
            dataIndex: 'orderDateTime',
            key: 'orderDateTime',
            align: 'center',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            align: 'center',
            render: (_, record) =>
                (
                    <Tag color="magenta">{record.username}</Tag>
                )

        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            align: 'center',
        },
        {
            title: 'Status',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            align: 'center',
            render: (_, record) => {
                let color = "#87d068"
                let text = "";
                switch (record.orderStatus) {
                    case "CREATED":
                    {
                        color = "rgba(135,208,104,0.87)";
                        text = "CREATED";
                        break;
                    }
                    case "DELIVERING":
                    {
                        color = "#2db7f5";
                        text = "DELIVERING";
                        break;
                    }
                    case "SIGNED":
                    {
                        color = "#03fa2c";
                        text = "SIGNED";
                        break;
                    }
                    default:
                        break;
                }
                return (
                    <Tag color={color}>{text}</Tag>
                )
            }
        },
        {
            title: '',
            key: 'actions',
            align: 'center',
            render: (_, record) => {
                return (
                    <Button type="primary" disabled={record.orderStatus!=="CREATED"} onClick={()=>{makeDeliver(record)}}>Deliver</Button>
                )
            },
        },

    ];

    return (
        <div>
            <h1>Orders</h1>
            <Table
                columns={columns}
                loading={loading}
                dataSource={orderList}
                pagination={false}
            />
            <br/>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Pagination
                    showSizeChanger
                    defaultPageSize={5}
                    pageSizeOptions={[5,10,20,50,100]}
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

export default UserOrder;