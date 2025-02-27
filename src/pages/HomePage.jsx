import React, { useState } from "react";
import { Layout } from "antd";
import Home from "../components/Home";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  DashboardOutlined,
  HomeOutlined,
  FireOutlined,
  SubnodeOutlined,
  PlayCircleOutlined,
  HistoryOutlined,
  BarChartOutlined,
  SettingOutlined,
  DotChartOutlined,
  ProjectOutlined,
  AppstoreOutlined,
  InfoCircleOutlined,
  BranchesOutlined,
} from "@ant-design/icons";

const { Content } = Layout;

const HomePage = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const sidebarItems = [
    { key: "Home", icon: "HomeOutlined", label: "Home" },
    // { key: "Dashboard", icon: <BarChartOutlined />, label: "Dashboard" },
    // { key: "Settings", icon: <SettingOutlined />, label: "Settings" },
    // { key: "Workflow", icon: <BranchesOutlined />, label: "Workflow" },
    // { key: "About", icon: <InfoCircleOutlined />, label: "About" },
  ];

  return (
    <>
      <Layout>
        <Navbar collapsed={collapsed} toggleSidebar={toggleSidebar} />

        <Layout style={{ marginTop: "65px" }}>
          <Sidebar collapsed={collapsed} sideData={sidebarItems} />
          <Layout
            style={{
              marginLeft: collapsed ? 140 : 240,
              transition: "margin-left 0.2s",
            }}
          >
            <Home />
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default HomePage;
