import { toolbox } from "@anolilab/cerebro-core";
import camelCase from "lodash.camelcase";
import kebabCase from "lodash.kebabcase";
import lowerCase from "lodash.lowercase";
import lowerFirst from "lodash.lowerfirst";
import pad from "lodash.pad";
import snakeCase from "lodash.startcase";
import trimEnd from "lodash.trimend";
import trimStart from "lodash.trimstart";
import upperCase from "lodash.uppercase";
import upperFirst from "lodash.upperfirst";
import pluralize, {
    addIrregularRule, addPluralRule, addSingularRule, addUncountableRule, isPlural, isSingular, plural, singular,
} from "pluralize";

import { Strings as IStrings } from "../types";

const { is, isBlank } = toolbox.utils;

/**
 * Is this not a string?
 *
 * @param value The value to check
 * @return True if it is not a string, otherwise false
 */
export function isNotString(value: any): boolean {
    return !is(String, value);
}

/**
 * Returns the value it is given
 *
 * @param value
 * @returns the value.
 */
export function identity(value: any): any {
    return value;
}

/**
 * Converts the value ToPascalCase.
 *
 * @param value The string to convert
 * @returns PascalCase string.
 */
export function pascalCase(value: string): string {
    return upperFirst(camelCase(value));
}

export const strings: IStrings = {
    isNotString,
    isBlank,
    identity,
    pascalCase,
    camelCase,
    kebabCase,
    lowerCase,
    lowerFirst,
    pad,
    snakeCase,
    trimEnd,
    trimStart,
    upperCase,
    upperFirst,
    pluralize,
    plural,
    singular,
    addPluralRule,
    addSingularRule,
    addIrregularRule,
    addUncountableRule,
    isPlural,
    isSingular
};
