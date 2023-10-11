/*
 * Copyright 2022 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {ModeFast3dSettingsPanel} from './ModeFast3dSettingsPanel.jsx';
import {renderWithState} from '../../utils/configureTest.js';
import {CutProperty} from './Properties3d/CutProperty.jsx';
import {BrightnessProperty} from './Properties3d/BrightnessProperty.jsx';
import {QualityProperty} from './Properties3d/QualityProperty.jsx';
import {ContrastProperty} from './Properties3d/ContrastProperty.jsx';
import {useNeedShow3d} from '../../utils/useNeedShow3d.js';
import {Mode3dSelectionTabs} from './Tabs/Mode3dSelectionTabs.jsx';
import {RoiSelectProperty} from './Properties3d/RoiSelectProperty.jsx';
import {RGBProperty} from './Properties3d/RGBProperty.jsx';
import {OpacityProperty} from './Properties3d/OpacityProperty.jsx';

jest.mock('./Tabs/Mode3dSelectionTabs.jsx', () => ({Mode3dSelectionTabs: jest.fn(() => <div>Mode3dSelectionTabs</div>)}));
jest.mock('./Properties3d/RoiSelectProperty.jsx', () => ({RoiSelectProperty: jest.fn(() => <div>RoiSelectProperty</div>)}));
jest.mock('./Properties3d/RGBProperty.jsx', () => ({RGBProperty: jest.fn(() => <div>RGBProperty</div>)}));
jest.mock('./Properties3d/OpacityProperty.jsx', () => ({OpacityProperty: jest.fn(() => <div>OpacityProperty</div>)}));
jest.mock('./Properties3d/CutProperty.jsx', () => ({CutProperty: jest.fn(() => null)}));
jest.mock('./Properties3d/BrightnessProperty.jsx', () => ({BrightnessProperty: jest.fn(() => null)}));
jest.mock('./Properties3d/QualityProperty.jsx', () => ({QualityProperty: jest.fn(() => null)}));
jest.mock('./Properties3d/ContrastProperty.jsx', () => ({ContrastProperty: jest.fn(() => null)}));

jest.mock('../../utils/useNeedShow3d.js');
const mockedUseNeedShow3d = useNeedShow3d;

describe('Test ModeFast3dSettingsPanel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render', () => {
        mockedUseNeedShow3d.mockReturnValue(true);
        renderWithState(<ModeFast3dSettingsPanel/>);

        expect(Mode3dSelectionTabs).toBeCalledTimes(1);
        expect(CutProperty).toBeCalledTimes(1);
        expect(BrightnessProperty).toBeCalledTimes(1);
        expect(QualityProperty).toBeCalledTimes(1);

        expect(ContrastProperty).toBeCalledTimes(0);
        expect(RoiSelectProperty).toBeCalledTimes(0);
        expect(RGBProperty).toBeCalledTimes(0);
        expect(OpacityProperty).toBeCalledTimes(0);
    });

    it('should render when needShow3d is false', () => {
        mockedUseNeedShow3d.mockReturnValue(false);
        renderWithState(<ModeFast3dSettingsPanel/>);

        expect(Mode3dSelectionTabs).toBeCalledTimes(0);

        expect(RoiSelectProperty).toBeCalledTimes(1);
        expect(RGBProperty).toBeCalledTimes(1);
        expect(OpacityProperty).toBeCalledTimes(1);
    });

    it('should render when isTool3d true', () => {
        mockedUseNeedShow3d.mockReturnValue(true);
        renderWithState(<ModeFast3dSettingsPanel/>, {isTool3D: true});

        expect(ContrastProperty).toBeCalledTimes(1);

        expect(BrightnessProperty).toBeCalledTimes(0);
        expect(QualityProperty).toBeCalledTimes(0);
    });
});
