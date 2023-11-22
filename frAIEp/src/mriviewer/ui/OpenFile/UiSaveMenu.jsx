/*
 * Copyright 2022 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {useState} from 'react';

import {useSelector} from 'react-redux';

import {UiModalSaveNifti} from '../Modals/UiModalSaveNifti.jsx';
import {UIButton} from '../Button/Button.jsx';
import {Tooltip} from '../Tooltip/Tooltip.jsx';

export const UiSaveMenu = () => {
    /**
     * @param {object} props - props from up level object
     */
    const [showModalSaveNifti, setShowModalSaveNifti] = useState(false);
    const {isLoaded} = useSelector((state) => state);

    const onModalSaveNiftiShow = () => {
        setShowModalSaveNifti(true);
    };

    const onModalSaveNiftiHide = () => {
        setShowModalSaveNifti(false);
    };
    return (
        <>
            <Tooltip content="Save Nifti">
                <UIButton rounded icon="download" handler={(evt) => onModalSaveNiftiShow(evt)}
                          mode={isLoaded ? 'accent' : ''}/>
            </Tooltip>
            <UiModalSaveNifti stateVis={showModalSaveNifti} onHide={onModalSaveNiftiHide}/>
        </>
    );
};
