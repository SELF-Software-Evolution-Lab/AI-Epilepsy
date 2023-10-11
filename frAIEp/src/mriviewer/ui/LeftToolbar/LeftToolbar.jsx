/*
 * Copyright 2022 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {useSelector} from 'react-redux';

import ViewMode from '../../store/ViewMode.js';
import {ModeSwitcherToolbar} from './ModeSwitcherToolbar.jsx';
import {ModeFast3dToolbar} from './ModeFast3dToolbar.jsx';
import ModeView from '../../store/ViewMode.js';
import {Mode2dToolbar} from './Mode2dToolbar.jsx';

export const LeftToolbar = () => {
    const {viewMode} = useSelector((state) => state);

    return (
        <>
            <ModeSwitcherToolbar/>
            {viewMode === ViewMode.VIEW_3D_LIGHT && <ModeFast3dToolbar/>}
            {viewMode === ModeView.VIEW_2D && <Mode2dToolbar/>}
        </>
    );
};
