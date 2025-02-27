import React from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { PrinterOutlined } from "@ant-design/icons";
import { Button } from "antd";

export default function Pdf({ data }) {
  const generatePDF = () => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;

    // Left column
    const leftColumnStart = margin;
    const rightColumnStart = pageWidth - margin;

    doc.setFontSize(12);
    doc.text(`Customer Name: ${data.customerName}`, leftColumnStart, 20);
    doc.text(`Mobile: ${data.mobile}`, leftColumnStart, 30);
    doc.text(`Address: ${data.address}`, leftColumnStart, 40);

    // Right column
    doc.text(`Date: ${data.date}`, rightColumnStart, 20, { align: "right" });
    doc.text(`GSTIN: ${data.GSTIN}`, rightColumnStart, 30, { align: "right" });

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(margin, 50, pageWidth - margin, 50);

    // Table
    const tableColumn = [
      "Item",
      "Quantity",
      "Discount",
      "MRP",
      "Rate",
      "Total",
    ];
    const tableRows = [];

    data.items.forEach((item) => {
      const itemData = [
        item.name,
        item.quantity,
        item.discount,
        item.mrp,
        item.rate,
        item.total,
      ];
      tableRows.push(itemData);
    });

    doc.autoTable({
      startY: 60,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      margin: { left: margin, right: margin },
      headStyles: { fillColor: [0, 57, 107] },
      styles: { halign: "center" },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.text("Thank you for your business!", pageWidth / 2, pageHeight - 10, {
      align: "center",
    });

    doc.save(`${data.customerName}` + ".pdf");
  };

  return (
    <div>
      <Button danger type="primary" onClick={generatePDF}>
        <PrinterOutlined /> Print Bill
      </Button>
    </div>
  );
}
