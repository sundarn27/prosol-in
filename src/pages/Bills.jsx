import React, { useCallback, useMemo, useRef, useState } from "react";
import Pdf from "../components/Pdf";
import { Button, Input, message, Popconfirm, Space, Table } from "antd";
import {
  DeleteFilled,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import rows from "../customers.json";
import Highlighter from "react-highlight-words";
import Loading from "../components/Loading";
import PrintPDF from "../components/PrintPDF";
import { useEffect } from "react";
import axios from "axios";
import BreadCrumb from "../components/BreadCrumb";

export default function Bills() {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddForm, setIsAddForm] = useState(false);
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/GetBills`
      );
      console.log("API Response:", response.data);
      const mappedData = response.data.map((i) => ({
        billId: i.BillId,
        customerId: i.CustomerId,
        customerName: i.CustomerName,
        customerEmailId: i.CustomerEmailId,
        billerId: i.BillerId,
        billerName: i.BillerName,
        billerEmailId: i.BillerEmailId,
        customerMobile: i.CustomerMobile,
        billerMobile: i.BillerMobile,
        customerAddress: i.CustomerAddress,
        BillerAddress: i.BillerAddress,
        gstIN: i.GSTIN,
        createdOn: i.CreatedOn,
        createdBy: i.CreatedBy,
        status: i.Status,
        items: i.Items,
      }));
      setData(mappedData);
      console.log("Final Response:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const invoiceData = {
    customerName: "TATA",
    mobile: "9876543210",
    address: "Mumbai, India",
    date: "18-07-2024",
    GSTIN: "",
    items: [
      {
        itemName: "Milk",
        currentQuantity: 10,
        currentDiscount: 5,
        currentMrp: 100,
        currentRate: 95,
        total: 950,
      },
      {
        itemName: "Curd",
        currentQuantity: 20,
        currentDiscount: 3,
        currentMrp: 150,
        currentRate: 145,
        total: 2900,
      },
    ],
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

  const cancel = useCallback((e) => {
    console.log(e);
    message.error("Deletion canceled");
  }, []);

  const columns = useMemo(
    () => [
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>CUSTOMER</span>
        ),
        dataIndex: "customerName",
        key: "customerName",
        width: "20%",
        ...getColumnSearchProps("customerName"),
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>MOBILE</span>
        ),
        dataIndex: "customerMobile",
        key: "mobile",
        width: "10%",
        ...getColumnSearchProps("mobile"),
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>ADDRESS</span>
        ),
        dataIndex: "customerAddress",
        key: "address",
        width: "30%",
        ...getColumnSearchProps("address"),
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>DATE</span>
        ),
        dataIndex: "createdOn",
        key: "date",
        width: "20%",
        ...getColumnSearchProps("date"),
        sorter: (a, b) => a.date.length - b.date.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>ACTIONS</span>
        ),
        dataIndex: "operation",
        width: "10%",
        render: (_, record) =>
          data.length >= 1 ? <PrintPDF itemData={record} /> : null,
      },
    ],
    [data]
  );

  return (
    <>
      <Loading />
      <BreadCrumb />
      <div className="column-a">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 6 }}
        />
      </div>
    </>
  );
}
