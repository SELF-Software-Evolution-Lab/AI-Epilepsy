import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {config} from "../config/env.js";
import MRIViewer from "../mriviewer/MRIViewer.jsx";
import {useDispatch, useSelector} from "react-redux";
import StoreActionType from "../mriviewer/store/ActionTypes.js";
import MasterLayout from "../layouts/MasterLayout.jsx";
import {Button, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {BiLeftArrow, BiRightArrow} from "react-icons/bi";
import "./Visualizer.css";
import {headers} from "../util/authorization.js";


function MockImageLister({examid, seriesId}) {
    /*
    Show a list of images for the selected series
     */
    const [images, setImages] = useState([]);
    useEffect(() => {
        let options = {
            headers: {}
        }
        options.headers['authorization'] = headers()

        axios
            .get(`${config.bkAPEp}/exams/mri/${examid}/${seriesId}/file_list.dcm`, options)
            .then((res) => {
                const imageNames = res.data.split("\n")
                setImages(imageNames);
            });
    }, [examid, seriesId]);
    return (
        <table className="styled-table">
            <thead>
            <tr>
                <td>Image name</td>
            </tr>
            </thead>
            <tbody>
            {images.map(i => <tr key={i}>
                <td>{i}</td>
            </tr>)}
            </tbody>
        </table>
    )
}

const selectDicomURL = (state) => state.dicomURL;

function ScanSelection({series, selectedSeries, changeSeries, enableSelection = true}) {
    const handleSelect = (event, newSelection) => {
        if (newSelection === null) changeSeries(selectedSeries);
        changeSeries(newSelection);
    }

    return (
        <div className="scan-select-container text-white">
            <Button
                startIcon={<BiLeftArrow/>}
                variant="outlined"
                onClick={() =>{
                    if (series.indexOf(selectedSeries) > 0)
                        changeSeries(series[series.indexOf(selectedSeries) - 1])
                }}
            />
            <ToggleButtonGroup
                value={selectedSeries}
                exclusive
                onChange={handleSelect}
                aria-label="Series selection"
                color="primary"
            >
                {series.map(s =>
                    <ToggleButton key={s} value={s} disabled={!enableSelection}>{s}</ToggleButton>
                )}
            </ToggleButtonGroup>
            <Button
                endIcon={<BiRightArrow/>}
                variant="outlined"
                onClick={() =>{
                    if (series.indexOf(selectedSeries) < series.length - 1)
                        changeSeries(series[series.indexOf(selectedSeries) + 1])
                }}
            />
        </div>
    )
}

export default function Visualizer() {
    let {examid, patientid} = useParams();
    const [series, setSeries] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState(null)
    const [error, setError] = useState();
    const dispatch = useDispatch();
    const dicomURL = useSelector(selectDicomURL);

    const changeSeries = (newSeries) => {
        console.log("Changing series to: ", newSeries)
        setSelectedSeries(newSeries);
        dispatch({
            type: StoreActionType.SET_DICOM_URL,
            dicomURL: `${config.bkAPEp}/exams/mri/${examid}/${newSeries}/file_list.dcm`,
        })

    }

    useEffect(() => {
        console.log("Loading exam: ", `${config.bkAPEp}/exams/request-mri/${examid}`)
        // Get the list of series for this exam and select the first series if it exists
        let options = {
            headers: {}
        }
        options.headers['authorization'] = headers()

        axios
            .get(`${config.bkAPEp}/exams/request-mri/${examid}`, options)
            .then((res) => {
                setSeries(res.data.files);
                if (res.data.files.length > 0) {
                    const delay = t => new Promise(resolve => setTimeout(resolve, t));
                    delay(1000).then(() => { //TODO improve method to avoid asking for the first series to load before the visualizer is loaded
                        changeSeries(res.data.files[0])
                    })
                }
            }).catch(err => {
                setError(err)
            }
        );
    }, []);

    const renderError = (error) => {
        if (!error.response.data || !error.response.data.message) return <p>There was an error loading the exam</p>

        switch(error.response.data.message){
            case "exam.mri.get.not_found":
                return <p>Exam not found!</p>
            default:
                return<p>There was an error loading the exam</p>
        }
    }
    return (
        <MasterLayout useContainer={false}>
            <div className="text-white">
                <h1>MRI exam visualizer</h1>
                {!error && series.length <= 0 &&
                    <p>Loading scans...</p>
                }
                {!error && series.length > 0 &&
                    <>
                        <ScanSelection
                            selectedSeries={selectedSeries}
                            changeSeries={changeSeries}
                            series={series}
                            enableSelection={true}
                        />
                        <MRIViewer/>
                        <MockImageLister
                            examid={examid}
                            seriesId={selectedSeries}
                        />
                    </>
                }
                {error && renderError(error)}
            </div>
        </MasterLayout>
    )
}