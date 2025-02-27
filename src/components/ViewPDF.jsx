import React from "react";
import CustomPdf from "./CustomPdf";
import { PDFViewer } from "@react-pdf/renderer";

export default function ViewPDF() {
  const invoiceData = {
    customerName: "TATA",
    mobile: "9876543210",
    address: "Mumbai, India",
    date: "18-07-2024",
    GSTIN: "",
    items: [
      {
        name: "Milk",
        quantity: 10,
        discount: 5,
        mrp: 100,
        rate: 95,
        total: 950,
      },
      {
        name: "Curd",
        quantity: 20,
        discount: 3,
        mrp: 150,
        rate: 145,
        total: 2900,
      },
    ],
  };

  return (
    <PDFViewer>
      <CustomPdf itemData={invoiceData} />
    </PDFViewer>
  );
}
