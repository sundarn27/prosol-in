import React, { useEffect, useState } from "react";
import { Button, Card, Divider, message, Input, Typography, Select, DatePicker } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import { useSpring, animated } from "react-spring";
import Loading from "./Loading";
import axios from "axios";

dayjs.extend(weekday);

const dateFormat = "DD/MM/YYYY";

export default function AddFrom({ isVisible, toggleCard, singleData,button }) {
  const [purchaseDate, setPurchaseDate] = useState(dayjs());
  const [itemData, setItemData] = useState({
    itemId: "",
    itemName: "",
    category: "",
    currentRate: 0,
    currentMrp: 0,
    currentQuantity: 0,
    currentDiscount: 0,
    total: 0,
    gst: "",
    lowStock: "",
    maxStock: "",
    hsn: "",
    CreatedOn: dayjs(),
    CreatedBy: "",
    status: "Active",
  });

  useEffect(() => {
    if (singleData) {
      setItemData({
        itemId: singleData.ItemId || "",
        itemName: singleData.ItemName || "",
        category: singleData.Category || "",
        currentRate: singleData.CurrentRate || 0,
        currentMrp: singleData.CurrentMrp || 0,
        currentQuantity: singleData.CurrentQuantity || 0,
        currentDiscount: singleData.CurrentDiscount || 0,
        total: singleData.Total || 0,
        gst: singleData.GST || "",
        lowStock: singleData.LowStock || "",
        maxStock: singleData.MaxStock || "",
        hsn: singleData.HSN || "",
        CreatedOn: dayjs(singleData.CreatedOn) || dayjs(),
        CreatedBy: singleData.CreatedBy || "",
        status: singleData.Status || "Active",
      });
    }
  }, [singleData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setItemData((prevData) => {
      let updatedValue = value;

      if (name === "currentMrp" || name === "currentDiscount") {
        const currentMrp =
          name === "currentMrp"
            ? parseFloat(value)
            : parseFloat(prevData.currentMrp) || 0;
        const currentDiscount =
          name === "currentDiscount"
            ? parseFloat(value)
            : parseFloat(prevData.currentDiscount) || 0;

        const currentRate = currentMrp - currentDiscount;

        return {
          ...prevData,
          [name]: parseFloat(value) || 0,
          currentRate: isNaN(currentRate) ? 0 : currentRate,
        };
      } else if (
        ["currentRate", "currentQuantity", "lowStock", "maxStock"].includes(
          name
        )
      ) {
        updatedValue = parseFloat(value) || 0;
      } else {
        updatedValue = value;
      }

      return {
        ...prevData,
        [name]: updatedValue,
      };
    });
  };

  const handleCategoryChange = (value) => {
    setItemData((prevData) => ({
      ...prevData,
      category: value,
    }));
  };

  const handleDateChange = (date) => {
    if (date) {
      setItemData((prevData) => ({
        ...prevData,
        purchasedDate: date,
      }));
    }
  };

  const props = useSpring({
    config: { duration: 90 },
    opacity: 1,
    from: { opacity: 0 },
  });

  var options = [
    "Groceries",
    "Dairy Products",
    "Meat and Poultry",
    "Bakery Products",
    "Beverages",
    "Household Items",
    "Frozen Foods",
    "Non-Food Items",
    "Fresh Foods",
  ];

  options = options.map((op) => ({
    value: op,
    label: op,
  }));

  const dateChange = (date, dateString) => {
    console.log(date, dateString);
    setPurchaseDate(date);
  };

  const handleSubmit = () => {
    console.log(itemData);
  };


  const sendData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/Savedata`,
        [itemData],
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Data sent successfully:", response.data);
      <Loading />;
      toggleCard();
      if (button == "Submit") {
        message.success("Item added successfully");
      } else {
        message.success("Item updated successfully");
      }
    } catch (error) {
      console.error("Error sending data:", error);
      message.error("Failed");
    }
  };

  return (
    <>
      <Loading />
      <animated.div
        style={props}
        className={`card-container ${isVisible ? "open" : "closed"}`}
      >
        <Card
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>New Item</span>
              <Button
                size="small"
                shape="circle"
                type="dashed"
                danger
                icon={<CloseOutlined />}
                onClick={toggleCard}
              ></Button>
            </div>
          }
          bordered={false}
          className="card"
        >
          <div className="row">
            <div className="column">
              <div>
                <Typography.Title level={5} className="label">
                  Item ID
                </Typography.Title>
                <Input
                  size="small"
                  name="itemId"
                  value={itemData.itemId}
                  onChange={handleInputChange}
                  placeholder="ITM-XXXXXX"
                  disabled
                />
              </div>
              <div>
                <Typography.Title level={5} className="label">
                  Item Name
                </Typography.Title>
                <Input
                  size="small"
                  name="itemName"
                  value={itemData.itemName}
                  onChange={handleInputChange}
                  placeholder="Item name : Milk"
                />
              </div>
              <div>
                <Typography.Title level={5} className="label">
                  Category
                </Typography.Title>
                <Select
                  size="small"
                  placeholder="Category"
                  style={{ width: "100%" }}
                  options={options}
                  value={itemData.category}
                  onChange={handleCategoryChange}
                />
              </div>
              <div>
                <Typography.Title level={5} className="label">
                  Purchased MRP
                </Typography.Title>
                <Input
                  size="small"
                  placeholder="MRP : 200"
                  prefix="₹"
                  suffix="INR"
                  name="currentMrp"
                  value={itemData.currentMrp}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Typography.Title level={5} className="label">
                  Discount
                </Typography.Title>
                <Input
                  size="small"
                  placeholder="Discount : 5"
                  prefix="₹"
                  suffix="INR"
                  name="currentDiscount"
                  value={itemData.currentDiscount}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Typography.Title level={5} className="label">
                  Purchase Rate
                </Typography.Title>
                <Input
                  size="small"
                  placeholder="Rate : 195"
                  prefix="₹"
                  suffix="INR"
                  name="currentRate"
                  value={itemData.currentRate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <Divider style={{ height: "auto" }} type="vertical" />
            <div className="column">
              <div>
                <Typography.Title level={5} className="label">
                  Quantity
                </Typography.Title>
                <Input
                  size="small"
                  name="currentQuantity"
                  value={itemData.currentQuantity}
                  onChange={handleInputChange}
                  placeholder="Quantity : 20"
                />
              </div>
              <div>
                <Typography.Title level={5} className="label">
                  GST %
                </Typography.Title>
                <Input
                  size="small"
                  name="gst"
                  value={itemData.gst}
                  onChange={handleInputChange}
                  placeholder="GST : 2"
                  suffix="%"
                />
              </div>
              <div>
                <Typography.Title level={5} className="label">
                  Low Stock Level
                </Typography.Title>
                <Input
                  size="small"
                  placeholder="Low"
                  style={{ width: "100%" }}
                  name="lowStock"
                  value={itemData.lowStock}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Typography.Title level={5} className="label">
                  Max Stock Level
                </Typography.Title>
                <Input
                  size="small"
                  placeholder="Maximum"
                  style={{ width: "100%" }}
                  name="maxStock"
                  value={itemData.maxStock}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Typography.Title level={5} className="label">
                  Purchase Date
                </Typography.Title>
                <DatePicker
                  size="small"
                  style={{ width: "100%" }}
                  format={dateFormat}
                  disabled
                  onChange={handleDateChange}
                  value={dayjs(itemData.CreatedOn)}
                />
              </div>
              <div>
                <Typography.Title level={5} className="label">
                  HSN No.
                </Typography.Title>
                <Input
                  size="small"
                  placeholder="HSN No. : XXXXXX"
                  name="hsn"
                  value={itemData.hsn}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div
            className="row"
            style={{ marginTop: "30px", justifyContent: "end" }}
          >
            <Button danger>Cancel</Button>
            <Button type="primary" onClick={sendData}>
              {button}
            </Button>
          </div>
        </Card>
      </animated.div>
    </>
  );
}
