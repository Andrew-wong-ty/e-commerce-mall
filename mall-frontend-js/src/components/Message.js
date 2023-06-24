import { Button, message } from 'antd';
const Message = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'This is a prompt message with custom className and style',
            className: 'custom-class',
            style: {
                marginTop: '20vh',
            },
        });
    };
    return (
        <>
            {contextHolder}
            <Button onClick={success}>Customized style</Button>
        </>
    );
};
export default Message;
