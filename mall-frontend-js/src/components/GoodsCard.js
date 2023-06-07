import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
const { Meta } = Card;
const GoodsCard = ({image, id}) => (
    <Card
        style={{
            width: 200,
        }}
        cover={
            <img
                alt="example"
                src={image}
            />
        }
        actions={[
            <SettingOutlined key="setting" onClick={()=>{console.log("goods Id:",id)}}/>,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
        ]}
    >
        <Meta
            avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
            title="Card title"
            description="This is the description"
        />
    </Card>
);
export default GoodsCard;