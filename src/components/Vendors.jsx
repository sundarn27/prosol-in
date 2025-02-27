import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, Select } from "antd";
import React, { useEffect, useState } from "react";

export default function Vendors({ VendorData }) {
  console.log("Vendor List", VendorData);
  const [vendorSuppliers, setVendorSuppliers] = useState([
    {
      slno: 0,
      Code: null,
      Name: "",
      Type: "",
      RefNo: "",
      RefNoDup: null,
      Refflag: "",
      s: 1,
      l: 1,
      shortmfr: null,
    },
  ]);

  useEffect(() => {
    if (VendorData) {
      setVendorSuppliers(Object.values(VendorData));
    }
  }, []);

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const onSCheckboxChange = (index, e) => {
    const newVendors = [...vendorSuppliers];
    newVendors[index].s = e.target.checked ? 1 : 0;
    setVendorSuppliers(newVendors);
  };

  const onLCheckboxChange = (index, e) => {
    const newVendors = [...vendorSuppliers];
    newVendors[index].l = e.target.checked ? 1 : 0;
    setVendorSuppliers(newVendors);
  };

  //Add row
  const handleAddRow = () => {
    const newVendor = {
      slno: 0,
      Code: null,
      Name: "",
      Type: "",
      RefNo: "",
      RefNoDup: null,
      Refflag: "",
      s: 1,
      l: 1,
      shortmfr: null,
    };
  
    setVendorSuppliers((prevVendors) => [...prevVendors, newVendor]);
  };
  
  //Remove row
  const handleRemoveRow = (index) => {
    setVendorSuppliers((prevVendors) => prevVendors.filter((_, i) => i !== index));
  };
  

  return (
    <div className="vendor-container">
      <table>
        <thead>
          <tr style={{width:'100%'}}>
            <th style={{width:'18%'}}>Vendor Type</th>
            <th style={{width:'25%'}}>Name</th>
            <th style={{width:'18%'}}>Ref Flag</th>
            <th style={{width:'25%'}}>Ref No</th>
            <th style={{ textAlign: "center",width:'2%' }}>S</th>
            <th style={{ textAlign: "center",width:'2%' }}>L</th>
            <th style={{ textAlign: "center",width:'5%' }}>Add</th>
            <th style={{ textAlign: "center",width:'5%' }}>Remove</th>
          </tr>
        </thead>
        <tbody>
          {vendorSuppliers.map((ven, index) => (
            <tr key={index}>
              <td>
                <Select
                  size="small"
                  placeholder="Select "
                  style={{ flex: 1 }}
                  value={ven.type}
                  options={[
                    { value: "MANUFACTURER", label: "MANUFACTURER" },
                    { value: "SUPPLIER", label: "SUPPLIER" },
                  ]}
                />
              </td>
              <td>
                <Input size="small" value={ven.name} />
              </td>
              <td>
                <Select
                  size="small"
                  placeholder="Select"
                  style={{ flex: 1 }}
                  value={ven.refFlag}
                  options={[
                    { value: "PART NUMBER", label: "PART NUMBER" },
                    { value: "MODEL NUMBER", label: "MODEL NUMBER" },
                    { value: "SERIAL NUMBER", label: "SERIAL NUMBER" },
                    { value: "REFERENCE NUMBER", label: "REFERENCE NUMBER" },
                    { value: "POSITION NUMBER", label: "POSITION NUMBER" },
                  ]}
                />
              </td>
              <td>
                <Input size="small" value={ven.refNo} />
              </td>
              <td>
                <Checkbox
                  onChange={(e) => onSCheckboxChange(index, e)}
                  checked={ven.s === 1}
                />
              </td>
              <td>
                <Checkbox
                  onChange={(e) => onLCheckboxChange(index, e)}
                  checked={ven.l === 1}
                />
              </td>
              <td style={{ textAlign: "center" }}>
                <Button
                  onClick={handleAddRow}
                  icon={<PlusOutlined />}
                  type="primary"
                />
              </td>
              <td style={{ textAlign: "center" }}>
                <Button onClick={() => handleRemoveRow(index)} icon={<DeleteOutlined />} type="danger" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
