/*
 * Copyright 2021 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Triagle stack
 * @module lib/scripts/actvolume/trianglestack
 */

// relative imports
import TriangleSingle from './trianglesingle.js';

/**
 * Class TriangleStack builds stack for triangles
 * @class TriangleStack
 */
export default class TriangleStack {
    constructor() {
        this.m_numAllocated = 0;
        this.m_numStacked = 0;
        this.m_stack = null;
    }

    /*
     * Create triangle stack
     * @param {number} depthLevel number of triangles in stack
     */
    create(depthLevel) {
        const ESTIM = 20;
        const MUL_INCREMENT = 4;
        let numTiEstimate = ESTIM;
        for (let i = 0; i < depthLevel; i++) {
            numTiEstimate *= MUL_INCREMENT;
        }
        this.m_numAllocated = numTiEstimate;
        this.m_stack = new Array(this.m_numAllocated);
        for (let i = 0; i < this.m_numAllocated; i++) {
            this.m_stack[i] = new TriangleSingle();
        }
        this.m_numStacked = 0;
    } // create

    /*
     * Get stack depth
     * @return {number} number of triangles in stack
     */
    getStackDepth() {
        return this.m_numStacked;
    }

    /*
     * Chech is stack empty
     * @return {boolean} true, if empty
     */
    isEmpty() {
        return this.m_numStacked === 0;
    }

    /*
     * Push triangle onto stack
     * @param {object} va triangle a (THREE.Vector3)
     * @param {object} vb triangle b (THREE.Vector3)
     * @param {object} vc triangle c (THREE.Vector3)
     */
    push(va, vb, vc) {
        if (this.m_numStacked >= this.m_numAllocated) {
            return -1;
        }
        this.m_stack[this.m_numStacked].va = va;
        this.m_stack[this.m_numStacked].vb = vb;
        this.m_stack[this.m_numStacked].vc = vc;
        this.m_numStacked++;
        return 1;
    } // push triangle

    /*
     * Pop triangle from stack
     * @return {object} TriangleSingle object
     */
    pop() {
        if (this.m_numStacked <= 0) {
            return null;
        }
        this.m_numStacked--;
        return this.m_stack[this.m_numStacked];
    } // pop triangle
}
