/*
 * Copyright 2022 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

import {Container} from '../Layout/Container.jsx';
import {LungsTool} from './Filter/LungsTool.jsx';
import {DetectBrainTool} from './Filter/DetectBrainTool.jsx';
import {ToolbarContextProvider} from './ToolbarContext.jsx';
import {SobelTool} from './Filter/SobelTool.jsx';
import {BilateralTool} from './Filter/BilateralTool.jsx';

export const FilterTools = () => {
    return (
        <ToolbarContextProvider>
            <Container direction="horizontal">
                <LungsTool/>
                <DetectBrainTool/>
                <SobelTool/>
                <BilateralTool/>
            </Container>
        </ToolbarContextProvider>
    );
};
