import React from "react";
import { List, Card, Image } from "antd";

const MyComponent = () => {
    const [selectedImage, setSelectedImage] = React.useState(null);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const data = [
        {
            id: 1,
            name: "Image 1",
            previewUrl: "http://localhost:8080/files/download/c36f7dd2-b56a-4683-9c00-5c6996c4e30b-FILE-QQ%E6%88%AA%E5%9B%BE20211204211101.jpg\n",
            fullUrl: "http://localhost:8080/files/download/c36f7dd2-b56a-4683-9c00-5c6996c4e30b-FILE-QQ%E6%88%AA%E5%9B%BE20211204211101.jpg\n",
        },
        {
            id: 2,
            name: "Image 2",
            previewUrl: "http://localhost:8080/files/download/c36f7dd2-b56a-4683-9c00-5c6996c4e30b-FILE-QQ%E6%88%AA%E5%9B%BE20211204211101.jpg\n",
            fullUrl: "http://localhost:8080/files/download/c36f7dd2-b56a-4683-9c00-5c6996c4e30b-FILE-QQ%E6%88%AA%E5%9B%BE20211204211101.jpg\n",
        },
        {
            id: 3,
            name: "Image 3",
            previewUrl: "http://localhost:8080/files/download/c36f7dd2-b56a-4683-9c00-5c6996c4e30b-FILE-QQ%E6%88%AA%E5%9B%BE20211204211101.jpg\n",
            fullUrl: "http://localhost:8080/files/download/c36f7dd2-b56a-4683-9c00-5c6996c4e30b-FILE-QQ%E6%88%AA%E5%9B%BE20211204211101.jpg\n",
        },
    ];

    return (
        <div style={{ display: "flex" }}>
            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            hoverable={true}
                            cover={<img alt={item.name} src={item.previewUrl} />}
                            onClick={() => handleImageClick(item)}
                        >
                            <Card.Meta title={item.name} />
                        </Card>
                    </List.Item>
                )}
            />
            <div style={{ marginLeft: "16px" }}>
                {selectedImage && (
                    <Image src={selectedImage.fullUrl} alt={selectedImage.name} />
                )}
            </div>
        </div>
    );
};

export default MyComponent;