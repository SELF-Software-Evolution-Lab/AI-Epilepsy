/*
 * Copyright 2022 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import {useSelector} from 'react-redux';
import {BrightnessProperty} from './Properties3d/BrightnessProperty.jsx';
import {QualityProperty} from './Properties3d/QualityProperty.jsx';
import {CutProperty} from './Properties3d/CutProperty.jsx';
import {ContrastProperty} from './Properties3d/ContrastProperty.jsx';
import {useNeedShow3d} from '../../utils/useNeedShow3d.js';
import {RoiSelectProperty} from './Properties3d/RoiSelectProperty.jsx';
import {OpacityProperty} from './Properties3d/OpacityProperty.jsx';
import {RGBProperty} from './Properties3d/RGBProperty.jsx';
import {Mode3dSelectionTabs} from './Tabs/Mode3dSelectionTabs.jsx';

export const ModeFast3dSettingsPanel = () => {
    const {isTool3D, volumeSet, volumeIndex} = useSelector((state) => state);
    const needShow3d = useNeedShow3d(volumeSet, volumeIndex);

    return (
        <>
            {needShow3d ? (
                <Mode3dSelectionTabs/>
            ) : (
                <>
                    <RoiSelectProperty/>
                    <RGBProperty changeOnlyRG={true}/>
                    <OpacityProperty/>
                </>
            )}
            <CutProperty/>
            {isTool3D ? (
                <ContrastProperty/>
            ) : (
                <>
                    <BrightnessProperty/>
                    <QualityProperty/>
                </>
            )}
        </>
    );
};
