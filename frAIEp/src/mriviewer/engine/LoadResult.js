/*
 * Copyright 2021 EPAM Systems, Inc. (https://www.epam.com/)
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Loading result codes
 * @module lib/scripts/loaders/loadresult
 */

// ******************************************************************
// imports
// ******************************************************************

/** Class LoadResult to report loading status of binary files  (Ktx, Dicom, Nifti)*/
export default class LoadResult {
    static getResultString(errorCode) {
        switch (errorCode) {
            case LoadResult.SUCCESS:
                return 'Success';
            case LoadResult.UNKNOWN:
                return 'Unknown';
            case LoadResult.BAD_DICOM:
                return 'Bad Dicom';
            case LoadResult.BAD_HEADER:
                return 'Bad header';
            case LoadResult.UNSUPPORTED_ENDIANNESS:
                return 'Unsupported endianness';
            case LoadResult.UNSUPPORTED_COLOR_FORMAT:
                return 'Unsupported color format';
            case LoadResult.WRONG_HEADER_DATA_SIZE:
                return 'Wrong header data size';
            case LoadResult.WRONG_HEADER_DIMENSIONS:
                return 'Wrong header dimensions';
            case LoadResult.WRONG_HEADER_DATA_TYPE:
                return 'Wrong header data type';
            case LoadResult.WRONG_HEADER_BITS_PER_PIXEL:
                return 'Wrong header bits per pixel';
            case LoadResult.WRONG_HEADER_MAGIC:
                return 'Wrong header magic';
            case LoadResult.ERROR_PROCESS_HISTOGRAM:
                return 'Wrong histogram';
            case LoadResult.WRONG_IMAGE_DIM_X:
                return 'Wrong image dim x';
            case LoadResult.WRONG_IMAGE_DIM_Y:
                return 'Wrong image dim y';
            case LoadResult.WRONG_IMAGE_DIM_Z:
                return 'Wrong image dim z';
            case LoadResult.ERROR_PIXELS_TAG_NOT_FOUND:
                return 'Pixels tag is not found';
            case LoadResult.ERROR_NO_MEMORY:
                return 'No memory during loading';
            case LoadResult.ERROR_CANT_OPEN_URL:
                return 'Cant open file via url';
            case LoadResult.ERROR_WRONG_NUM_SLICES:
                return 'Wrong number of slices';
            case LoadResult.ERROR_HISTOGRAM_DETECT_RIDGES:
                return 'Error detect histogram ridges';
            case LoadResult.ERROR_SCALING:
                return 'Error scaling 16 bit data into 8 bit';
            case LoadResult.ERROR_INVALID_SLICE_INDEX:
                return 'Invalid slice index. Possible reason: incomplete dicom folder';
            case LoadResult.ERROR_TOO_SMALL_DATA_SIZE:
                return 'Too small input data size';
            case LoadResult.ERROR_TOO_LARGE_DATA_SIZE:
                return 'Too large input data size';
            case LoadResult.ERROR_COMPRESSED_IMAGE_NOT_SUPPORTED:
                return 'Compressed image formats read is not supported';
            default:
                return 'Unknown error code';
        } // switch
    } // getResultString
} // class LoadResult

LoadResult.SUCCESS = 0;
LoadResult.UNKNOWN = 1;
LoadResult.BAD_DICOM = 2;
LoadResult.BAD_HEADER = 3;
LoadResult.UNSUPPORTED_ENDIANNESS = 4;
LoadResult.UNSUPPORTED_COLOR_FORMAT = 5;
LoadResult.WRONG_HEADER_DATA_SIZE = 6;
LoadResult.WRONG_HEADER_DIMENSIONS = 7;
LoadResult.WRONG_HEADER_DATA_TYPE = 8;
LoadResult.WRONG_HEADER_BITS_PER_PIXEL = 9;
LoadResult.WRONG_HEADER_MAGIC = 10;
LoadResult.ERROR_PROCESS_HISTOGRAM = 11;
LoadResult.WRONG_IMAGE_DIM_X = 12;
LoadResult.WRONG_IMAGE_DIM_Y = 13;
LoadResult.ERROR_PIXELS_TAG_NOT_FOUND = 14;
LoadResult.ERROR_NO_MEMORY = 15;
LoadResult.ERROR_CANT_OPEN_URL = 16;
LoadResult.ERROR_WRONG_NUM_SLICES = 17;
LoadResult.ERROR_HISTOGRAM_DETECT_RIDGES = 18;
LoadResult.ERROR_SCALING = 19;
LoadResult.ERROR_INVALID_SLICE_INDEX = 20;
LoadResult.ERROR_TOO_SMALL_DATA_SIZE = 21;
LoadResult.ERROR_TOO_LARGE_DATA_SIZE = 22;
LoadResult.ERROR_COMPRESSED_IMAGE_NOT_SUPPORTED = 23;
