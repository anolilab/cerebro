interface Choice {
    title: string;
    value: string;
    disable?: boolean;
}

interface Options {
    onSubmit?: (prompt: PromptObject, answer: any, answers: any[]) => void;
    onCancel?: (prompt: PromptObject, answers: any) => void;
}

interface PromptObject<T extends string = string> {
    type: ValueOrFunction<PromptType> | Falsy;
    name: ValueOrFunction<T>;
    message?: ValueOrFunction<string>;
    initial?: string | number | boolean | Date;
    style?: string;
    format?: PreviousCaller<T, void>;
    validate?: PreviousCaller<T, void>;
    onState?: PreviousCaller<T, void>;
    min?: number;
    max?: number;
    float?: boolean;
    round?: number;
    increment?: number;
    seperator?: string;
    active?: string;
    inactive?: string;
    choices?: Choice[];
    hint?: string;
    suggest?: (previous: any, values: any, prompt: PromptObject) => void;
    limit?: number;
    mask?: string;
}

type Answers<T extends string> = { [id in T]: any };

type PreviousCaller<T extends string, R = T> = (previous: any, values: Answers<T>, prompt: PromptObject) => R;

type Falsy = false | null | undefined;

type PromptType =
    | "text"
    | "password"
    | "invisible"
    | "number"
    | "confirm"
    | "list"
    | "toggle"
    | "select"
    | "multiselect"
    | "autocomplete"
    | "date";

type ValueOrFunction<T extends string> = T | PreviousCaller<T>;

export type Questions<T extends string = string> = PromptObject<T>;
export type Prompts = <T extends string = string>(
    questions: Questions<T> | Array<Questions<T>>,
    options?: Options,
) => Promise<Answers<T>>;
