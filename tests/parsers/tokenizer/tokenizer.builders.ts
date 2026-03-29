import { ISuccess, ILocation } from "../../../src/types/types.general";
import { buildProjectLocation } from "../../testHelpers";

/**
 * Test data builders for tokenizer tests.
 * These functions construct DocumentMap and DocumentPart structures for testing.
 */

export type CreateDocMapFn = (
    parts: any[],
    depth?: number,
    index?: number,
    path?: string
) => ISuccess<any>;

export type CreatePartFn = (
    text: string,
    line: number,
    char: number,
    path?: string
) => any;

/**
 * Creates test data builder functions for tokenizer tests.
 * 
 * @param ok - Success constructor from IUtil
 * @param getLocation - Location builder function
 * @param defaultPath - Default document path for test data
 */
export const createTokenizerBuilders = (
    ok: (successfulValue: any) => ISuccess<any>,
    getLocation: (path: string, depth: number, index: number, line: number, char: number, extension?: string | false) => ILocation,
    defaultPath: string
) => {
    const createDocMap: CreateDocMapFn = (parts, depth = 1, index = 1, path = defaultPath) => ok({
        projectLocation: buildProjectLocation(path, depth, index),
        parts: parts,
    });

    const createTextPart: CreatePartFn = (text, line, char, path = defaultPath) => ({
        type: 'text' as const,
        text: text,
        location: getLocation(path, 0, 0, line, char),
    });

    const createLispPart: CreatePartFn = (text, line, char, path = defaultPath) => ({
        type: 'lisp' as const,
        text: text,
        location: getLocation(path, 0, 0, line, char),
    });

    return {
        createDocMap,
        createTextPart,
        createLispPart,
    };
};
