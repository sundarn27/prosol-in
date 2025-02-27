import React, { forwardRef, useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 20,
    width: "200mm",
    height: "100%",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginBottom: 10,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    paddingRight: 10,
  },
  columnRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    width: "50%",
    paddingLeft: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  h1: {
    fontSize: 16,
    fontWeight: "700",
  },
  h2: {
    fontSize: 14,
    fontWeight: "700",
  },
  h3: {
    fontSize: 12,
    fontWeight: "700",
    textAlign:'start'
  },
  h3a: {
    fontSize: 12,
    marginTop: 2,
    textAlign:'start'
  },
  h4: {
    fontSize: 10,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: 10,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1px solid black",
    backgroundColor: "#63869d",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 2,
  },
  itemRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  itemCol: {
    width: "35%",
    color: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    paddingLeft: "5px",
  },
  tableCol: {
    width: "15%",
    color: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  itemCola: {
    width: "35%",
    paddingVertical: 5,
    paddingHorizontal: 10,
    paddingLeft: "5px",
  },
  tableCola: {
    width: "15%",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  totalSection: {
    textAlign: "right",
    marginTop: 10,
    marginRight: 20
  },
});

const CustomPdf = forwardRef(({ itemData, paperSize }, ref) => {
  const [size, setSize] = useState(paperSize);
  // const [data, setData] = useState({
  //   customerName: itemData.customerName,
  //   mobile: itemData.customerMobile,
  //   address: itemData.customerAddress,
  //   date: itemData.createdOn,
  //   GSTIN: itemData.gstIN,
  //   items: itemData.items,
  // });
  const [data, setData] = useState({
    "billId" : "BILL-000001", 
    "customerId" : "", 
    "billerId" : null, 
    "customerName" : "Sudalai Perumal", 
    "billerName" : null, 
    "customerEmailId" : "", 
    "billerEmailId" : null, 
    "customerMobile" : "06382754065", 
    "billerMobile" : null, 
    "customerAddress" : "85\nVeerakali amman kovil street\ntiruchendurcccccccccccccccccccccccccccccccccccccccccccccc", 
    "billerAddress" : null, 
    "gstIN" : "", 
    "Items" : [

    ], 
    "CreatedOn" : "", 
    "CreatedBy" : "", 
    "Status" : "Active"
  });

  console.log(itemData);
  // useEffect(() => {
  //   setData({
  //     billId: itemData.billId,
  //     customerId: itemData.customerId,
  //     customerName: itemData.customerName,
  //     customerEmailId: itemData.customerEmailId,
  //     billerId: itemData.billerId,
  //     billerName: itemData.billerName,
  //     billerEmailId: itemData.billerEmailId,
  //     customerMobile: itemData.customerMobile,
  //     billerMobile: itemData.billerMobile,
  //     customerAddress: itemData.CustomerAddress,
  //     BillerAddress: itemData.BillerAddress,
  //     gstIN: itemData.gstIN,
  //     createdOn: itemData.createdOn,
  //     createdBy: itemData.createdBy,
  //     status: itemData.status,
  //     items: itemData.items,
  //   });
  // });

  console.log(data);

  const calculateTotal = () => {
    return data.items.reduce((Total, item) => {
      return Total + item.CurrentRate * item.CurrentQuantity;
    }, 0);
  };

  return (
    <Document ref={ref}>
      <Page size={size} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.h1}>Company Name</Text>
          <Text style={styles.h4}>
            Address: XYZ, Mobile: 898872356, Email: so@yahoo.com
          </Text>
        </View>
        <View style={styles.section}>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={styles.h3}>Customer Name:</Text>
              <Text style={styles.h3a}>&ensp;{data.customerName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.h3}>Mobile:</Text>
              <Text style={styles.h3a}>&ensp;{data.customerMobile}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.h3}>Address:</Text>
              <Text style={styles.h3a}>&ensp;{data.customerAddress}</Text>
            </View>
          </View>
          <View style={styles.columnRight}>
            <View style={styles.row}>
              <Text style={styles.h3}>Date:</Text>
              <Text style={styles.h3a}>&ensp;{data.createdOn}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.h3}>GST IN:</Text>
              <Text style={styles.h3a}>&ensp;{data.gstIN}</Text>
            </View>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.itemCol}>
              <Text style={styles.h3}>Item</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.h3}>MRP</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.h3}>Quantity</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.h3}>Rate</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.h3}>Total</Text>
            </View>
          </View>
          {data?.items?.map((item, index) => (
            <View style={styles.itemRow} key={index}>
              <View style={styles.itemCola}>
                <Text style={styles.h3a}>{item.ItemName}</Text>
              </View>
              <View style={styles.tableCola}>
                <Text style={styles.h3a}>{item.CurrentMrp}</Text>
              </View>
              <View style={styles.tableCola}>
                <Text style={styles.h3a}>{item.CurrentQuantity}</Text>
              </View>
              <View style={styles.tableCola}>
                <Text style={styles.h3a}>{item.CurrentRate}</Text>
              </View>
              <View style={styles.tableCola}>
                <Text style={styles.h3a}>{item.Total}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.totalSection}>
          <Text style={styles.h2}>Grant Total:20000</Text>
          {/* <Text style={styles.h2}>&ensp;{calculateTotal()}</Text> */}
        </View>
      </Page>
    </Document>
  );
});

export default CustomPdf;
