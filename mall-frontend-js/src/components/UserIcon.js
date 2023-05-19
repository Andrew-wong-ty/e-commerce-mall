import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {UserOutlined} from "@ant-design/icons";
import {Dropdown, Space} from 'antd';
import "./General.css"
import globalState from "../store/state";
import Constant from "../store/constant";

function getIconItems(loginState) {
    if(globalState.state.identity===Constant.TRAVELER_IDENTITY) {
        return [
            {label: 'My Orders', key: '-1', disabled: true},
            {label: 'Account Info', key: '-2', disabled: true},
            {label: 'Login', key: '0', disabled: false}
        ]
    } else if(globalState.state.identity===Constant.BUYER_IDENTITY) {
        return [
            {label: 'My Orders', key: '1', disabled: false},
            {label: 'Account Info', key: '2', disabled: false},
            {label: 'Logout', key: '3', disabled: false}
        ]
    } else if(globalState.state.identity===Constant.BUYER_IDENTITY) {
        return [
            {label: 'Orders', key: '4', disabled: false},
            {label: 'Products', key: '5', disabled: false},
            {label: 'Account Info', key: '5', disabled: false},
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
    // 是否已经登录
    const [isLoginIn, setIsLoginIn] = useState(false);
    // 渲染下拉框的item list
    const [items, setItems] = useState(null);
    const [loginFormOpen, setLoginFormOpen] = useState(false)
    const navigate = useNavigate()
    useEffect(()=>{
        setIsLoginIn(false);
        setItems(getIconItems(isLoginIn));
    },[])
    const onClick = ({ key }) => {
        console.log(key)
        switch (key) {
            case '0':
            {
                navigate("/login")
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
                        <UserOutlined />
                    </Space>
                </a>
            </Dropdown>

        </>
    )
}
export default UserIcon