/*
 * Copyright 2021 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Flood fill
 * @module lib/scripts/lungsfill/floodfill
 */

// absolute imports
// import * as THREE from 'three';

// relative imports

// ****************************************************************************
// Const
// ****************************************************************************

// ****************************************************************************
// Class
// ****************************************************************************

/**
 * Class FloodFill perform 3d flood fill
 * @class FloodFill
 */
export default class FloodFill {
    /**
     * Init all internal data
     * @constructs FloodFill
     */
    constructor() {
        this.m_xDim = 0;
        this.m_yDim = 0;
        this.m_zDim = 0;
        this.m_numFilled3d = 0;
    }

    static isVisible(pixels, offset, threshold) {
        const VIS = 255;
        return pixels[offset] <= threshold ? 0 : VIS;
    }

    floodFill3dThreshold(xDim, yDim, zDim, pixelsDst, vSeed, threshold) {
        const xyDim = xDim * yDim;
        const stack = [];
        const VIS = 255;
        this.m_numFilled3d = 0;

        const isVisSeed = FloodFill.isVisible(pixelsDst, vSeed.x + vSeed.y * xDim + vSeed.z * xDim * yDim, threshold);
        if (isVisSeed !== 0) {
            console.log(`Bad seed point: ${vSeed.x}, ${vSeed.y}, ${vSeed.z}`);
        }
        // Decrement highest pixels to reserve special mask value (255)
        // if it was 255, becomes 254
        stack.push({x: vSeed.x, y: vSeed.y, z: vSeed.z});
        while (stack.length !== 0) {
            const vTaken = stack.pop();
            let x;

            const y = vTaken.y;
            const z = vTaken.z;

            const yOff = y * xDim;
            const zOff = z * xyDim;

            // get leftmost
            let xL = 0;
            for (x = vTaken.x; x >= 0 && !FloodFill.isVisible(pixelsDst, x + yOff + zOff, threshold); x--) {
                xL = x + 1;
            }
            xL = x + 1;
            // get rightmost
            let xR = 0;
            for (x = vTaken.x; x < xDim && !FloodFill.isVisible(pixelsDst, x + yOff + zOff, threshold); x++) {
                xR = x - 1;
            }
            xR = x - 1;

            let setYLess = VIS;
            let setYMore = VIS;
            let setZLess = VIS;
            let setZMore = VIS;
            for (x = xL; x <= xR; x++) {
                // set dest point visible
                pixelsDst[x + yOff + zOff] = VIS;
                this.m_numFilled3d++;

                // check line y less
                if (y > 0 && FloodFill.isVisible(pixelsDst, x + yOff + zOff - xDim, threshold) !== setYLess) {
                    setYLess = VIS - setYLess;
                    if (setYLess === 0) {
                        stack.push({x: x, y: y - 1, z: z});
                    } // if need to push
                } // if (y less pint has another vis state

                // check line above
                if (y < yDim - 1 && FloodFill.isVisible(pixelsDst, x + yOff + zOff + xDim, threshold) !== setYMore) {
                    setYMore = VIS - setYMore;
                    if (setYMore === 0) {
                        stack.push({x: x, y: y + 1, z: z});
                    } // if need to push
                } // if (y more point has another vis state

                // check line z less
                //if ((z > 0) && (FloodFill.isVisible(pixelsDst, x + yOff + zOff - xyDim, threshold) !== setZLess)) {
                if (z > 3 && FloodFill.isVisible(pixelsDst, x + yOff + zOff - xyDim, threshold) !== setZLess) {
                    setZLess = VIS - setZLess;
                    if (setZLess === 0) {
                        stack.push({x: x, y: y, z: z - 1});
                    } // if need to push
                } // if (z less pint has another vis state

                // check line z more
                //if ((z < zDim - 1) && (FloodFill.isVisible(pixelsDst, x + yOff + zOff + xyDim, threshold) !== setZMore)) {
                if (z < zDim - 1 - 3 && FloodFill.isVisible(pixelsDst, x + yOff + zOff + xyDim, threshold) !== setZMore) {
                    setZMore = VIS - setZMore;
                    if (setZMore === 0) {
                        stack.push({x: x, y: y, z: z + 1});
                    } // if need to push
                } // if (z more)
            } // for (x) scanned hor line
        } // while stack is not empty
        return 1;
    } // end of floodFill3dThreshold
} // end FloodFill
