import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {config} from "../config/env.js";

function MockImageLister({examid, seriesId}){
    const [images, setImages] = useState([]);
    useEffect(() => {
        axios
            .get(`${config.mockMRIServer}/scans/user123/${examid}/${seriesId}/file_list.txt`)
            .then((res) => {
                const imageNames = res.data.split("\n")
                setImages(imageNames);
            });
    }, [examid, seriesId]);
    return (
        <table className="styled-table">
            <thead>
            <tr><td>Image name</td></tr>
            </thead>
            <tbody>
            {images.map(i => <tr key={i}><td>{i}</td></tr>)}
            </tbody>
        </table>
    )
}

export default function Visualizer() {
    let {examid} = useParams();
    const [series, setSeries] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState(null)

    useEffect(() => {
        axios
            .get(`${config.mockMRIServer}/scan/user123/${examid}`)
            .then((res) => {
                if (res.data.length > 0)
                    setSelectedSeries(res.data[0])
                setSeries(res.data);
            });
    }, []);
    return (
        <>
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
                            onChange={e => setSelectedSeries(e.target.value)}
                        >
                            {series.map(s => <option value={s}>{s}</option>)}
                        </select>
                    </label>
                    <MockImageLister
                        examid={examid}
                        seriesId={selectedSeries}
                        />
                </>
            }
        </>
    )
}