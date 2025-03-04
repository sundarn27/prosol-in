import { Col, Row } from "antd";
import React from "react";
import BreadCrumb from "../components/BreadCrumb";

export default function Dashboard() {
  return (
    <>
      <BreadCrumb />
      <div style={{ marginTop: "40px" }}>
        <Row>
          <Col span={24}>col</Col>
        </Row>
      </div>
    </>
  );
}
