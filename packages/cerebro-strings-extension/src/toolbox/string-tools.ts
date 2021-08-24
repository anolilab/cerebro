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
import pluralizePkg from "pluralize";

const {
    plural, singular, addPluralRule, addSingularRule, addIrregularRule, addUncountableRule, isPlural, isSingular,
} = pluralizePkg;

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

export const strings: Strings = {
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
    pluralize: pluralizePkg,
    plural,
    singular,
    addPluralRule,
    addSingularRule,
    addIrregularRule,
    addUncountableRule,
    isPlural,
    isSingular,
};

export interface Strings {
    /**
     * Returns itself.
     */
    identity(value: string): string;

    /**
     * Is this string blank, null, or otherwise empty?
     */
    isBlank(value: string): boolean;

    /**
     * This is not a string? Are you not entertained?
     */
    isNotString(value: any): boolean;

    /**
     * Converts a string toCamelCase.
     */
    camelCase(value: string): string;

    /**
     * Converts a string to-kebab-case.
     */
    kebabCase(value: string): string;

    /**
     * Converts a string to_snake_case.
     */
    snakeCase(value: string): string;

    /**
     * Converts a string TO UPPER CASE.
     */
    upperCase(value: string): string;

    /**
     * Converts a string to lower case.
     */
    lowerCase(value: string): string;

    /**
     * Converts the first character Of Every Word To Upper.
     */
    upperFirst(value: string): string;

    /**
     * Converts the first character oF eVERY wORD tO lOWER.
     */
    lowerFirst(value: string): string;

    /**
     * Converts a string ToPascalCase.
     */
    pascalCase(value: string): string;

    /**
     * Pads a string with `chars` (spaces default) to `length` characters long, effectively centering the string.
     */
    pad(sourceString: string, length: number, chars?: string): string;

    /**
     * Strips whitespace from the start of a string.
     */
    trimStart(sourceString: string, chars?: string): string;

    /**
     * Strips whitespace from the end of a string.
     */
    trimEnd(sourceString: string, chars?: string): string;

    /**
     * Pluralize or singularize a word based on the passed in count.
     */
    pluralize(word: string, count?: number, inclusive?: boolean): string;

    /**
     * Pluralize a word based.
     */
    plural(word: string): string;

    /**
     * Singularize a word based.
     */
    singular(word: string): string;

    /**
     * Add a pluralization rule to the collection.
     */
    addPluralRule(rule: string | RegExp, replacement: string): void;

    /**
     * Add a singularization rule to the collection.
     */
    addSingularRule(rule: string | RegExp, replacement: string): void;

    /**
     * Add an irregular word definition.
     */
    addIrregularRule(single: string, plural: string): void;

    /**
     * Add an uncountable word rule.
     */
    addUncountableRule(word: string | RegExp): void;

    /**
     * Test if provided word is plural.
     */
    isPlural(word: string): boolean;

    /**
     * Test if provided word is singular.
     */
    isSingular(word: string): boolean;
}
