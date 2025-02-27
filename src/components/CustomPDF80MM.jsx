import React, { forwardRef, useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 20, 
    width: '80mm',
    height: 'max-content',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginBottom: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    paddingRight: 10,
  },
  columnRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '50%',
    paddingLeft: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  h1: {
    fontSize: 16,
    fontWeight: '700',
  },
  h2: {
    fontSize: 14,
    fontWeight: '700',
  },
  h3: {
    fontSize: 8,
    fontWeight: '700',
  },
  h3a: {
    fontSize: 8,
    marginTop: 2,
  },
  h4: {
    fontSize: 6,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginBottom: 10,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid black',
    backgroundColor: '#63869d',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 2,
  },
  itemRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  itemCol: {
    width: '45%',
    color: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    paddingLeft:'5px'
  },
  tableCol: {
    width: '12%',
    color: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  itemCola: {
    width: '45%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    paddingLeft:'5px'
  },
  tableCola: {
    width: '12%',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  totalSection: {
    textAlign: 'right',
    marginTop: 10,
    marginRight: 10,
  },
});

const CustomPDF80MM = forwardRef(({ itemData, paperSize }, ref) => {
  const [size, setSize] = useState(paperSize);
  const [data, setData] = useState({
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
  });

  const calculateTotal = () => {
    return data.items.reduce((total, item) => {
      return total + item.currentRate * item.currentQuantity;
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
              <Text style={styles.h3}>Customer Mobile:</Text>
              <Text style={styles.h3a}>&ensp;{data.mobile}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.h3}>Customer Address:</Text>
              <Text style={styles.h3a}>&ensp;{data.address}</Text>
            </View>
          </View>
          <View style={styles.columnRight}>
            <View style={styles.row}>
              <Text style={styles.h3}>Date:</Text>
              <Text style={styles.h3a}>&ensp;{data.date}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.h3}>GST IN:</Text>
              <Text style={styles.h3a}>&ensp;{data.GSTIN}</Text>
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
          {data.items.map((item, index) => (
            <View style={styles.itemRow} key={index}>
              <View style={styles.itemCola}>
                <Text style={styles.h3a}>{item.itemName}</Text>
              </View>
              <View style={styles.tableCola}>
                <Text style={styles.h3a}>{item.currentMrp}</Text>
              </View>
              <View style={styles.tableCola}>
                <Text style={styles.h3a}>{item.currentQuantity}</Text>
              </View>
              <View style={styles.tableCola}>
                <Text style={styles.h3a}>{item.currentRate}</Text>
              </View>
              <View style={styles.tableCola}>
                <Text style={styles.h3a}>{item.total}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.totalSection}>
          <Text style={styles.h3}>Grant Total:</Text>
          <Text style={styles.h3}>&ensp;{calculateTotal()}</Text>
        </View>
      </Page>
    </Document>
  );
});

export default CustomPDF80MM;
