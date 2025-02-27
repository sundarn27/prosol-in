import React, { useEffect, useState } from "react";
import { Skeleton, Spin } from "antd";
import { Flex } from "antd/es/grid";
import { LoadingOutlined, QuestionCircleFilled } from "@ant-design/icons";
import localImage from "../images/honeycomb.png";

// const customIcon = <QuestionCircleFilled style={{ fontSize: 24 }} spin />;

// const customIndicator = (
//     <img
//         src={localImage}
//         alt="Loading..."
//         style={{ width: '50px', height: '50px', animation: 'spin 1s infinite linear' }}
//     />
// );

const customIndicator = (
  <img
    src={localImage}
    alt="Loading..."
    style={{
      width: "50px",
      height: "50px",
      animation: "move 1s infinite alternate",
    }}
  />
);

export default function Loading() {
  const [isLoading, setIsLoading] = useState(true);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
      clearInterval(timerInterval);
    }, 2000); 

    return () => {
      clearTimeout(loadingTimeout);
      clearInterval(timerInterval);
    };
  }, []);
  return (
    <>
      {isLoading ? (
        <div className="spin-container">
          <Spin indicator={customIndicator} size="large" />
        </div>
      ) : null}
    </>
  );
}
