/*
 * Copyright 2022 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {useSelector} from 'react-redux';
import {ToolButton} from '../ToolButton.jsx';
import {checkVolume} from './checkVolume.js';
import {useAppContext} from '../../App/AppContext.jsx';
import {lungsFillJob} from './Jobs/lungsFillJob.js';

export const LungsTool = () => {
    const {startJob} = useAppContext();
    const {volumeSet, volumeIndex, graphics2d} = useSelector((state) => state);

    const volume = volumeSet.getVolume(volumeIndex);

    const handleChange = () => {
        if (!checkVolume(volume)) {
            return;
        }

        startJob(lungsFillJob(volume), () => {
            // update render
            graphics2d.forceUpdate();
        });
    };

    return <ToolButton content="Lungs segmentation" onChange={handleChange} icon="lungs"/>;
};
