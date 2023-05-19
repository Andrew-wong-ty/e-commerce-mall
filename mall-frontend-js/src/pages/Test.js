import { Form, Radio } from 'antd';
import React, { useState } from 'react';

const MyForm = () => {
    const [identity, setIdentity] = useState('0'); // 设置初始值

    const handleIdentityChange = (e) => {
        setIdentity(e.target.value);
    };

    const onFinish = (values) => {
        console.log('Form values:', values);
        // 在这里处理表单提交的数据
    };

    return (
        <Form onFinish={onFinish}>
            <Form.Item label="Identity" name="identity">
                <Radio.Group value={identity} onChange={handleIdentityChange}>
                    <Radio value="0">Buyer</Radio>
                    <Radio value="1">Seller</Radio>
                </Radio.Group>
            </Form.Item>

            {/* 添加其他表单项 */}

            <Form.Item>
                <button type="submit">Submit</button>
            </Form.Item>
        </Form>
    );
};

export default MyForm;
