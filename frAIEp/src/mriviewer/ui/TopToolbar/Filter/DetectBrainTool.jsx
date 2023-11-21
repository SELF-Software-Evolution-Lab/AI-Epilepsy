/*
 * Copyright 2022 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ToolButton} from '../ToolButton.jsx';
import {useAppContext} from '../../App/AppContext.jsx';
import {checkVolume} from './checkVolume.js';
import {detectBrainJob} from './Jobs/detectBrainJob.js';
import StoreActionType from '../../../store/ActionTypes.js';
import ViewMode from '../../../store/ViewMode.js';
import Modes3d from '../../../store/Modes3d.js';

export const DetectBrainTool = () => {
    const dispatch = useDispatch();
    const {startJob} = useAppContext();
    const {volumeSet, volumeIndex, graphics2d} = useSelector((state) => state);

    const volume = volumeSet.getVolume(volumeIndex);

    const handleChange = () => {
        if (!checkVolume(volume)) {
            return;
        }

        startJob(detectBrainJob(volume), () => {
            dispatch({type: StoreActionType.SET_VOLUME_SET, volumeSet: volumeSet});
            dispatch({type: StoreActionType.SET_IS_LOADED, isLoaded: true});
            dispatch({type: StoreActionType.SET_MODE_VIEW, viewMode: ViewMode.VIEW_2D});
            dispatch({type: StoreActionType.SET_MODE_3D, mode3d: Modes3d.RAYCAST});

            // update render
            graphics2d.forceUpdate();
        });
    };

    return <ToolButton content="Auto detect brain" onChange={handleChange} icon="brain"/>;
};
