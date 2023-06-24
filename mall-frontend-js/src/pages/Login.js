import React, {useEffect, useState} from "react";
import {Card, message, notification, Select, Space, Tabs, Upload} from 'antd';
import { Button, Checkbox, Form, Input,Radio,Col, Row } from 'antd';
import {Link, useNavigate} from "react-router-dom";
import UserIcon from "../components/UserIcon";
import {ShoppingCartOutlined, UploadOutlined} from "@ant-design/icons";
import "./Page.css"
import httpService from "../configs/HttpService";
import {postLogin, postRegister} from "../configs/services";
import {loginStatus, logoutStatus, increment, setCount} from "../features/userSlice";
import { useSelector, useDispatch } from 'react-redux'
import {baseUrl} from "../configs/HttpService";

const { TabPane } = Tabs;
const { TextArea } = Input;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};
const Login = () => {
    const navigate = useNavigate()
    const [identity, setIdentity] = useState('0'); // 设置identity初始值
    const [buyerIdentity, setBuyerIdentity] = useState(true)
    const [imageList, setImageList] = useState([])
    const [registerForm] = Form.useForm();
    const handleIdentityChange = (e) => {
        setIdentity(e.target.value);
    };
    const openNotification = () => {
        notification.open({
            type: "success",
            message: 'Test Buyer and Seller account:',
            description:
                'Buyer->username:abcd, password:123456 \n Seller->username:Grocery2, password:123456',
            duration: 15,
            style: {
                marginTop: '40px'
            },
            placement: "topLeft"
        });
    };

    useEffect(()=>{
        openNotification()
    },[])
    const onFinish = (values) => {
        console.log('Success:', values);
        postLogin(values).then(res=>{
            const response = JSON.parse(res.data)
            console.log(response)
            if(response.code===200){
                navigate("/")
            } else {
                message.error("Wrong username or password!")
            }

        }).catch((err)=>{
            console.log(err)
        })
        // 发送数据
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const onRegisterFinish = (values) => {
        if(imageList.length===0) return;
        const newObj = Object.assign({}, values, { avatar: imageList[0].response});
        console.log("onRegisterFinish Object=>", newObj)
        postRegister(newObj).then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200){
                message.success("Succeed");
                registerForm.resetFields();
                setImageList([]);
            } else if(response.code===500) {
                if(response.object!==undefined && response.object!==null) {
                    message.error(response.object)
                } else {
                    message.error("Failed")
                }

            }
        })
    }
    const handleChange = (info) => {
        console.log("info=>", info)
        setImageList(info.fileList)
    }
    const onSelectChange = (value) => {
        // console.log("value=>", value)
        if(value==="Buyer") {
            setBuyerIdentity(true)
        } else {
            setBuyerIdentity(false)
        }
    }
    const divStyle = {
        backgroundColor: '#F5F5F5',
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
    };
    const GeneralFormRules = [{required: true, message: 'Required Field'}];

    return (
            <div style={divStyle}>
                <div className="loginForm">
                    <Card
                        style={{
                            width: 450,
                        }}
                    >
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Login" key="1">
                                {/*<Card title="Login" bordered={true} extra={<Link onClick={()=>{message.info("The feature is developing")}}>Register</Link>} style={{ width: 400 }}>*/}
                                {/*    */}
                                {/*</Card>*/}
                                <Form
                                    name="basic"
                                    labelCol={{
                                        span: 8,
                                    }}
                                    wrapperCol={{
                                        span: 16,
                                    }}
                                    style={{
                                        maxWidth: 600,
                                        marginTop: "20px"
                                    }}
                                    initialValues={{
                                        remember: true,
                                    }}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="Username"
                                        name="username"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your username!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>



                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your password!',
                                            },
                                        ]}
                                    >
                                        <Input.Password />
                                    </Form.Item>

                                    <Form.Item label="Identity" name="identity" rules={[
                                        {
                                            required: true,
                                            message: 'Please input your identity!',
                                        },
                                    ]}>
                                        <Radio.Group value={identity} onChange={handleIdentityChange}>
                                            <Radio value="0">Buyer</Radio>
                                            <Radio value="1">Seller</Radio>
                                        </Radio.Group>
                                    </Form.Item>

                                    <Form.Item
                                        wrapperCol={{
                                            offset: 8,
                                            span: 16,
                                        }}
                                    >
                                        <Space size="large" >
                                            <Button  onClick={()=>{navigate("/")}}>
                                                Cancel
                                            </Button>
                                            <Button type="primary" htmlType="submit">
                                                Submit
                                            </Button>
                                        </Space>


                                    </Form.Item>
                                </Form>
                            </TabPane>
                            <TabPane tab="Register" key="2">
                                <Form
                                    form={registerForm}
                                    labelCol={{span: 8,}}
                                    name="control-hooks"
                                    onFinish={onRegisterFinish}
                                >
                                    <Form.Item name="username" label="Username" rules={GeneralFormRules}>
                                        <Input disabled={false} />
                                    </Form.Item>
                                    {!buyerIdentity &&
                                    <Form.Item name="storeName" label="Store Name" rules={GeneralFormRules}>
                                        <Input disabled={false} />
                                    </Form.Item>
                                    }
                                    <Form.Item label="Password" name="password" rules={GeneralFormRules}>
                                        <Input.Password />
                                    </Form.Item>
                                    <Form.Item name="email" label="Email" rules={GeneralFormRules}>
                                        <Input disabled={false} />
                                    </Form.Item>
                                    <Form.Item name="phoneNumber" label="Phone Number" rules={GeneralFormRules}>
                                        <Input disabled={false} />
                                    </Form.Item>
                                    <Form.Item name="address" label="Address" rules={GeneralFormRules}>
                                        <TextArea rows={4} disabled={false} />
                                    </Form.Item>
                                    <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                                        <Upload
                                            action= {baseUrl+"/files/upload"}
                                            multiple={false}
                                            listType="picture"
                                            maxCount={1}
                                            onChange={handleChange}
                                            fileList={imageList}
                                            defaultFileList={imageList}
                                        >
                                            <Button icon={<UploadOutlined />}>Upload</Button>
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item label="Identity" name="identity" rules={GeneralFormRules}>
                                        <Select
                                            onChange={onSelectChange}
                                        >
                                            <Select.Option value="Seller" key="0">Seller</Select.Option>
                                            <Select.Option value="Buyer" key="1">Buyer</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        wrapperCol={{
                                            offset: 8,
                                            span: 16,
                                        }}
                                    >
                                        <Button type="primary" htmlType="submit" size="large">
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>
                        </Tabs>
                    </Card>
                </div>
            </div>
    );
};
export default Login;