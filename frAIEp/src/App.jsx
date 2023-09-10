
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home"
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
    element: <Home/>,
  },
  {
    path: "/aboutUs",
    element: <AboutUs/>,
  },
  {
    path: "/patients",
    element: <Patients/>,
  },
  {
    path: "/patients/:id",
    element: <PatientDetail/>,
  },
  {
    path: "/request-prediction",
    element: <RequestPrediction/>,
  },
  {
    path: "/exam-history",
    element: <ExamHistory/>,
  },
  {
    path: "/asocciate-exam",
    element: <AssociateExam/>,
  },
  {
    path: "/prediction-detail",
    element: <PredictionDetail/>,
  },
  {
    path: "*",
    element: <NotFound/>,
  }
]);

function App() {

  return (
    <>
      <NavBar/>
      <div className="page-container">

        <RouterProvider router={router} />
      </div>

      <Footer />
    </>
  )
}

export default App
