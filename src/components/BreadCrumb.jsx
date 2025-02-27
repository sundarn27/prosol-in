import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import React from "react";
import { Link, useLocation } from 'react-router-dom';

export default function BreadCrumb() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter((x) => x);

  return (
    <>
      <Breadcrumb style={{ paddingTop: '10px', paddingLeft: '20px' }}>
        <Breadcrumb.Item>
          <Link to="/Home">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>

        {paths.map((path, index) => {
          const fullPath = `/${paths.slice(0, index + 1).join("/")}`;

          return (
            <Breadcrumb.Item key={index}>
              <Link to={fullPath}>
                {path.toLowerCase() === "home" ? (
                  <>
                    
                  </>
                ) : (
                  <span>{path.charAt(0).toUpperCase() + path.slice(1)}</span>
                )}
              </Link>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </>
  );
}
