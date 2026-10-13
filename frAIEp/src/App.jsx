import {createBrowserRouter, RouterProvider} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home"
import PatientDetail from "./pages/PatientDetail"
import RequestPrediction from "./pages/RequestPrediction"
import ExamHistory from "./pages/ExamHistory"
import AssociateExam from "./pages/AssociateExam"
import PredictionDetail from "./pages/PredictionDetail"
import NotFound from "./pages/NotFound"
import Visualizer from "./pages/Visualizer";
import Patients from "./pages/Patients";
import Patient from "./pages/Patient";
import Auth from "./pages/Login";
import About from "./pages/About";
import {createTheme, ThemeProvider} from "@mui/material";

const router = createBrowserRouter([
  {
    path: "/",
    element:<Home/> ,
  },
  {
    path: "/patients",
    element: <Patients/>,
  },
  {
    path: "/patient",
    element: <Patient/>,
  },
  {
    path: "/about",
    element: <About/>,
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
      <Footer/>
    </>
  )
}