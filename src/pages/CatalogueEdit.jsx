import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AntDesignOutlined,
  CaretRightOutlined,
  CustomerServiceOutlined,
  FileImageOutlined,
  RobotOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";
import {
  Affix,
  Button,
  Carousel,
  ConfigProvider,
  Space,
  Collapse,
  theme,
  Tabs,
  Input,
  FloatButton,
  Select,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import Attributes from "../components/Attributes";
import Vendors from "../components/Vendors";
import TabPane from "antd/es/tabs/TabPane";
import BreadCrumb from "../components/BreadCrumb";
import { BorderBottom } from "@mui/icons-material";
import { useParams } from "react-router";
import { fetchDataDetail } from "../features/singleMaterialSlice";
import { materialModel } from "../models/materialModel";
import { fetchDictionaryList } from "../features/dictionarySlice";
import Equipments from "../components/Equipments";

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const { Panel } = Collapse;

export default function CatalogueEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { token } = theme.useToken();
  const [open, setOpen] = useState(false);
  const [dictionary, setDictionary] = useState([]);
  const [nounList, setNounList] = useState([]);
  const [modifierList, setModifierList] = useState([]);
  const [materialData, setMaterialData] = useState(materialModel());
  const [filteredNounList, setFilteredNounList] = useState([]);
  const [characteristicsList, setCharacteristicsList] = useState([]);

  const {
    data: dictionaryDataList,
    loading: dictionaryDataLoading,
    error: dictionaryDataError,
  } = useSelector((state) => state.dictionaryData);

  useEffect(() => {
    //console.log("Dispatching fetchDictionaryList...");
    dispatch(fetchDictionaryList());
  }, [dispatch]);

  useEffect(() => {
    setDictionary(dictionaryDataList);
    console.log("Dictionary List", dictionaryDataList);
    const dumbNoun = dictionaryDataList.map((i) => i.Noun);
    const nounWithoutDuplicates = [...new Set(dumbNoun)];
    setNounList(nounWithoutDuplicates);
    console.log("Noun List", nounList);

    if (materialData && materialData.noun) {
      const filteredModifiers = dictionaryDataList.filter(
        (i) => i.Noun === materialData.noun
      );
      const dumbModifier = filteredModifiers.map((i) => i.Modifier);
      const modifierWithoutDuplicates = [...new Set(dumbModifier)];
      setModifierList(modifierWithoutDuplicates);
    }
    console.log("Modifier List", modifierList);

    if (materialData && materialData.noun && materialData.modifier) {
      const filteredChars = dictionaryDataList.filter(
        (i) =>
          i.Noun === materialData.noun && i.Modifier === materialData.modifier
      );
      setCharacteristicsList(filteredChars);
    }

    if (materialData && materialData.characteristics) {
      console.log("Old Characteristics List", materialData.characteristics);
      const updatedCharacteristics = characteristicsList.map((value1) => {
        // Find matching item from cat.Characteristics
        const matchingValue = materialData.characteristics.find(
          (value2) => value2.characteristic === value1.Characteristic
        );

        if (matchingValue) {
          return {
            ...value1,
            Value: matchingValue.value,
            UOM: matchingValue.uom,
            Source: matchingValue.source,
            SourceUrl: matchingValue.sourceUrl,
            Squence: value1.sequence,
            ShortSquence: value1.shortSequence,
            //UomMandatory: value1.uomMandatory,
            //Mandatory: cat.Exchk ? 'No' : value1.Mandatory,
            // Uncomment the lines below if you want to add additional fields
            // Abbrivation: matchingValue.Abbrevated,
            // Approve: matchingValue.Approve,
            // btnName: "Approve",
          };
        }

        return value1;
      });

      setCharacteristicsList(updatedCharacteristics);
    }
    console.log("Characteristics List", characteristicsList);
  }, [
    dictionaryDataList,
    dictionaryDataLoading,
    dictionaryDataError,
    nounList,
    modifierList,
    characteristicsList,
    materialData,
  ]);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
    //console.log(open);
  };

  const panelStyle = {
    marginBottom: 2,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const {
    data: singleDataList,
    loading: singleDataLoading,
    error: singleDataError,
  } = useSelector((state) => state.singleData);

  useEffect(() => {
    if (id) {
      dispatch(fetchDataDetail(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (singleDataList && !singleDataLoading && !singleDataError) {
      setMaterialData(singleDataList);
    }
  }, [singleDataList, singleDataLoading, singleDataError]);

  const getItems = (panelStyle) => [
    {
      key: "1",
      label: "Characteristics",
      children: (
        <Attributes characteristicsData={materialData?.characteristics} />
      ),
      style: panelStyle,
    },
    {
      key: "2",
      label: "Vendor Details",
      children: <Vendors VendorData={materialData?.vendorSuppliers} />,
      style: panelStyle,
    },
    {
      key: "3",
      label: "Equipment Details",
      children: <Equipments EquipmentData={materialData?.equipment} />,
      style: panelStyle,
    },
  ];

  const handleNounChange = (value) => {
    setMaterialData((prevMaterialData) => ({
      ...prevMaterialData,
      noun: value,
    }));
    if (value) {
      var filterModifiers = modifierList.filter((m) => m.Noun == value);
      setModifierList(filterModifiers);
    } else {
      setModifierList([]);
    }
  };

  const handleNounSearch = (newValue) => {
    if (newValue) {
      const filteredList = nounList.filter((noun) =>
        noun.toLowerCase().includes(newValue.toLowerCase())
      );
      setFilteredNounList(filteredList);
    } else {
      setFilteredNounList(nounList);
    }
  };

  const handleModifierChange = (value) => {
    setMaterialData({
      ...materialData,
      modifier: value,
    });
  };

  const handleModifierSearch = (newValue) => {
    if (newValue) {
      const filteredList = modifierList.filter((modifier) =>
        modifier.toLowerCase().includes(newValue.toLowerCase())
      );
      setModifierList(filteredList);
    } else {
      setModifierList(modifierList);
    }
  };
  return (
    <>
      <div className="cat-container">
        <Affix offsetTop={60} onChange={(affixed) => console.log(affixed)}>
          <div style={{ background: "#f0f2f5" }} className="row">
            <div style={{ display: "flex", width: "40%" }}>
              <BreadCrumb />
            </div>
            <div className="buttons-group">
              <Button color="primary" variant="solid">
                Rework
              </Button>
              <Button color="primary" variant="solid">
                Generate SL
              </Button>
              <Button color="primary" variant="solid">
                Save
              </Button>
              <Button color="primary" variant="solid">
                Submit
              </Button>
            </div>
          </div>
          <div className="cat-head">
            <div className="item">
              <Button
                type="primary"
                size="small"
                icon={<StepBackwardOutlined />}
                style={{ float: "left" }}
              ></Button>
              <h4>ITEM CODE : {materialData.itemCode}</h4>
              <Button
                type="primary"
                size="small"
                icon={<StepForwardOutlined />}
              ></Button>
            </div>
          </div>
        </Affix>
        <div className="legacy"></div>
        <div className="cat-body">
          <Affix offsetTop={132} onChange={(affixed) => console.log(affixed)}>
            <div className="input-group">
              <label>Legacy</label>
              <TextArea value={materialData.legacy} rows={2} />
            </div>
            <div
              className="row"
              style={{ background: "#f0f2f5", padding: "5px" }}
            >
              <div className="col-input">
                <label>Noun</label>
                {/* <Input value={materialData.noun} size="small" /> */}
                <Select
                  showSearch
                  size="small"
                  value={materialData.noun}
                  placeholder="Type Noun"
                  optionFilterProp="label"
                  onSearch={handleNounSearch}
                  onChange={handleNounChange}
                  options={(filteredNounList || []).map((d) => ({
                    value: d,
                    label: d,
                  }))}
                />
              </div>
              <div className="col-input">
                <label>Modifier</label>
                {/* <Input value={materialData.modifier} size="small" /> */}
                <Select
                  showSearch
                  size="small"
                  value={
                    modifierList.some(
                      (modifier) => modifier === materialData.modifier
                    )
                      ? materialData.modifier
                      : undefined
                  }
                  placeholder="Type Modifier"
                  optionFilterProp="label"
                  onSearch={handleModifierSearch}
                  onChange={handleModifierChange}
                  options={(modifierList || []).map((d) => ({
                    value: d,
                    label: d,
                  }))}
                  disabled={!materialData.noun}
                />
              </div>
              <div className="col-input">
                <label>UOM</label>
                <Input value={materialData.uom} size="small" />
              </div>
              <div className="col-input">
                <label>Item Type</label>
                <Input size="small" />
              </div>
              <div className="col-input">
                <label>Exceptional</label>
                <Input size="small" />
              </div>
            </div>
          </Affix>
          <Tabs
            defaultActiveKey="1"
            style={{ height: "20px", padding: "2px 10px" }}
          >
            <TabPane tab="Description" key="1">
              <Collapse
                bordered={false}
                defaultActiveKey={["1"]}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                style={{
                  background: token.colorBgContainer,
                }}
                items={getItems(panelStyle)}
              />
            </TabPane>
            <TabPane tab="Warehouse" key="2">
              <p>Warehouse</p>
            </TabPane>
            <TabPane tab="Attachments" key="3">
              <p>Attachments</p>
            </TabPane>
          </Tabs>
          {/* <Collapse
            bordered={false}
            defaultActiveKey={["1"]}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            style={{
              background: token.colorBgContainer,
            }}
            items={getItems(panelStyle)}
          /> */}
        </div>
      </div>
      <Affix offsetBottom={10}>
        <div className="cat-foot"></div>
      </Affix>
    </>
  );
}
