/*
 * Copyright 2022 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';

import UiOpenMenu from '../OpenFile/UiOpenMenu.jsx';

export function Header({fileNameOnLoad}) {
    return <UiOpenMenu fileNameOnLoad={fileNameOnLoad}/>;
}
