import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './DebugControls.css';
import { Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import StoreActionType from '../../store/ActionTypes.js';

const selectDicomURL = (state) => state.dicomURL;
export const DebugControls = (props) => {
    const dispatch = useDispatch();
    const dicomURL = useSelector(selectDicomURL);

    const items = {
        S001: 'http://localhost:3000/scans/user123/1/S001/file_list.dcm',
        S002: 'http://localhost:3000/scans/user123/1/S002/file_list.dcm',
        S003: 'http://localhost:3000/scans/user123/1/S003/file_list.dcm',
    };

    return (
        <div className="ButtonRow">
            <ButtonGroup>
                {Object.entries(items).map(([key, value]) => (
                    <Button
                        variant={dicomURL === value ? 'contained' : 'outlined'}
                        key={key}
                        onClick={(_) =>
                            dispatch({
                                type: StoreActionType.SET_DICOM_URL,
                                dicomURL: value,
                            })
                        }
                    >
                        {key}
                    </Button>
                ))}
                <Button></Button>
            </ButtonGroup>
        </div>
    );
};
export default DebugControls;
