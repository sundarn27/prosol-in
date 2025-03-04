import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Layout } from "antd";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import Items from "../pages/Items";
import Bills from "../pages/Bills";
import Billing from "../pages/Billing";
import CatalogueItems from "../pages/CatalogueItems";
import CatalogueEdit from "../pages/CatalogueEdit";
import ErrorPage from "./ErrorPage";
import Import from "./Import";
import PvItems from "./PvItems";
import ReviewItems from "./ReviewItems";
import Dashboard from "./Dashboard";
import AddUser from "../components/AddUser";
import Users from "./Users";
import ChatBot from "../components/ChatBot";

export default function MainPage() {
  const { moduleName, pageName, id } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarItems, setSidebarItems] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const getData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/getPages`
      );
      if (response.data) {
        const filteredPages = response.data.filter(
          (item) => item.Module === moduleName
        );
        console.log(filteredPages);
        const newSidebarItems = filteredPages.map((item) => ({
          key: item.Page,
          label: item.Label,
          page: item.Page,
          module: moduleName,
          seq: item.Sequence,
          icon: item.Icon,
        }));

        setSidebarItems(newSidebarItems);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSidebarClick = (component) => {
    setSelectedComponent(component);
  };

  useEffect(() => {
    const componentPath =
      id && pageName
        ? `${moduleName}/${pageName}/${id}`
        : !id && pageName
        ? `${moduleName}/${pageName}`
        : `${moduleName}/`;
    setSelectedComponent(componentPath);
  }, [moduleName, pageName, id]);

  useEffect(() => {
    getData();
  }, [moduleName]);

  const renderComponent = () => {
    console.log(selectedComponent);
    switch (selectedComponent) {
      case "Users/":
        return <Users />;
      case "Users/Add":
        return <Users />;
      case "Material/":
        return <CatalogueItems />;
      case "Material/Dashboard":
        return <Dashboard />;
      case "Material/Import":
        return <Import />;
      case "Material/PV":
        return <PvItems />;
      case "Material/Catalogue":
        return <CatalogueItems />;

      case `Material/Catalogue/${id}`:
        return id ? <CatalogueEdit id={id} /> : <CatalogueItems />;

      case "Material/Review":
        return <ReviewItems />;

      case "Inventory/":
        return <Items />;
      case "Inventory/Items":
        return <Items />;

      case "Inventory/Billing":
        return <Billing />;

      case "Inventory/Bills":
        return <Bills />;

      default:
        return <ErrorPage />;
    }
  };

  return (
    <>
      <Layout>
        <Navbar collapsed={collapsed} toggleSidebar={toggleSidebar} />

        <Layout style={{ marginTop: "65px" }}>
          <Sidebar
            collapsed={collapsed}
            sideData={sidebarItems}
            onClick={handleSidebarClick}
          />
          <Layout
            style={{
              marginLeft: collapsed ? 80 : 240,
              transition: "margin-left 0.2s",
            }}
          >
            {renderComponent()}
          </Layout>
        </Layout>
      </Layout>
    </>
  );
}
