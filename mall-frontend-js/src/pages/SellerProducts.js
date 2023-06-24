import "./Page.css"
import {AppstoreOutlined, LoadingOutlined, PlusOutlined, UploadOutlined} from '@ant-design/icons';
import {validateJwt} from "../utils/serviceUtils";
import {getProductBySellerId, postNewProduct} from "../configs/services";
import React, {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {
    Button,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Select,
    Upload,
    Switch,
    Space,
    Table,
    Tag,
    Image,
    Pagination,
    Row, Col
} from "antd";
import LocalStorageUtil from "../store/localStorageUtil";
import {baseUrl} from "../configs/HttpService";
const { TextArea } = Input;
const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
        return e;
    }
    console.log("fileList=>",e?.fileList)
    return e?.fileList;
};





const GeneralFormRules = [{required: true, message: 'Please input!'}];
function SellerProducts() {
    const [modalHeight, setModalHeight] = useState(0);
    const [modalTitle, setModalTitle] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [nthPage, setNthPage] = useState(1);
    const [formMode, setFormMode] = useState(0); // 0表示新增, 1表示修改
    const [totalItem, setTotalItem] = useState(0);
    const [imageList, setImageList] = useState([])
    const [productList, setProductList] = useState([]);
    const [sellerId, setSellerId] = useState(-1);
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onShowSizeChange = (current, pageSize) => {
        setNthPage(current);setPageSize(pageSize);
    };
    const onPageAndSizeChange = (page, pageSize) => {
        setNthPage(page);setPageSize(pageSize);
        console.log(page, pageSize);
    }
    useEffect(() => {
        const windowHeight = window.innerHeight;
        setModalHeight(windowHeight * 0.7);
    }, []);
    // 图片列表上传的响应
    const handleChange = (info) => {
        console.log("info=>", info)
        // const resultList = info.fileList
        //     .filter(item => item.status === 'done')
        //     .map(({  uid, name, status,  response: thumbUrl, thumbUrl: originalThumbUrl }) => ({ uid, name, status, thumbUrl: thumbUrl ? thumbUrl : originalThumbUrl}));
        // console.log("resultList=>", resultList)
        setImageList(info.fileList)
    }



    // 新增product的对话框
    const showNewProductModal = () => {setIsModalOpen(true);setModalTitle("New Product"); setFormMode(0);};
    const newProductReset = ()=>{form.resetFields();setImageList([]);};
    const doNotShowModal = () => {
        console.log("closed!")
        form.resetFields();
        setIsModalOpen(false);
        setImageList([]);
    };
    // 更改商品
    const reviseProduct = (record) => {
        setFormMode(1);
        console.log("revise product=>", record)
        form.setFieldsValue({
            hiddenGoodsId: record.id,
            goodsName: record.goodsName,
            goodsPrice:record.goodsPrice,
            goodsHeadline:record.goodsHeadline,
            goodsDescription:record.goodsDescription,
            goodsDiscount:record.goodsDiscount,
            goodsNum:record.goodsNum,
            goodsCategory:record.category,
            goodsCurrStatus:record.goodsCurrStatus,
        });
        const formattedList = record.goodsDetailImages.map((item) => {
            const [uid, name] = item.split("-FILE-");
            return { uid, name, thumbUrl: item, status: "done" };
        });
        setImageList(formattedList);
        // setModalTitle("Revise Product")
        setIsModalOpen(true);
    }
    // 通过userId查询goods, 然后更新
    const getGoodsList = (pageSize, nthPage, currSellerId) => {
        console.log("getGoodsList被调用")
        if(currSellerId===-1) {console.log("sellerId===-1");return;}
        getProductBySellerId({sellerId:currSellerId, pageSize:pageSize, nthPage: nthPage}).then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200){
                const arrWithKey = response.object.goods.map((item) => {
                    const goodsDetailImagesArray = item.goodsDetailImages.split(";");
                    return { ...item, key: item.id, goodsDetailImages: goodsDetailImagesArray };
                });
                setProductList(arrWithKey)
                setTotalItem(response.object.totalElements)
                console.log("getProductBySellerId.object=>",response.object);
            }
        }).catch(err=>{
            console.log("getGoodsList err", err)
        })
    }
    const newProductSubmit = () => {
        if(sellerId===-1) return;
        form.validateFields().then((value) => {
            console.log('values=>', value);
            console.log("imageList=>", imageList)
            const resultList = imageList
                .filter(item => item.status === 'done')
                .map(({  uid, name, status,  response: thumbUrl, thumbUrl: originalThumbUrl }) => ({ uid, name, status, thumbUrl: thumbUrl ? thumbUrl : originalThumbUrl}));
            console.log("resultList=>", resultList)
            const concatenatedUrl = resultList.map(item => item.thumbUrl).join(';');
            const tempObj = {
                goodsName:value.goodsName,
                goodsPrice:value.goodsPrice,
                goodsHeadline:value.goodsHeadline,
                goodsDescription:value.goodsDescription,
                goodsDiscount:value.goodsDiscount,
                goodsCategory:value.goodsCategory,
                goodsSales:"0",
                goodsNum:`${value.goodsNum}`,
                goodsDetailImages:concatenatedUrl,
                goodsCurrStatus:value.goodsCurrStatus,
                sellerId:sellerId
            }
            if(value.hiddenGoodsId!==undefined) {
                tempObj.goodsId = value.hiddenGoodsId;
            }
            console.log("tempObj=>", tempObj)
            if(formMode===0) {
                // 新增
                message.info("新增!!!!!!!!");
            } else if(formMode===1) {
                // 修改
                message.info("修改!!!!!!!!");
            }
            postNewProduct(tempObj).then(res=>{
                const response = JSON.parse(res.data);
                if(response.code===200) {
                    message.success("Success");
                    getGoodsList(pageSize, nthPage, sellerId)
                }
            }).catch(err=>{
                console.log("newProductSubmit err", err)
            })
            doNotShowModal()
        });
    };



    // 验证Jwt Token
    useEffect(()=>{
        console.log("seller 验证身份")
        validateJwt().then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200 && response.object.identity==='1') {
                setSellerId(response.object.userId);
                // 获取list
                getGoodsList(pageSize, nthPage, response.object.userId)
            } else {
                navigate("/login")
            }
        }).catch(err=>{
            console.log("验证不通过, 本地不存在ACCESS-TOKEN; err",err)
            navigate("/login")
        })

    },[])


    const columns = [
        {
            title: 'Cover Image',
            dataIndex: 'goodsDetailImages',
            key: 'goodsDetailImages',
            width: 160,
            align: 'center',
            render: (imageUrl) => <Image src={imageUrl[0]} width={160} />,
        },
        {
            title: 'Goods Name',
            dataIndex: 'goodsName',
            key: 'goodsName',
            align: 'center',
        },
        Table.EXPAND_COLUMN,
        {
            title: 'HeadLine',
            dataIndex: 'goodsHeadline',
            key: 'goodsHeadline',
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
            title: 'Inventory',
            dataIndex: 'goodsNum',
            key: 'goodsNum',
            align: 'center',
        },
        {
            title: 'Status',
            key: 'goodsCurrStatus',
            dataIndex: 'goodsCurrStatus',
            align: 'center',
            render: (_, {goodsCurrStatus}) => {
                let color = 'green';
                switch (goodsCurrStatus) {
                    case "ON SALE" : {color='green';break;}
                    case "OFF SHELF" : {color='red';break;}
                    case "SOLD OUT" : {color='yellow';break;}
                    default: break;
                }
                return (
                    <Tag color={color} key={goodsCurrStatus}>
                        {goodsCurrStatus.toUpperCase()}
                    </Tag>
                )
            },
        },
        {
            title: '',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Button onClick={()=>{reviseProduct(record)}} type='text'>revise</Button>
            ),
        },
    ];

    return (
        <>
            <Row>
                <Col span={12}>
                    <h1><AppstoreOutlined />
                        Products
                    </h1>
                </Col>
                <Col span={12}>
                    <div style={{float:"right", marginTop:"15px"}}>
                        <Button type="primary" onClick={showNewProductModal}>
                            New Product
                        </Button>
                    </div>
                </Col>
            </Row>
            <div className="central">
                <Modal
                    open={isModalOpen}
                    onCancel={doNotShowModal}
                    width={900}
                    title={modalTitle}
                    footer={[
                        <Button key="0" type="primary" onClick={newProductReset}>Reset</Button>,
                        <Button key="1" type="primary" onClick={newProductSubmit}>Submit</Button>
                    ]}>
                    <Form
                        layout="horizontal"
                        style={{ marginTop: 20, overflow:"auto"}}
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 18 }}
                        size={"small"}
                        onFinish={newProductSubmit}
                        form={form}
                    >
                        <Form.Item name="hiddenGoodsId" noStyle>
                            <Input type="hidden" />
                        </Form.Item>
                        <Form.Item label="Goods Name" name="goodsName" rules={GeneralFormRules}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Description" name="goodsHeadline" rules={GeneralFormRules}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Category" name="goodsCategory" rules={GeneralFormRules}>
                            <Select>
                                <Select.Option value="BAGS" key="0">BAGS</Select.Option>
                                <Select.Option value="CAMERAS" key="1">CAMERAS</Select.Option>
                                <Select.Option value="CLOTHES" key="2">CLOTHES</Select.Option>
                                <Select.Option value="KIDS" key="3">KIDS</Select.Option>
                                <Select.Option value="GLASSES" key="4">GLASSES</Select.Option>
                                <Select.Option value="MOBILE" key="5">MOBILE</Select.Option>
                                <Select.Option value="MAKEUP" key="6">MAKEUP</Select.Option>
                                <Select.Option value="SHOES" key="7">SHOES</Select.Option>
                                <Select.Option value="LAPTOPS" key="8">LAPTOPS</Select.Option>
                                <Select.Option value="FOOD" key="9">FOOD</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Status" name="goodsCurrStatus" rules={GeneralFormRules}>
                            <Select>
                                <Select.Option value="ON_SALE" key="0">ON SALE</Select.Option>
                                <Select.Option value="DOWN" key="1">OFF SHELF</Select.Option>
                                <Select.Option value="SOLD_OUT" key="2">SOLD OUT</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Price" name="goodsPrice">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Discount" name="goodsDiscount" >
                            <Input />
                        </Form.Item>
                        <Form.Item label="Inventory" name="goodsNum">
                            <InputNumber />
                        </Form.Item>
                        <Form.Item label="Details" name="goodsDescription">
                            <TextArea rows={4} />
                        </Form.Item>
                    </Form>
                    <Upload
                        action= {baseUrl+"/files/upload"}
                        multiple={true}
                        listType="picture"
                        onChange={handleChange}
                        fileList={[...imageList]}
                        defaultFileList={imageList}
                    >
                        <Button icon={<UploadOutlined />}>Upload</Button>  The first image will be used as cover image.
                    </Upload>


                </Modal>
            </div>
            <div>
                <Table
                    columns={columns}
                    expandable={{
                        expandedRowRender: (record) => (
                            <p style={{margin: 0,}}>{record.goodsDescription}</p>
                        ),
                    }}
                    dataSource={productList}
                    pagination={false}
                />
                <br/>
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
    )
}

export default SellerProducts;