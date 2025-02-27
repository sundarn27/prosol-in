import React, { useEffect } from "react";
import Bot from "../images/bot.avif";
import User from "../images/user.avif";
import Search from "antd/es/transfer/search";
import { Button, Card, Input, Space } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useState } from "react";
import { map } from "lodash";
import axios from "axios";
import { fetchBotData } from "../features/commonSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Chat() {
  const dispatch = useDispatch();
  const [searchQueries, setSearchQueries] = useState({
    title: "How can I help you?",
    params: ["Find Manufacturer", "Find Part Number", "Find Status"],
  });
  const [senderInput, setSenderInput] = useState("");
  // const [chatHistory, setChatHistory] = useState([
  //   { msg: "", createdOn: null, action: "" },
  // ]);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputDisable, setInputDisable] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const {
    data: botData,
    loading: botDataLoading,
    error: botDataError,
  } = useSelector((state) => state.botDataRes);

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const handleQuery = (param) => {
    setInputDisable(true);
    setChatHistory([]);
    setSearchKey(param);
    console.log("Query clicked:", param);

    setChatHistory((prevHistory) => [
      ...prevHistory,
      { msg: param, createdOn: new Date(), action: "user" },
    ]);

    setTimeout(() => {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          msg: "Please provide Itemcode (or) Materialcode",
          createdOn: new Date(),
          action: "bot",
        },
      ]);
    }, 1000);
    setInputDisable(false);
  };

  const handleResult = async (input) => {
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { msg: input, createdOn: new Date(), action: "user" },
    ]);
    setSenderInput("");
    const resultAction = await dispatch(
      fetchBotData({ SearchKey: searchKey, SearchInput: input })
    );
  
    if (fetchBotData.fulfilled.match(resultAction)) {
      const botResponse = resultAction.payload;
  
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { msg: botResponse, createdOn: new Date(), action: "bot" },
      ]);
    } else {
      console.error("Error fetching bot data:", botDataError);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { msg: "There was an error getting a response.", createdOn: new Date(), action: "bot" },
      ]);
    }
    setInputDisable(true);
  };
  
  

  return (
    <>
      <div className="chat-container">
        <div className="chat-head">
          <h3>CHAT BOT</h3>
        </div>
        <div className="chat-body">
          <div className="rev-chat">
            <img src={Bot} alt="Bot" />
            <div className="chat">
              <Card
                className="chat-box"
                bordered={false}
                style={{ width: 500, padding: 0 }}
              >
                <h4>{searchQueries.title}</h4>
                {searchQueries.params.map((p) => (
                  <Button type="dashed" block onClick={() => handleQuery(p)}>
                    {p}
                  </Button>
                ))}
              </Card>
            </div>
          </div>
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={chat.action === "user" ? "send-chat" : "rev-chat"}
            >
              {chat.action === "user" ? (
                <img src={User} alt="User" />
              ) : (
                <img src={Bot} alt="Bot" />
              )}
              <div className="chat">
                <Card
                  className="chat-box"
                  bordered={false}
                  style={{
                    width: "max-content",
                    maxWidth: "500px",
                    padding: 0,
                  }}
                >
                  <span>{chat.msg}</span>
                </Card>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-foot">
          <Space.Compact
            style={{
              width: "100%",
            }}
          >
            <Input disabled={inputDisable} onChange={(e) => setSenderInput(e.target.value)} value={senderInput} />
            <Button disabled={inputDisable} className="btn-send" type="primary" onClick={() => handleResult(senderInput)} >
              Send
              <SendOutlined />
            </Button>
          </Space.Compact>
        </div>
      </div>
    </>
  );
}
