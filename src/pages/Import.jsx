import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Upload,
  Button,
  message,
  Card,
  Table,
  Popover,
  Progress,
  Input,
  Space,
  Tooltip,
  DatePicker,
} from "antd";
import {
  CloseCircleOutlined,
  InfoCircleOutlined,
  UploadOutlined,
  DownloadOutlined,
  FileOutlined,
} from "@ant-design/icons";
import BreadCrumb from "../components/BreadCrumb";
import * as XLSX from "xlsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { importFile, setProgress } from "../features/importSlice";
import warning from "antd/es/_util/warning";
import { fetchFileList } from "../features/fileSlice";
import {
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import CustomTable from "../components/CustomTable";
import GoogleStyleTable from "../components/GoogleTable";

export default function Import() {
  const dispatch = useDispatch();
  const [position, setPosition] = useState("start");
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [files, setFiles] = useState([]);
  const [columns, setColumns] = useState([]);
  const {
    status,
    progress,
    message: successMessage,
    error,
  } = useSelector((state) => state.import) || {};
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // const userData = { Username: "Sathishkumar", Userid: "9" };

  // Object.entries(userData).forEach(([key, value]) => {
  //   sessionStorage.setItem(key, value);
  // });

  //Select file
  const handleBeforeUpload = (file) => {
    const isCSV = file.name.endsWith(".csv");
    const isExcel = file.name.endsWith(".xlsx");

    if (!isCSV && !isExcel) {
      message.error("Please upload a CSV or Excel file!");
      return false;
    }

    setFile(file);
    return false;
  };

  //Remove file
  const handleRemoveFile = () => {
    setFile(null);
    setData([]);
  };

  //Load selected file
  const handleLoad = () => {
    if (!file) {
      message.error("No file selected!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      if (file.name.endsWith(".csv")) {
        parseCSV(content);
      } else {
        parseExcel(content);
      }
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  //Convert XLXS to json
  const parseCSV = (csvText) => {
    const rows = csvText.split("\n").map((row) => row.trim());
    const headers = rows[0].split(",").map((h) => h.trim());
    const jsonData = rows.slice(1).map((row, index) => {
      const values = row.split(",").map((v) => v.trim());
      return {
        key: index,
        ...Object.fromEntries(headers.map((header, i) => [header, values[i]])),
      };
    });

    setColumns(
      headers.map((header) => ({
        title: header,
        dataIndex: header,
        key: header,
      }))
    );
    setData(jsonData);
    console.log(data);
    if (jsonData.length !== 0) {
      message.success("CSV file loaded successfully!");
    } else {
      warning.success("File is empty!");
    }
  };

  // Excel Parsing using `xlsx`
  const parseExcel = (binaryData) => {
    const workbook = XLSX.read(binaryData, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils
      .sheet_to_json(worksheet)
      .map((row, index) => ({ Sno: index + 1, ...row }));

    if (jsonData.length > 0) {
      const headers = Object.keys(jsonData[0]);
      setColumns(
        headers.map((header) => ({
          title: header,
          dataIndex: header,
          key: header,
        }))
      );
    }

    setData(jsonData);
    console.log(data);
    if (jsonData.length !== 0) {
      message.success("Excel file loaded successfully!");
    } else {
      message.warning("File is empty!");
    }
  };

  //Import or Upload file
  const handleUpload = async () => {
    if (!file) {
      message.warning("Please select a file first!");
      return;
    }

    const username = sessionStorage.getItem("UserName");
    const userId = sessionStorage.getItem("Userid");

    if (!username || !userId) {
      alert("User information is missing. Please log in again.");
      return;
    }

    console.log("Uploading file with:", { username, userId });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("Username", username);
    formData.append("Userid", userId);

    // Start fake progress
    let fakeProgress = 10;
    setUploadProgress(fakeProgress); // Update local progress

    const interval = setInterval(() => {
      fakeProgress += 5;
      if (fakeProgress >= 90) {
        clearInterval(interval); // Stop at 90%
      } else {
        setUploadProgress(fakeProgress);
      }
    }, 500);

    const resultAction = await dispatch(
      importFile({
        formData,
        setProgress: (p) => {
          if (p < 90) {
            setUploadProgress(p);
          }
          dispatch(setProgress(p));
        },
      })
    );

    clearInterval(interval);

    if (importFile.fulfilled.match(resultAction)) {
      const responseMessage =
        resultAction.payload?.message?.toString().trim() || "Upload completed!";

      console.log("Upload Response:", responseMessage);

      if (responseMessage.toLowerCase().includes("successfully")) {
        message.success(responseMessage, 10);
        setFile(null);
        setData([]);
        handleFileLoad();
      } else {
        message.error(responseMessage, 10);
      }
    } else if (importFile.rejected.match(resultAction)) {
      const errorMsg =
        resultAction.payload?.toString().trim() || "File upload failed.";

      console.error("Upload Error:", errorMsg);
      message.error(errorMsg, 10);
    }
  };

  const content = (
    <div>
      <p style={{ fontSize: "10px" }}>
        1. Load and upload the file as per given template.
      </p>
      <p style={{ fontSize: "10px" }}>
        2. Convert all data to text format before uploading.
      </p>
    </div>
  );

  const handleDownload = (r) => {
    console.log(r.fileName);
    const link = document.createElement("a");
    link.href = `/uploads/${r.fileName}`;
    link.setAttribute("download", r.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        {dataIndex === "updatedOn" ? (
          <DatePicker
            onChange={(date, dateString) =>
              setSelectedKeys(dateString ? [dateString] : [])
            }
            value={selectedKeys[0] ? dayjs(selectedKeys[0]) : null}
            style={{ marginBottom: 8, display: "block", width: "100%" }}
          />
        ) : (
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: "block" }}
          />
        )}
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (dataIndex === "updatedOn") {
        return record[dataIndex] ? record[dataIndex].startsWith(value) : false;
      }
      return record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    render: (text) =>
      dataIndex === "updatedOn" ? (
        dayjs(text).format("YYYY-MM-DD") // Using Day.js to format dates
      ) : searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const fileColumns = useMemo(
    () => [
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>FILE ID</span>
        ),
        dataIndex: "fileId",
        key: "fileId",
        width: "15%",
        ...getColumnSearchProps("fileId"),
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>
            FILE NAME
          </span>
        ),
        dataIndex: "shortFileName",
        key: "fileName",
        width: "35%",
        ...getColumnSearchProps("fileName"),
        render: (text, r) => (
          <div style={{ display: "flex",flexDirection:'row', alignItems: "center" }}>
            <Tooltip title={r.fileName}>
              <span style={{ cursor: "pointer" }}>{r.fileName}</span>
            </Tooltip>
            <Button
              onClick={() => handleDownload(r)}
              type="link"
              color="primary"
            >
              <FileOutlined />
            </Button>
          </div>
        ),
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>TYPE</span>
        ),
        dataIndex: "type",
        key: "type",
        width: "10%",
        ...getColumnSearchProps("type"),
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>
            UPDATED BY
          </span>
        ),
        dataIndex: "updatedBy",
        key: "updatedBy",
        width: "15%",
        ...getColumnSearchProps("updatedBy"),
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>
            UPDATED ON
          </span>
        ),
        dataIndex: "updatedOn",
        key: "updatedOn",
        width: "25%",
        ...getColumnSearchProps("updatedOn"),
        render: (text, r) => (
          <Tooltip title={r.updatedOn}>
            <span style={{ cursor: "pointer" }}>{r.updatedOn}</span>
          </Tooltip>
        ),
      },
    ],
    [handleDownload]
  );

  const filesList = useSelector((state) => state.file.data);
  const filesLoading = useSelector((state) => state.file.loading);
  const filesError = useSelector((state) => state.file.error);

  // useEffect(() => {
  //   dispatch(fetchFileList({ Status: "Import" }));
  // },[dispatch] );

  const handleFileLoad = useCallback(() => {
    dispatch(fetchFileList({ Status: "Import" }));
  }, [dispatch]);

  useEffect(() => {
    handleFileLoad();
  }, [handleFileLoad]);

  useEffect(() => {
    if (Array.isArray(filesList)) {
      console.log("List Response :" + filesList);
      setFiles(
        filesList.map((item) => {
          return {
            id: item._id,
            fileId: item.FileId,
            fileName: item.FileName,
            shortFileName:
              item.FileName.length > 50
                ? item.FileName.substring(0, 40) + "..."
                : item.FileName,
            flag: item.Flag,
            type: item.Type,
            updatedOn: item.UpdatedBy.UpdatedOn,
            updatedBy: item.UpdatedBy.Name,
          };
        })
      );
    }
    console.log(files);
  }, [filesList, filesLoading, filesError]);

  return (
    <>
      <BreadCrumb />
      <Card
        variant="borderless"
        style={{ width: "98%", margin: 5, marginTop: 40 }}
      >
        <div className="roww">
          <div className="roww" style={{ width: "100%" }}>
            <Upload beforeUpload={handleBeforeUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
            {file && (
              <span
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                {file.name}
                <Button
                  type="text"
                  icon={<CloseCircleOutlined style={{ color: "red" }} />}
                  onClick={handleRemoveFile}
                />
              </span>
            )}
          </div>
          <div className="roww">
            <Button
              type="primary"
              variant="dashed"
              color="danger"
              onClick={handleRemoveFile}
              disabled={!file}
            >
              Clear
            </Button>
            <Button
              variant="solid"
              color="cyan"
              onClick={handleLoad}
              disabled={!file}
            >
              Load
            </Button>
            <Button
              type="primary"
              loading={status === "loading"}
              iconPosition={position}
              onClick={handleUpload}
              style={{ marginLeft: "10px" }}
              disabled={status === "loading" || data.length === 0}
            >
              {status === "loading" ? "Uploading..." : "Upload"}
            </Button>
            {status === "loading" && (
              <Progress percent={uploadProgress} status="active" />
            )}
          </div>
          <Button type="link" href="/templates/Importtemplate.xlsx" download>
            Download Import Template
          </Button>

          <Popover content={content} title="Note">
            <Button
              color="default"
              variant="link"
              icon={<InfoCircleOutlined style={{ color: "#9f9f39" }} />}
            />
          </Popover>
        </div>
      </Card>
      {data.length > 0 && (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
          style={{ width: "98%", margin: "0px 5px" }}
        />
      )}
      {data.length === 0 && (
        <Table
          columns={fileColumns}
          dataSource={files}
          pagination={{ pageSize: 5 }}
          style={{ width: "98%", margin: "0px 5px" }}
        />
      )}
    </>
  );
}
