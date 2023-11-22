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


function MockImageLister({examid, seriesId}) {
    /*
    Show a list of images for the selected series
     */
    const [images, setImages] = useState([]);
    useEffect(() => {
        axios
            .get(`${config.bkAPEp}/exams/mri/${examid}/${seriesId}/file_list.dcm`)
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
    const dispatch = useDispatch();
    const dicomURL = useSelector(selectDicomURL);

    const changeSeries = (newSeries) => {
        setSelectedSeries(newSeries);
        dispatch({
            type: StoreActionType.SET_DICOM_URL,
            dicomURL: `${config.bkAPEp}/exams/mri/${examid}/${newSeries}/file_list.dcm`,
        })

    }

    useEffect(() => {
        // Get the list of series for this exam and select the first series if it exists
        axios
            .get(`${config.bkAPEp}/exams/request-mri/${examid}`)
            .then((res) => {
                setSeries(res.data.files);
                if (res.data.files.length > 0) {
                    changeSeries(res.data.files[0])
                }
            });
    }, []);
    return (
        <MasterLayout useContainer={false}>
            <div className="text-white">
                <h1>MRI exam visualizer</h1>
                {series.length <= 0 &&
                    <p>Loading scans...</p>
                }
                {series.length > 0 &&
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
            </div>
        </MasterLayout>
    )
}