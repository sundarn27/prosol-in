import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Input,
  Form,
  Select,
  message,
  Popconfirm,
  Tooltip,
  Card,
  Typography,
  Divider,
} from "antd";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import Loading from "../components/Loading";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import BreadCrumb from "../components/BreadCrumb";

dayjs.extend(weekday);

const dateFormat = "DD/MM/YYYY";

const { Option } = Select;

export default function Billing() {
  const [dataSource, setDataSource] = useState([]);
  const [itemMapping, setItemMapping] = useState([]);
  const [count, setCount] = useState(0);
  const [form] = Form.useForm();
  const [sendRequest, setSendRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [billData, setBillData] = useState({
    billId: "",
    customerId: "",
    customerName: "",
    customerEmailId: "",
    billerId: "",
    billerName: "",
    billerEmailId: "",
    customerMobile: "",
    billerMobile: "",
    customerAddress: "",
    BillerAddress: "",
    gstIN: "",
    createdOn: dayjs(),
    createdBy: "",
    status: "Active",
    items: [],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setBillData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleDateChange = (date) => {
    if (date) {
      setBillData((prevData) => ({
        ...prevData,
        purchasedDate: date,
      }));
    }
  };

  const getData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/GetData`
      );
      console.log("API Response:", response);
      if (response.data && Array.isArray(response.data)) {
        const mappedData = response.data.map((i) => ({
          itemId: i.ItemId,
          itemName: i.ItemName,
          category: i.Category,
          createdOn: i.CreatedOn,
          currentDiscount: i.CurrentDiscount,
          currentMrp: i.CurrentMrp,
          currentQuantity: i.CurrentQuantity,
          currentRate: i.CurrentRate,
          total: i.Total,
        }));
        setItemMapping(mappedData);
        console.log(mappedData);
      } else {
        console.error("Invalid data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAdd = () => {
    const newData = {
      key: count,
      sno: count + 1,
      itemName: "",
      currentQuantity: 0,
      currentDiscount: 0,
      currentMrp: 0,
      currentRate: 0,
      total: 0,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleFieldChange = (key, dataIndex, value) => {
    const newData = dataSource.map((item) => {
      if (item.key === key) {
        const updatedItem = { ...item, [dataIndex]: value };
        console.log(dataIndex);
        if (dataIndex === "itemId" || dataIndex === "itemName") {
          const selectedItem = itemMapping.find((i) => i.itemName === value || i.itemId === value);
          console.log(selectedItem);
          if (selectedItem) {
            updatedItem.itemId = selectedItem.itemId;
            updatedItem.itemName = selectedItem.itemName;
            updatedItem.currentQuantity = selectedItem.currentQuantity;
            updatedItem.currentDiscount = selectedItem.currentDiscount;
            updatedItem.currentMrp = selectedItem.currentMrp;
            updatedItem.currentRate = selectedItem.currentRate;
            updatedItem.total = selectedItem.total;
            // Update the form values for the corresponding fields
            form.setFieldsValue({
              [`${key}_itemId`]: selectedItem.itemId,
              [`${key}_itemName`]: selectedItem.itemName,
              [`${key}_currentQuantity`]: selectedItem.currentQuantity,
              [`${key}_currentDiscount`]: selectedItem.currentDiscount,
              [`${key}_currentMrp`]: selectedItem.currentMrp,
              [`${key}_currentRate`]: selectedItem.currentRate,
              [`${key}_total`]: selectedItem.total,
            });
          }
        } else if (
          dataIndex === "currentDiscount" ||
          dataIndex === "currentMrp"
        ) {
          updatedItem.currentRate =
            updatedItem.currentMrp - updatedItem.currentDiscount;
          form.setFieldsValue({
            [`${key}_currentRate`]: updatedItem.currentRate,
          });
        } else if (
          dataIndex === "currentQuantity" ||
          dataIndex === "currentRate"
        ) {
          updatedItem.total =
            updatedItem.currentQuantity * updatedItem.currentRate;
          form.setFieldsValue({
            [`${key}_total`]: updatedItem.total,
          });
        }
        return updatedItem;
      }
      return item;
    });
    setDataSource(newData);
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleFieldChange,
    ...restProps
  }) => {
    let childNode = children;

    if (editable) {
      if (dataIndex === "itemId" || dataIndex === "itemName") {
        childNode = (
          <Form.Item
            style={{ margin: 0 }}
            name={`${record.key}_${dataIndex}`}
            initialValue={record[dataIndex]}
            rules={[{ required: true, message: `${title} is required.` }]}
          >
            <Select
              showSearch
              onChange={(value) =>
                handleFieldChange(record.key, dataIndex, value)
              }
              size="small"
            >
              {itemMapping.map((item) => (
                <Select.Option key={item.itemId} value={item[dataIndex]}>
                  {item[dataIndex]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        );
      } else {
        childNode = (
          <Form.Item
            style={{ margin: 0 }}
            name={`${record.key}_${dataIndex}`}
            initialValue={record[dataIndex]}
            rules={[{ required: true, message: `${title} is required.` }]}
          >
            <Input
              onPressEnter={(e) => {
                handleFieldChange(record.key, dataIndex, e.target.value);
                form.submit();
              }}
              onBlur={(e) => {
                handleFieldChange(record.key, dataIndex, e.target.value);
                form.submit();
              }}
              size="small"
            />
          </Form.Item>
        );
      }
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const handleDelete = useCallback((key) => {
    setDataSource((prevData) => prevData.filter((item) => item.key !== key));
    message.success("Deleted successfully");
  }, []);

  const confirm = useCallback(
    (key) => {
      handleDelete(key);
    },
    [handleDelete]
  );

  const cancel = useCallback((e) => {
    console.log(e);
    message.error("Deletion canceled");
  }, []);

  const columns = useMemo(
    () => [
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>S.No</span>
        ),
        dataIndex: "sno",
        width: "5%",
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>ITEM ID</span>
        ),
        dataIndex: "itemId",
        width: "10%",
        editable: true,
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>
            ITEM NAME
          </span>
        ),
        dataIndex: "itemName",
        width: "20%",
        editable: true,
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>MRP</span>
        ),
        dataIndex: "currentMrp",
        editable: true,
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>DIS</span>
        ),
        dataIndex: "currentDiscount",
        editable: true,
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>RATE</span>
        ),
        dataIndex: "currentRate",
        editable: true,
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>QTY</span>
        ),
        dataIndex: "currentQuantity",
        editable: true,
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>TOTAL</span>
        ),
        dataIndex: "total",
        editable: false,
      },
      {
        title: (
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>DELETE</span>
        ),
        dataIndex: "operation",
        render: (_, record) =>
          dataSource.length >= 1 ? (
            <Popconfirm
              title="Delete the row"
              description="Are you sure to delete this row?"
              onConfirm={() => confirm(record.key)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>
                <DeleteFilled />
              </Button>
            </Popconfirm>
          ) : null,
      },
    ],
    [dataSource, confirm, cancel]
  );

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleFieldChange,
      }),
    };
  });

  const handleSubmit = () => {
    setBillData((prevState) => ({
      ...prevState,
      items: [...prevState.items, ...dataSource],
    }));
  };
  
  const sendData = () => {
    setBillData((prevState) => ({
      ...prevState,
      items: [...prevState.items, ...dataSource],
    }));
    setSendRequest(true);
  };
  
  useEffect(() => {
    if (sendRequest) {
      const sendRequestData = async () => {
        setLoading(true);
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/Savebill`,
            [billData],
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Data sent successfully:", response.data);
          setBillData({
            billId: "",
            customerId: "",
            customerName: "",
            customerEmailId: "",
            billerId: "",
            billerName: "",
            billerEmailId: "",
            customerMobile: "",
            billerMobile: "",
            CustomerAddress: "",
            BillerAddress: "",
            gstIN: "",
            createdOn: dayjs(),
            createdBy: "",
            status: "Active",
            items: [],
          });
          setDataSource([]);
          message.success("Bill submitted successfully");
        } catch (error) {
          console.error("Error sending data:", error);
          message.error("Failed to submit the bill");
        } finally {
          setLoading(false);
          setSendRequest(false);
        }
      };
  
      sendRequestData();
    }
  }, [sendRequest, billData]);


  return (
    <>
      {loading ? <Loading /> : null}
      <BreadCrumb/>
      <div className="column-a">
        <Card>
          <div className="row">
            <div className="column" style={{ width: "70%" }}>
              <div>
                <h5 level={5} className="label">
                  Customer Name
                </h5>
                <Input
                  name="customerName"
                  value={billData.customerName}
                  onChange={handleInputChange}
                  size="small"
                  placeholder="Customer Name"
                />
              </div>
              <div>
                <h5 level={5} className="label">
                  Mobile No.
                </h5>
                <Input
                  name="customerMobile"
                  value={billData.customerMobile}
                  onChange={handleInputChange}
                  size="small"
                  placeholder="Mobile No."
                />
              </div>
              <div>
                <h5 level={5} className="label">
                  Address
                </h5>
                <TextArea
                  name="CustomerAddress"
                  value={billData.customerAddress}
                  onChange={handleInputChange}
                  showCount
                  maxLength={100}
                  placeholder="Address"
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                width: "10%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Divider
                style={{ height: "-webkit-fill-available" }}
                type="vertical"
              />
            </div>
            <div className="column" style={{ width: "20%" }}>
              <div>
                <h5 level={5} className="label">
                  Date
                </h5>
                <Input
                  size="small"
                  format={dateFormat}
                  disabled
                  onChange={handleDateChange}
                  value={dayjs(billData.CreatedOn)}
                  placeholder="Date"
                />
              </div>
              <div>
                <h5 level={5} className="label">
                  GST IN.
                </h5>
                <Input
                  name="gstIN"
                  value={billData.gstIN}
                  onChange={handleInputChange}
                  size="small"
                  placeholder="GST IN"
                />
              </div>
            </div>
          </div>

          <div
            className="row"
            style={{ justifyContent: "end", paddingRight: "5px" }}
          >
            <Button
              onClick={handleAdd}
              type="dashed"
              style={{ marginBottom: "5px" }}
              icon={<PlusOutlined />}
            >
              Add
            </Button>
          </div>
          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={dataSource}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{ pageSize: 3 }}
              size="small"
              style={{ width: "100%", margin: "auto" }}
            />
          </Form>
          <div className="buttons-container">
            <Button danger>Clear</Button>
            &ensp;&ensp;
            <Button type="primary" onClick={sendData}>
              Submit
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
