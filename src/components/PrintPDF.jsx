import React, { useRef, useState } from "react";
import { Button, Select } from "antd";
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import CustomPdf from "./CustomPdf"; // path to your CustomPdf component
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import CustomPDF80MM from "./CustomPDF80MM";

const PrintPDF = ({ itemData }) => {
  console.log(itemData);
  const [size, setSize] = useState("A4");
  const componentRef = useRef();

  let options = ["80MM", "A4"];
  options = options.map((op) => ({
    value: op,
    label: op,
  }));

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Print Document",
  });

  const handleDownload = async () => {

    console.log(itemData)
    let blob;

    if (size === "80MM") {
      blob = await pdf(
        <CustomPDF80MM itemData={itemData} paperSize={size} />
      ).toBlob();
    } else if (size === "A4") {
      blob = await pdf(
        <CustomPdf itemData={itemData} paperSize={size} />
      ).toBlob();
    }

    if (blob) {
      saveAs(blob, `${itemData.customerName}.pdf`);
    }
  };

  return (
    <div className="row">
      <div style={{ display: "none" }}>
        {size === "80MM" ? (
          <CustomPDF80MM ref={componentRef} itemData={itemData} paperSize={size} />
        ) : (
          <CustomPdf ref={componentRef} itemData={itemData} paperSize={size} />
        )}
      </div>
      <Select
        size="middle"
        placeholder="Select Paper Size"
        style={{ width: "100%" }}
        options={options}
        value={size}
        onChange={(value) => setSize(value)}
      />
      <Button type="primary" onClick={handleDownload}>
        <DownloadOutlined /> Download
      </Button>
      <Button danger onClick={handlePrint}>
        <PrinterOutlined /> Print
      </Button>
    </div>
  );
};

export default PrintPDF;
