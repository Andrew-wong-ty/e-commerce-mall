import {InboxOutlined, PlusOutlined, UploadOutlined} from '@ant-design/icons';
import { Button, Form, Input, Select, Upload } from 'antd';
import React from "react";
import {useState} from "react";
const { Option } = Select;
const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};
const App = () => {
    const [myFileList, setMyFileList] = useState([
        {
            uid: '-1',
            name: 'yyy.png',
            status: 'done',
            thumbUrl: 'http://localhost:8080/files/download/7054437f-f155-4de3-8604-0d8965a36d3f.png',
        },
        {
            uid: '-2',
            name: 'xxx.png',
            status: 'done',
            thumbUrl: 'http://localhost:8080/files/download/fa4bfdff-12ba-4671-b92f-392bf528f24e.png',
        },
    ])
    const handleChange = (info) => {
        console.log("handleChange INFO:",info.fileList)
        const resultList = info.fileList
            .filter(item => item.status === 'done')
            .map(({  uid, name, status,  response: thumbUrl, thumbUrl: originalThumbUrl }) => ({ uid, name, status, thumbUrl: originalThumbUrl ? originalThumbUrl : thumbUrl}));
        console.log("resultList", resultList)
        setMyFileList(resultList)
        
    }
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log("values=>",values);
        console.log("MyFileList=>", myFileList)
    };
    const onReset = () => {
        form.resetFields();
        setMyFileList([])
    };
    const onFill = () => {
        form.setFieldsValue({
            note: 'Hello world!',
            gender: 'male',
        });
    };
    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        console.log("fileList=>",e?.fileList)
        return e?.fileList;
    };
    const trigger = (e) => {
        console.log("trigger被触发")
    }
    return (
        <>
            <Form
                {...layout}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
                style={{
                    maxWidth: 600,
                }}
            >
                <Form.Item name="note" label="Note">
                    <Input />
                </Form.Item>
                <Form.Item name="gender" label="Gender">
                    <Select
                        allowClear
                    >
                        <Option value="male">male</Option>
                        <Option value="female">female</Option>
                        <Option value="other">other</Option>
                    </Select>
                </Form.Item>


                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button htmlType="button" onClick={onReset}>
                        Reset
                    </Button>
                    <Button type="link" htmlType="button" onClick={onFill}>
                        Fill form
                    </Button>
                </Form.Item>
            </Form>
            <Upload
                action= 'http://localhost:8080/files/upload'
                multiple={true}
                listType="picture"
                onChange={handleChange}
                defaultFileList={[...myFileList]}
            >
                <Button icon={<UploadOutlined />}>Upload</Button>  The first image will be used as cover image.
            </Upload>
        </>

    );
};
export default App;

