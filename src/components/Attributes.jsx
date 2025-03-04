import { Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";

export default function Attributes({
  characteristicsData,
  onCharacteristicsChange = () => {},
}) {
  // console.log("Characteristics Data :", characteristicsData);

  const [characteristics, setCharacteristics] = useState([]);

  useEffect(() => {
    if (characteristicsData) {
      setCharacteristics(Object.values(characteristicsData));
    }
  }, [characteristicsData]);

  const handleValueChange = (index, newValue) => {
    const updatedCharacteristics = characteristics.map((item, i) =>
      i === index ? { ...item, Value: newValue } : item
    );

    setCharacteristics(updatedCharacteristics);
    if (typeof onCharacteristicsChange === "function") {
      onCharacteristicsChange(updatedCharacteristics);
    }
  };
  
  // const handleUOMChange = (index, newUOM) => {
  //   const updatedCharacteristics = characteristics.map((item, i) =>
  //     i === index ? { ...item, uom: newUOM } : item
  //   );

  //   setCharacteristics(updatedCharacteristics);
  //   onCharacteristicsChange(updatedCharacteristics);
  // };

  return (
    <>
      <div className="attr-container">
        {characteristics.length > 0 ? (
          <table>
            <thead>
              <tr style={{ display: "flex", width: "100%" }}>
                <th style={{ width: "50%" }}>Characteristic</th>
                <th style={{ width: "40%" }}>Value</th>
                <th style={{ width: "5%" }}>UOM</th>
              </tr>
            </thead>
            <tbody>
              {characteristics.map((cha, index) => (
                <tr
                  key={index}
                  style={{ display: "flex", alignItems: "flex-start" }}
                >
                  <td>
                    <Input
                      style={{ width: "300px" }}
                      size="small"
                      value={cha.Characteristic}
                      disabled
                    />
                  </td>
                  <td
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1px",
                    }}
                  >
                    <Input
                      style={{ width: "200px" }}
                      size="small"
                      value={cha.Value}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                    />
                    {cha.Value ? (
                      <Input
                        style={{ width: "200px" }}
                        size="small"
                        value={cha.Definition || ""}
                      />
                    ) : null}
                  </td>

                  <td>
                    <Select
                      size="small"
                      placeholder="Select UOM"
                      style={{ flex: 1, width: "80px" }}
                      value={cha.uom}
                      options={[
                        { value: "MM", label: "MM" },
                        { value: "IN", label: "IN" },
                        { value: "CM", label: "CM" },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table>
            <tbody>
              <tr>
                <td colSpan="4">No characteristics data available</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
