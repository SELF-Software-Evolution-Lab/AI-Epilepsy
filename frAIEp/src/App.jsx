
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home"
import HomeV2 from "./pages/HomeV2"
import AboutUs from "./pages/AboutUs"
import Patients from "./pages/Patients"
import PatientDetail from "./pages/PatientDetail"
import RequestPrediction from "./pages/RequestPrediction"
import ExamHistory from "./pages/ExamHistory"
import AssociateExam from "./pages/AssociateExam"
import PredictionDetail from "./pages/PredictionDetail"
import NotFound from "./pages/NotFound"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Wrapper><Home/></Wrapper>,
  },
  {
    path: "/v2",
    element: <HomeV2/>,
  },
  {
    path: "/aboutUs",
    element: <Wrapper><AboutUs/></Wrapper>,
  },
  {
    path: "/patients",
    element: <Wrapper> <Patients/></Wrapper>,
  },
  {
    path: "/patients/:id",
    element: <Wrapper> <PatientDetail/></Wrapper>,
  },
  {
    path: "/request-prediction",
    element: <Wrapper> <RequestPrediction/></Wrapper>,
  },
  {
    path: "/exam-history",
    element: <Wrapper> <ExamHistory/></Wrapper>,
  },
  {
    path: "/asocciate-exam",
    element: <Wrapper> <AssociateExam/></Wrapper>,
  },
  {
    path: "/prediction-detail",
    element: <Wrapper> <PredictionDetail/></Wrapper>,
  },
  {
    path: "*",
    element: <Wrapper> <NotFound/></Wrapper>,
  }
]);

function App() {

  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}

export default App

function Wrapper (props) {
  return (
    <>
      <NavBar/>
      <div className="page-container">
        {props?.children}
      </div>
      <Footer />
    </>
  )
}