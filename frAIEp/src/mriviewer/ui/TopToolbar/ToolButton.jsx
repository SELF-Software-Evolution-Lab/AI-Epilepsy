/*
 * Copyright 2022 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {UIButton} from '../Button/Button.jsx';
import {Tooltip} from '../Tooltip/Tooltip.jsx';
import {useToolbarContext} from './ToolbarContext.jsx';

export const ToolButton = (props) => {
    const {onChange, content, icon} = props;
    const {activeTool, setActiveTool} = useToolbarContext();

    const handleChange = () => {
        setActiveTool(icon);
        onChange();
    };

    return (
        <>
            <Tooltip content={content}>
                <UIButton active={activeTool === icon} handler={handleChange} icon={icon}/>
            </Tooltip>
        </>
    );
};
