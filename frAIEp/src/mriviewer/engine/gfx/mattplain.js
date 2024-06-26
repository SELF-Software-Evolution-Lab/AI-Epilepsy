/*
 * Copyright 2021 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 2d texture simplest render
 * @module lib/scripts/gfx/mattplain
 */

// ******************************************************************
// imports
// ******************************************************************

// absoulte imports
import * as THREE from 'three';

/** Class @class MaterialTexturePlain2d for create artifical volume */
export default class MaterialTexturePlain2d {
    /** Simple material constructor
     * @constructor
     */
    constructor() {
        this.m_strShaderVertex = '';
        this.m_strShaderFragment = '';
        this.m_uniforms = {
            texture1: {type: 't', value: null},
        };
        this.m_strShaderVertex = `
      varying vec3 vecNormal;
      varying vec3 vecPos;
      varying vec2 vecUV;
      void main() {
        vecPos = position;
        vecNormal = normal;
        vecUV = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;
        this.m_strShaderFragment = `
      varying vec3 vecNormal;
      varying vec3 vecPos;
      varying vec2 vecUV;

      uniform sampler2D texture1;

      void main() {
        vec2 texCoord = vecUV;
        vec4 vColTex = texture2D(texture1, texCoord, 0.0);
        float sum = (vColTex.x + vColTex.y + vColTex.z) / 3.0;
        if (sum < 20.0 / 256.0)
          discard;
        gl_FragColor = vec4(vColTex.x, vColTex.y, vColTex.z, sum);
      }
    `;
    }

    /** Simple material constructor
     * @return {object} Three.js material with this shader
     */
    create(tex) {
        // Init uniforms
        this.m_uniforms.texture1.value = tex;

        this.m_material = new THREE.ShaderMaterial({
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneMinusSrcAlphaFactor,
            uniforms: this.m_uniforms,
            vertexShader: this.m_strShaderVertex,
            fragmentShader: this.m_strShaderFragment,
        });
        this.m_material.needsUpdate = true;
    }
}
