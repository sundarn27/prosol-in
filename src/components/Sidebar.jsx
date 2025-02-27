import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import * as Icons from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = ({ collapsed, sideData, onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    const currentPath = location.pathname.split("/")[2]; 
    setSelectedKey(currentPath || sideData[0]?.key); 
  }, [location.pathname, sideData]);
  

  const handleMenuClick = (key,mdl) => {
    setSelectedKey(key);
    navigate(`/${mdl}/${key}`);
    if (onClick) {
      onClick(`${mdl}/${key}`); 
    }
  };

  console.log(sideData)
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={240}
      style={{
        backgroundColor: "#fff",
        position: "fixed",
        height: "100%",
        zIndex: "100",
      }}
    >
      <Menu
        mode="inline"
        style={{ height: "100%", borderRight: 0 }}
        selectedKeys={[selectedKey]}
      >
        {sideData.sort((a, b) => a.seq - b.seq).map((item) => (
          <Menu.Item
            key={item.key}
            icon={item.icon ? React.createElement(Icons[item.icon]) : null}
            onClick={() => handleMenuClick(item.key,item.module)}
          >
            {!collapsed && item.label}
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
