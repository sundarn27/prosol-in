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
import { fetchDataList } from "../features/materialSlice";
import TableSkeleton from "../components/TableSkeleton";
import CatalogueEdit from "./CatalogueEdit";
import { Link, useNavigate } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";

export default function PvItems() {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddForm, setIsAddForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [button, setButton] = useState("Submit");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: materialDataList,
    loading: materialDataLoading,
    error: materialDataError,
  } = useSelector((state) => state.materialData);

  useEffect(() => {
    const username = sessionStorage.getItem("UserName");
    const userId = sessionStorage.getItem("Userid");

    if (!username || !userId) {
      alert("User information is missing. Please log in again.");
      return;
    }
    dispatch(fetchDataList({ UserId: userId, Status: "PV" }));
  }, [dispatch]);

  // console.log(JSON.stringify(materialDataList, materialDataLoading, materialDataError));

  const searchInput = useRef(null);

  // console.log(`${process.env.REACT_APP_API_BASE_URL}`);

  // const getData = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_BASE_URL}/api/GetData`
  //     );
  //     console.log("API Response:", response.data);
  //     setData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  useEffect(() => {
    if (Array.isArray(materialDataList)) {
      console.log(
        JSON.stringify(
          "List Response :" + materialDataList,
          materialDataLoading,
          materialDataError
        )
      );
      setData(
        materialDataList.map((item) => {
          return {
            id: item._id,
            itemCode: item.Itemcode,
            materialCode: item.Materialcode,
            legacy: item.Legacy,
            noun: item.Noun,
            modifier: item.Modifier,
            user: item.PVuser.Name,
            status:
              item.ItemStatus === 13
                ? "PV"
                : item.ItemStatus === -2
                ? "Clarification"
                : "",
          };
        })
      );
    }
  }, [materialDataList, materialDataLoading, materialDataError]);

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
    navigate(`/Material/Catalogue/${itm.itemCode}`);
  };

  const columns = useMemo(
    () => [
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>
            ITEM CODE
          </span>
        ),
        dataIndex: "itemCode",
        key: "itemCode",
        width: "20%",
        ...getColumnSearchProps("itemCode"),
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>
            MATERIAL CODE
          </span>
        ),
        dataIndex: "materialCode",
        key: "materialCode",
        width: "20%",
        ...getColumnSearchProps("materialCode"),
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>
            DESCRIPTION
          </span>
        ),
        dataIndex: "legacy",
        key: "legacy",
        width: "30%",
        ...getColumnSearchProps("legacy"),
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>NOUN</span>
        ),
        dataIndex: "noun",
        key: "noun",
        width: "15%",
        ...getColumnSearchProps("noun"),
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>MODIFIER</span>
        ),
        dataIndex: "modifier",
        key: "modifier",
        width: "15%",
        ...getColumnSearchProps("modifier"),
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
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>USER</span>
        ),
        dataIndex: "user",
        key: "user",
        width: "10%",
        ...getColumnSearchProps("user"),
      },
    ],
    [handleEdit]
  );

  // const start = () => {
  //   setLoading(true);
  //   setData(rows);
  //   setTimeout(() => {
  //     setSelectedRowKeys([]);
  //     setLoading(false);
  //   }, 1000);
  // };

  const hasSelected = selectedRowKeys.length > 0;

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  //   const toggleCard = () => {
  //     setButton("Submit");
  //     setIsAddForm(!isAddForm);
  //     getData();
  //   };
  // console.log(materialDataError)
  // if(materialDataError){
  //   return(
  //     <ErrorPage />
  //   )
  // }

  return (
    <>
      {materialDataLoading ? (
        <TableSkeleton />
      ) : (
        <>
          <BreadCrumb />
          <div style={{ marginTop: "20px" }}>
            <div className="column-a">
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
                {/* <div className="row" style={{ justifyContent: "end" }}>
                  <AddButton toggleCard={toggleCard} />
                </div> */}
              </div>

              <Table columns={columns} dataSource={data} rowKey="_id" />
            </div>
          </div>
        </>
      )}
    </>
  );
}
