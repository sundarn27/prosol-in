import { Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import characteristicsData from "../Characteristics.json";
import TextArea from "antd/es/input/TextArea";
import { UserOutlined } from "@ant-design/icons";

export default function Equipments({EquipmentData}) {
    const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    if (EquipmentData) {
        setEquipments(EquipmentData);
    }
  }, []);
  console.log("Equ Data :"+equipments)
  return (
    <>
      <div className="equip-container">
        <div className="form-group">
          <div className="col-input">
            <label>Equipment Name</label>
            <Input value={equipments.name} size="small" />
          </div>
          <div className="col-input">
            <label>Equipment Tag No</label>
            <Input  value={equipments.tagNo} size="small" />
          </div>
          <div className="col-input">
            <label>Equipment Manufacturer</label>
            <Input  value={equipments.manufacturer} size="small" />
          </div>
          <div className="col-input">
            <label>Equipment Serial No</label>
            <Input  value={equipments.serialNo} size="small" />
          </div>
          <div className="col-input">
            <label>Equipment Model No</label>
            <Input  value={equipments.modelNo} size="small" />
          </div>
          <div className="col-input">
            <label>Addtional Information</label>
            <TextArea  value={equipments.additionalInfo} rows={1} size="small" />
          </div>
        </div>
      </div>
    </>
  );
}
