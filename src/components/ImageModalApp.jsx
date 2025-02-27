import React, { useState } from 'react';
import { Button, Modal, Image, Row, Col, Card, Tooltip } from 'antd';
import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';

const imageList = [
  'https://via.placeholder.com/150/0000FF/808080',
  'https://via.placeholder.com/150/FF0000/FFFFFF',
  'https://via.placeholder.com/150/008000/FFFFFF',
  'https://via.placeholder.com/150/FFFF00/000000',
  'https://via.placeholder.com/150/FF00FF/FFFFFF',
  'https://via.placeholder.com/150/000000/FFFFFF',
];

const ImageViewerModal = ({ visible, imageSrc, onClose }) => {
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: '20px' }}
      closeIcon={<CloseOutlined />}
      className="image-viewer-modal"
    >
      <Draggable>
        <div className="modal-content">
          <Image
            width="100%"
            alt="Selected Image"
            src={imageSrc}
            preview={false}
            style={{ cursor: 'move' }}
          />
        </div>
      </Draggable>
    </Modal>
  );
};

const ImageListModal = ({ visible, onClose, onImageClick }) => {
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      style={{ top: '20px' }}
      closeIcon={<CloseOutlined />}
      title="Select an Image"
      className="image-list-modal"
    >
      <Row gutter={[16, 16]}>
        {imageList.map((src, index) => (
          <Col span={8} key={index}>
            <Card
              hoverable
              cover={
                <Image
                  width="100%"
                  alt={`Image ${index}`}
                  src={src}
                  preview={false}
                  onClick={() => onImageClick(src)}
                  style={{ cursor: 'pointer' }}
                />
              }
              bodyStyle={{
                textAlign: 'center',
                padding: '10px',
              }}
            >
              <Tooltip title="Click to View">
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => onImageClick(src)}
                >
                  View
                </Button>
              </Tooltip>
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

const ImageModalApp = () => {
  const [isImageListVisible, setImageListVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);

  const openImageListModal = () => {
    setImageListVisible(true);
  };

  const closeImageListModal = () => {
    setImageListVisible(false);
  };

  const openImageViewer = (imageSrc) => {
    setSelectedImage(imageSrc);
    setImageViewerVisible(true);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
  };

  return (
    <div style={{ padding: '30px' }}>
      <Button
        type="primary"
        size="large"
        onClick={openImageListModal}
        style={{
          backgroundColor: '#1890ff',
          borderColor: '#1890ff',
          fontSize: '16px',
          marginBottom: '20px',
        }}
      >
        Open Image Gallery
      </Button>

      {/* Image List Modal */}
      <ImageListModal
        visible={isImageListVisible}
        onClose={closeImageListModal}
        onImageClick={openImageViewer}
      />

      {/* Image Viewer Modal */}
      <ImageViewerModal
        visible={isImageViewerVisible}
        imageSrc={selectedImage}
        onClose={closeImageViewer}
      />
    </div>
  );
};

export default ImageModalApp;
