import { Card, Col, Row } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import ChatBot from "./ChatBot";

export default function Home() {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pages, setPages] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/GetModules`
      );
      console.log("Response:", response.data);

      if (response.data) {
        setModules(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
    setIsLoading(false); 
  }, []);

  const getPage = async (md) => {
    console.log(md);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/getPages`
      );
      console.log("Response:", response.data);
  
      if (response.data) {
        setPages(response.data);
  
        const filteredPages = response.data.filter((i) => i.Module === md);
        console.log("Filtered Pages:", filteredPages);
  
        if (filteredPages.length > 0) {
          // navigate(`/${filteredPages[0].Page}`);
          navigate(`/${md}/${filteredPages[0].Page}`);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  const handleMenuClick = (mdl) => {
    getPage(mdl);
  };

  const getImagePath = (imageName) => {
    try {
      return require(`../images/${imageName}`);
    } catch (err) {
      console.error("Image not found:", imageName);
      return null;
    }
  };

  return (
    <>
  {/* Proper conditional rendering */}
  {isLoading ? (
    <Loading />
  ) : (
    <>
    <Row gutter={16} style={{ padding: "15px", gap: "40px" }}>
      {modules
        .sort((a, b) => a.Seq.localeCompare(b.Seq))
        .map((i) => (
          <Col span={5} key={i.id}>
            <Card style={{ width: 200, height: 200 }}>
              <div
                className="column-b"
                style={{ justifyContent: "center", cursor: "pointer" }}
                onClick={() => handleMenuClick(i.Module)}
              >
                <img
                  style={{ width: "100px" }}
                  src={getImagePath(i.Image)}
                  alt={i.Image}
                />
                <h3>{i.Module}</h3>
              </div>
            </Card>
          </Col>
        ))}
    </Row>
    </>
  )}
</>
  );
}
