import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {config} from "../config/env.js";
import MRIViewer from "../mriviewer/MRIViewer.jsx";
import {useDispatch, useSelector} from "react-redux";
import StoreActionType from "../mriviewer/store/ActionTypes.js";
import MasterLayout from "../layouts/MasterLayout.jsx";

function MockImageLister({examid, seriesId}) {
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


export default function Visualizer() {
    let {examid, patientid} = useParams();
    const [series, setSeries] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState(null)
    const dispatch = useDispatch();
    const dicomURL = useSelector(selectDicomURL);

    useEffect(() => {
        axios
            .get(`${config.bkAPEp}/exams/request-mri/${examid}`)
            .then((res) => {
                if (res.data.files.length > 0)
                    setSelectedSeries(res.data.files[0])
                setSeries(res.data.files);
            });
    }, []);
    return (
        <MasterLayout useContainer={false}>
            <div className="text-white">
                <h1>Series</h1>
                {series.length <= 0 &&
                    <p>Loading scans...</p>
                }
                {series.length > 0 &&
                    <>
                        <label>
                            Selected series:
                            <select
                                name="selectedScan"
                                value={selectedSeries}
                                onChange={e => {
                                    let seriesID = e.target.value;
                                    dispatch({
                                        type: StoreActionType.SET_DICOM_URL,
                                        dicomURL: `${config.bkAPEp}/exams/mri/${examid}/${seriesID}/file_list.dcm`,
                                    })
                                    setSelectedSeries(seriesID)
                                }}>
                                {series.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </label>
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