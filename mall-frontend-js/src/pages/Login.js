import React, {useState} from "react";
import { Card } from 'antd';
import { Button, Checkbox, Form, Input,Radio,Col, Row } from 'antd';
import {Link, useNavigate} from "react-router-dom";
import UserIcon from "../components/UserIcon";
import {ShoppingCartOutlined} from "@ant-design/icons";
import "./Page.css"
import httpService from "../configs/HttpService";
import {postLogin} from "../configs/services";
import {loginStatus, logoutStatus, increment, setCount} from "../features/userSlice";
import { useSelector, useDispatch } from 'react-redux'
import globalState from "../store/state";

const Login = () => {
    const navigate = useNavigate()
    const [identity, setIdentity] = useState('0'); // 设置identity初始值
    const handleIdentityChange = (e) => {
        setIdentity(e.target.value);
    };
    const onFinish = (values) => {
        console.log('Success:', values);
        postLogin(values).then(res=>{
            const response = JSON.parse(res.data)
            console.log(response)
            if(response.code===200){
                globalState.setUserLoggedInStatus(response.object)
                navigate("/")
            }

        }).catch((err)=>{
            console.log(err)
        })
        // 发送数据
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className="loginForm">
            <Card title="Login" bordered={true} extra={<Link to={`/all`}>Register</Link>} style={{ width: 400 }}>
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
                        <Button  htmlType="submit">
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>

                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};
export default Login;