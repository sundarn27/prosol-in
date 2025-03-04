import { FloatButton, Modal } from "antd";
import React, { useState } from "react";
import {
  CommentOutlined,
  CustomerServiceOutlined,
  RobotOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import Chat from "./Chat";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [modal1Open, setModal1Open] = useState(false);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
    console.log(open);
  };

  return (
    <>
     <FloatButton.Group
        open={open}
        trigger="click"
        style={{ insetInlineEnd: 25,bottom:25 }}
        icon={<CustomerServiceOutlined />}
        onClick={toggleOpen}
        tooltip="Help?"
      >
        <FloatButton tooltip="Image Search" icon={<FileImageOutlined />} />
        <FloatButton
          tooltip="Chat Bot"
          icon={<RobotOutlined />}
          onClick={() => setModal1Open(true)}
        />
        <Modal
          title={null}
          open={modal1Open}
          onCancel={() => setModal1Open(false)}
          style={{ top: 20 }}
          width={1000}
          footer={null}
        >
          <Chat/>
        </Modal>
      </FloatButton.Group>
    </>
  );
}
