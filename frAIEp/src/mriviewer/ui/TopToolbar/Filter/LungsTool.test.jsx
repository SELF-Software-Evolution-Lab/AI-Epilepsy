/*
 * Copyright 2022 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {renderWithState} from '../../../utils/configureTest.js';
import {AppContextProvider} from '../../App/AppContext.jsx';
import {LungsTool} from './LungsTool.jsx';
import VolumeSet from '../../../engine/VolumeSet.jsx';
import Volume from '../../../engine/Volume.jsx';
import {fireEvent, screen} from '@testing-library/react';
import {ToolbarContextProvider} from '../ToolbarContext.jsx';

jest.mock('./Jobs/lungsFillJob.js', () => ({lungsFillJob: jest.fn(() => ({run: () => true, getProgress: () => 0}))}));
jest.useFakeTimers();
jest.spyOn(global, 'setInterval');

describe('Test LungsTool', () => {
    it('should render', async () => {
        const forceUpdate = jest.fn();
        const volumeSet = new VolumeSet();
        const volume = new Volume();
        volume.createEmptyBytesVolume(16, 16, 16);
        volumeSet.addVolume(volume);

        renderWithState(
            <AppContextProvider>
                <ToolbarContextProvider>
                    <LungsTool/>
                </ToolbarContextProvider>
            </AppContextProvider>,
            {volumeSet: volumeSet, volumeIndex: 0, graphics2d: {forceUpdate: forceUpdate}}
        );

        expect(forceUpdate).toBeCalledTimes(0);
        fireEvent.click(screen.getByRole('button'));

        await expect(setInterval).toHaveBeenCalledTimes(1);

        jest.runOnlyPendingTimers();

        expect(forceUpdate).toBeCalledTimes(1);
    });
});
