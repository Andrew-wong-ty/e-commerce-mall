import {DownOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import {logoutStatus} from "../features/userSlice";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {UserOutlined} from "@ant-design/icons";
import {Dropdown, Space, Avatar} from 'antd';
import "./General.css"
import Constant from "../store/constant";
import {useSelector} from "react-redux";


// 根据用户信息返回用户头像下拉框
function getIconItems(userInfo) {
    // console.log("getIconItems.userInfo: ",userInfo)
    if(userInfo.identity===Constant.TRAVELER_IDENTITY) {
        return [
            {label: 'My Orders', key: '-1', disabled: true},
            {label: 'Account Info', key: '-2', disabled: true},
            {label: 'Login', key: '0', disabled: false}
        ]
    } else if(userInfo.identity===Constant.BUYER_IDENTITY) {
        return [
            {label: 'Hi,'+JSON.stringify(userInfo.username), key: '99', disabled: !userInfo.isLogin},
            {label: 'My Orders', key: '1', disabled: !userInfo.isLogin},
            {label: 'Account Info', key: '2', disabled: !userInfo.isLogin},
            {label: 'Logout', key: '3', disabled: !userInfo.isLogin}
        ]
    } else if(userInfo.identity===Constant.SELLER_IDENTITY) {
        return [
            // {label: 'Orders', key: '4', disabled: false},
            {label: 'Products', key: '5', disabled: false},
            // {label: 'Account Info', key: '6', disabled: false},
            {label: 'Logout', key: '3', disabled: false}
        ]
    } else {
        console.log("ERROR: getIconItems")
        return [
            {label: 'My Orders', key: '1', disabled: true},
            {label: 'Account Info', key: '2', disabled: true},
            {label: 'Login', key: '3', disabled: true}
        ]
    }
}
const UserIcon = () => {
    // 从Redux store中取出用户信息
    const userInfo = useSelector(state => state.user.info)
    // 渲染下拉框的item list
    const [items, setItems] = useState(null);
    // 页面跳转
    const navigate = useNavigate()
    // Redux dispatch
    const dispatch = useDispatch()

    // 在用户信息发生变化时重新渲染用户图标下拉框
    useEffect(()=>{
        setItems(getIconItems(userInfo));
    },[userInfo])

    const onClick = ({ key }) => {
        console.log(key)
        switch (key) {
            // 登录跳转
            case '0':
            {
                navigate("/login")
                break
            }
            case '1':
            {
                navigate("/userOrder")
                break
            }
            // 执行登出逻辑
            case '2':
            {
                navigate("/userinfo")
                break
            }
            // 执行登出逻辑
            case '3':
            {
                dispatch(logoutStatus())
                navigate("/")
                break
            }
            // 跳转到商品管理页面
            case '5':
            {
                navigate("products")
                break
            }
            default:
                console.log("error key")
        }
    };
    return (
        <>
            <Dropdown
                menu={{
                    items,
                    onClick,
                }}
                placement="bottom"
            >
                <a onClick={(e) => e.preventDefault()}>
                    <Space id="userIcon">
                        {/*<UserOutlined />*/}
                        <Avatar src={userInfo.avatarLink} /><DownOutlined style={{ fontSize: '12px'}} />
                    </Space>
                </a>
            </Dropdown>

        </>
    )
}
export default UserIcon