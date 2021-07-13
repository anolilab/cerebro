import { Cli as ICli } from "./cli";

export interface Loader {
    name: string;

    run: (cli: ICli) => Promise<void>
}
