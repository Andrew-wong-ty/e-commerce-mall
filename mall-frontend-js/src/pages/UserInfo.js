import {updateAvatar} from "../features/userSlice";
import {baseUrl} from "../configs/HttpService";
import "./Page.css"
import {PlusOutlined, UploadOutlined} from '@ant-design/icons';
import React, {useEffect} from "react";
import {validateJwt} from "../utils/serviceUtils";
import Constant from "../store/constant";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {getUserByUserId, postUpdateUserinfo} from "../configs/services";
import {Button, Form, Input, message, Upload, Row, Col, Divider} from "antd";
import {useDispatch} from "react-redux";
const { TextArea } = Input;

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

function UserInfo() {
    // 验证Jwt Token
    const [userId, setUserId] = useState(-1);
    const [userInfo, setUserInfo] = useState({});
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [imageList, setImageList] = useState([])
    const dispatch = useDispatch();
    useEffect(()=>{
        console.log("user 验证身份")
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
    const handleChange = (info) => {
        console.log("info=>", info)
        setImageList(info.fileList)
    }
    useEffect(()=>{
        if(userId===-1) return;
        getUserByUserId({userId:userId}).then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200) {
                setUserInfo(response.object);
                setImageList([{
                    uid: "1", thumbUrl: response.object.avatar, response: response.object.avatar, status: "done", name: "avatar.jpg"
                }])
                console.log("userInfo=>", response.object)
                message.success("get user info success!");
            }
        }).catch(err=>{
            message.error("getUserByUserId err=>",err);
        })
    },[userId])

    useEffect(()=>{
        if (Object.keys(userInfo).length === 0) {
            return;
        }
        form.setFieldsValue({
            username: userInfo.username,
            email: userInfo.email,
            phoneNumber: userInfo.phoneNumber,
            address: userInfo.address,
        })
    },[userInfo])

    const onFinish = (values) => {
        if(userId===-1) return;
        if(imageList.length===0) return;
        const newObj = Object.assign({}, values, { avatar: imageList[0].response, userId: userId});
        console.log("userObj=>", newObj)
        postUpdateUserinfo(newObj).then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200) {
                dispatch(updateAvatar({avatar: imageList[0].response}))
                message.success("Everything is updated!")
            }
        }).catch(err=>{
            message.success("err=>", err)
        })
    };
    return (
        <div >
            <h1 style={{marginLeft: "10%"}}>User Information</h1>
            <div style={{marginLeft: "10%", marginRight: "10%"}}><Divider/></div>
            <Row>
                <Col span={4}></Col>
                <Col span={14}>
                    <Form
                        form={form}
                        labelCol={{span: 8,}}
                        name="control-hooks"
                        onFinish={onFinish}
                    >
                        <Form.Item name="username" label="Username">
                            <Input disabled={true} />
                        </Form.Item>
                        <Form.Item name="email" label="Email">
                            <Input disabled={false} />
                        </Form.Item>
                        <Form.Item name="phoneNumber" label="Phone Number">
                            <Input disabled={false} />
                        </Form.Item>
                        <Form.Item name="address" label="Address">
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
                </Col>
                <Col span={6}></Col>
            </Row>
        </div>
    )
}

export default UserInfo;