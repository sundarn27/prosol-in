import React, { useState } from "react";
import { Upload, Button, message, Card, Table, Popover, Progress } from "antd";
import {
  CloseCircleOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import BreadCrumb from "../components/BreadCrumb";
import * as XLSX from "xlsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { importFile, setProgress } from "../features/importSlice";

export default function Import() {
  const dispatch = useDispatch();
  const [position, setPosition] = useState("start");
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const {
    status,
    progress,
    message: successMessage,
    error,
  } = useSelector((state) => state.import) || {};
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const userData = { Username: "Sathishkumar", Userid: "9" };

  Object.entries(userData).forEach(([key, value]) => {
    sessionStorage.setItem(key, value);
  });

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
    message.success("CSV file loaded successfully!");
  };

  // ✅ Excel Parsing using `xlsx`
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
    message.success("Excel file loaded successfully!");
  };

  //Import or Upload file
  const handleUpload = async () => {
    if (!file) {
      message.warning("Please select a file first!");
      return;
    }

    const username = sessionStorage.getItem("Username");
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

  return (
    <>
      <BreadCrumb />
      <Card variant="borderless" style={{ width: "98%", margin: 10 }}>
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
          style={{ width: "98%", margin: "0px 10px" }}
        />
      )}
    </>
  );
}
