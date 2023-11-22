/*
 * Copyright 2022 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {CutProperty} from './Properties3d/CutProperty.jsx';
import {BrightnessProperty} from './Properties3d/BrightnessProperty.jsx';
import {QualityProperty} from './Properties3d/QualityProperty.jsx';
import {OpacityProperty} from './Properties3d/OpacityProperty.jsx';
import {HistogramProperty} from './Properties3d/HistogramProperty.jsx';

export const Mode3dSettingsPanel = () => {
    return (
        <>
            <HistogramProperty/>
            <OpacityProperty/>
            <CutProperty/>
            <BrightnessProperty/>
            <QualityProperty/>
        </>
    );
};
