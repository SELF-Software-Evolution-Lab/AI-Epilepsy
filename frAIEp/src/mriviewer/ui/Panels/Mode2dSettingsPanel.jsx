/*
 * Copyright 2022 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {SegmentationProperty} from './Properties2d/SegmentationProperty.jsx';
import SelectVolumeProperty from './Properties2d/SelectVolumeProperty.jsx';
import {SliderCaption} from '../Form/index.js';
import {TransverseProperty} from './Properties2d/TransverseProperty.jsx';
import {useSelector} from 'react-redux';

export const Mode2dSettingsPanel = () => {
    const {volumeSet} = useSelector((state) => state);
    const {m_volumes} = volumeSet;

    return (
        <>
            <SliderCaption caption="Slide along the series' images"/>
            <TransverseProperty/>
            {m_volumes.length > 1 && <SelectVolumeProperty/>}
        </>
    );
};
