/*
 * Copyright 2021 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Main } from './ui/Main.jsx';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import "./MRIViewer.css"
import DebugControls from "./debug/DebugControls/DebugControls.jsx";

const MRIViewer = () => {
    return (
        <DndProvider backend={HTML5Backend}>
            <Main />
            <DebugControls/>
        </DndProvider>
    );
};

export default MRIViewer;
