import "./App.scss";
import Login from "./pages/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useParams,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";

// function DynamicRouteHandler() {
//   const { moduleName, pageName } = useParams();

//   return <DynamicPageRenderer moduleName={moduleName} pageName={pageName} />;
// }

// const LayoutWithNavbar = ({ children }) => (
//   <>
//     <Navbar />
//     {children}
//   </>
// );

// function DynamicPageRenderer({ moduleName, pageName }) {
//   switch (pageName) {
//     case "Catalogue":
//       return <CataloguePage />;
//     case "Review":
//       return <CataloguePage />;
//     case "Items":
//       return <ItemsPage />;
//     case "Billing":
//       return <BillingPage />;
//     case "Bills":
//       return <BillsPage />;
//     default:
//       return <HomePage />;
//   }
// }

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/Home" element={<HomePage />} />
//         {/* <Route path="/:moduleName" element={<Pages />} /> */}
//         <Route path="/:pageName" element={<DynamicRouteHandler />} />
//       </Routes>
//     </Router>
//     // <>
//     //   <Home/>
//     // </>
//   );
// };
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<HomePage />} />
        {/* Dynamic routes */}
        <Route path="/:moduleName" element={<MainPage />} />
        <Route path="/:moduleName/:pageName" element={<MainPage />} />
        <Route path="/:moduleName/:pageName/:id" element={<MainPage />} />
      </Routes>
    </Router>
    //<>
    //   <ImageModalApp/>
    // </>
  );
};

export default App;
