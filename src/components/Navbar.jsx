import React, { useState } from "react";
import { Avatar, Button, Dropdown, Layout, Menu } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Title from "../images/title-logo.png"
import Sidebar from "./Sidebar";
import axios from "axios";

const { Header } = Layout;

const Navbar = ({ collapsed, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    navigate("/" + e.key);
  };

  const handleProfileClick = (e) => {
    if (e.key === "profile") {
      navigate("/Users/MyProfile");
    } else if (e.key === "logout") {
      navigate("/");
    }
  };

  const menu = (
    <Menu onClick={handleProfileClick}>
      <Menu.Item key="profile">Profile</Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Layout>
        <Header
          style={{
            position: "fixed",
            width: "100%",
            padding: 0,
            display: "flex",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <Button
            type="text"
            onClick={toggleSidebar}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            style={{ marginLeft: 16,color:"#fff" }}
          />
          {/* <span style={{ marginLeft: 16,color:"#fff",width:'100%' }}>Supply Bee</span> */}
          <img style={{ marginBottom: 5,paddingLeft: 10,width:'75px' }} src={Title} alt="PROSOL" />
          <div className="roww" style={{ justifyContent: "end" }}>
            <Dropdown overlay={menu}>
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                size="large"
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>
      </Layout>
    </>
  );
};

export default Navbar;
