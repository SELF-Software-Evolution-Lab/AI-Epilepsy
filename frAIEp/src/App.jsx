
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
import Visualizer from "./pages/Visualizer";
import PatientsV2 from "./pages/PatientsV2";
import Patient from "./pages/Patient";
import Auth from "./pages/Login";
import About from "./pages/About";
import {createTheme, ThemeProvider} from "@mui/material";

const router = createBrowserRouter([
  {
    path: "/",
    element:<HomeV2/> ,
  },
  {
    path: "/v1",
    element: <Wrapper><Home/></Wrapper>,
  },
  {
    path: "/patients-v2",
    element: <PatientsV2/>,
  },
  {
    path: "/patient-v2",
    element: <Patient/>,
  },
  {
    path: "/aboutUs",
    element: <Wrapper><AboutUs/></Wrapper>,
  },
  {
    path: "/about",
    element: <About/>,
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
    path: "/patients/:patientid/exams/mri/:examid/",
    element: <Visualizer/>,
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
    path: "/auth",
    element:  <Auth/>,
  },
  {
    path: "*",
    element: <Wrapper> <NotFound/></Wrapper>,
  }
]);

function App() {

  return (
    <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
    </ThemeProvider>
  )
}

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

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