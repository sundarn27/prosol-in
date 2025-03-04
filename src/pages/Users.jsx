import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { fetchUserList } from "../features/userSlice";

export default function Users() {
  const dispatch = useDispatch();
  //const [loading, setLoading] = useState(false);
  const [isAddForm, setIsAddForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [formattedUsers, setFormattedUsers] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [button, setButton] = useState("Submit");
  const { loading, error, data } = useSelector((state) => state.userData);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const searchInput = useRef(null);

  //   console.log(`${process.env.REACT_APP_API_BASE_URL}`);

  useEffect(() => {
    const userListAction = dispatch(fetchUserList());
    setUsers(data);
  }, [dispatch]);

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const toggleCard = () => {
    setButton("Submit");
    setIsAddForm(!isAddForm);
    // getData();
  };

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
    // setIsEdit(!isEdit);
    setButton("Update");
    setSingleData(itm);
  };

  const columns = useMemo(
    () => [
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>USER ID</span>
        ),
        dataIndex: "userId",
        key: "userId",
        width: "20%",
        ...getColumnSearchProps("userId"),
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>
            USER NAME
          </span>
        ),
        dataIndex: "fullName",
        key: "fullName",
        width: "20%",
        ...getColumnSearchProps("fullName"),
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>EMAIL</span>
        ),
        dataIndex: "email",
        key: "email",
        width: "30%",
        ...getColumnSearchProps("email"),
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>
            DEPARTMENT
          </span>
        ),
        dataIndex: "department",
        key: "department",
        width: "15%",
        ...getColumnSearchProps("department"),
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>STATUS</span>
        ),
        dataIndex: "status",
        key: "status",
        width: "10%",
        ...getColumnSearchProps("status"),
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
    ],
    [handleEdit]
  );

  useEffect(() => {
    if (Array.isArray(users) && users.length > 0) {
      console.log("List Response:", users);
      setFormattedUsers(
        users.map((item) => ({
          id: item._id,
          userId: item.Userid,
          userName: item.UserName,
          email: item.EmailId,
          fullName: `${item.FirstName} ${item.LastName}`,
          status: item.Islive,
          department: item.Departmentname,
        }))
      );
    }
  }, [users]);

  console.log("Formatted Users:", formattedUsers);

  return (
    <>
      {/* <Loading /> */}
      {isAddForm ? (
        <AddFrom
          isVisible={isAddForm}
          toggleCard={toggleCard}
          singleData={singleData}
          button={button}
        />
      ) : null}
      <BreadCrumb />
      <div className="column-a" style={{ marginTop: "20px",marginBottom:'0px',paddingBottom:0 }}>
        <div className="row">
          <div className="row" style={{ width: "50%" }}>
            {/* <Search
              placeholder="input search text"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={onSearch}
            /> */}
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
        <Table
          columns={columns}
          dataSource={formattedUsers}
          pagination={{ pageSize: 6 }}
          rowKey="id"
        />
      </div>
    </>
  );
}
