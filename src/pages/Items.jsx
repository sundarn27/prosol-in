import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, ConfigProvider, Input, Space, Table, Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import rows from "../data.json";
import Search from "antd/es/transfer/search";
import { css } from "@emotion/css";
import { Add } from "@mui/icons-material";
import AddFrom from "../components/AddForm";
import AddButton from "../components/AddButton";
import Loading from "../components/Loading";
import axios from "axios";
import BreadCrumb from "../components/BreadCrumb";

export default function Items() {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddForm, setIsAddForm] = useState(false);
  const [data, setData] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [button, setButton] = useState("Submit");

  const searchInput = useRef(null);
  
  console.log(`${process.env.REACT_APP_API_BASE_URL}`);

  const getData = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/GetData`);
      console.log("API Response:", response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleEdit = (itm) => {
    console.log(itm);
    setIsAddForm(!isAddForm);
    setButton("Update")
    setSingleData(itm);
  };

  const columns = useMemo(
    () =>
      [
    {
      title: (
        <span style={{ fontSize: "12px", fontWeight: "bold" }}>ITEM ID</span>
      ),
      dataIndex: "ItemId",
      key: "ItemId",
      width: "10%",
      ...getColumnSearchProps("ItemId"),
    },
    {
      title: (
        <span style={{ fontSize: "12px", fontWeight: "bold" }}>ITEM NAME</span>
      ),
      dataIndex: "ItemName",
      key: "ItemName",
      width: "30%",
      ...getColumnSearchProps("ItemName"),
    },
    {
      title: (
        <span style={{ fontSize: "12px", fontWeight: "bold" }}>CATEGORY</span>
      ),
      dataIndex: "Category",
      key: "Category",
      width: "20%",
      ...getColumnSearchProps("Category"),
    },
    {
      title: (
        <span style={{ fontSize: "12px", fontWeight: "bold" }}>QUANTITY</span>
      ),
      dataIndex: "CurrentQuantity",
      key: "CurrentQuantity",
      ...getColumnSearchProps("CurrentQuantity"),
      sorter: (a, b) => a.CurrentQuantity.length - b.CurrentQuantity.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: (
        <span style={{ fontSize: "12px", fontWeight: "bold" }}>PURCHASE DATE</span>
      ),
      dataIndex: "CreatedOn",
      key: "CreatedOn",
      ...getColumnSearchProps("CreatedOn"),
      sorter: (a, b) => a.CreatedOn.length - b.CreatedOn.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: (
        <span style={{ fontSize: "12px", fontWeight: "bold" }}>EDIT</span>
      ),
      dataIndex: "operation",
      width: "10%",
      render: (_, record) => (
        <Button
          onClick={() => handleEdit(record)} 
          type="dashed"
          color="primary"
        >
          <EditOutlined />
        </Button>
      ),
    },
  ],[handleEdit]);

  const start = () => {
    setLoading(true);
    setData(rows);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const hasSelected = selectedRowKeys.length > 0;

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const toggleCard = () => {
    setButton("Submit");
    setIsAddForm(!isAddForm);
    getData();
  };

  return (
    <>
      <Loading />
      {isAddForm ? (
        <AddFrom isVisible={isAddForm} toggleCard={toggleCard} singleData={singleData} button={button}  />
      ) : null}
      <BreadCrumb/>
      <div className="column-a">
        <div className="row">
          <div className="row" style={{ width: "50%" }}>
            <Search
              placeholder="input search text"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={onSearch}
            />
            {/* <Tooltip title="Reload">
              <Button type="primary" danger shape="circle" icon={<ReloadOutlined />} />
            </Tooltip> */}
            {/* <Button type="primary" onClick={start} loading={loading}>
              Search
            </Button> */}
          </div>
          <div className="row" style={{ justifyContent: "end" }}>
            <AddButton toggleCard={toggleCard} />
          </div>
        </div>
        <Table columns={columns} dataSource={data} rowKey="_id" />
      </div>
    </>
  );
}
