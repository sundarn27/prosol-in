import { Card, Col, Row } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";
import BreadCrumb from "./BreadCrumb";

export default function Pages() {
    const { moduleName } = useParams();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/getPages`
      );
      console.log("Response:", response.data);

      if (response.data) {
        setPages(response.data);
        pages.filter((i)=>{
            return i.Module === moduleName;
        })
      }
      console.log("Final Response:", pages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();  
  }, []); 

  const handleMenuClick = (pg) => {
    navigate(`/${moduleName}/${pg}`);
  };

  return (
    <>
    <Loading />
    <BreadCrumb />
      <Row gutter={16} style={{ padding: '20px', paddingLeft: '150px', gap: '20px' }}>
        {pages.map((i) => (
          <Col span={5} key={i.id}> 
            <Card style={{ width: 250, height: 250 }}>
              <div className="column-b" style={{ justifyContent: "center" }} onClick={() => handleMenuClick(i.Page)}  >
                <img
                  style={{ width: "150px" }}
                  src={i.Image}
                  alt={i.Page} 
                ></img>
                <h3>{i.Page}</h3>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

