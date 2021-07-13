import { Command as ICommand, Toolbox as IToolbox } from "../types";

/**
 * A command is user-callable function that runs stuff.
 */
class Command implements ICommand<IToolbox> {
    public name;

    public description;

    public file;

    public execute;

    public hidden;

    public commandPath;

    public alias;

    public usage;

    public args;

    constructor(properties?: ICommand) {
        this.hidden = false;
        this.alias = [];
        this.args = [];

        if (properties) {
            Object.assign(this, properties);
        }
    }

    /**
     * Returns normalized list of aliases.
     *
     * @returns list of aliases.
     */
    get aliases(): string[] {
        if (!this.alias) {
            return [];
        }

        return Array.isArray(this.alias) ? this.alias : [this.alias];
    }

    /**
     * Checks if the addCommand has any aliases at all.
     *
     * @returns whether the addCommand has any aliases
     */
    public hasAlias(): boolean {
        return this.aliases.length > 0;
    }

    /**
     * Checks if a given alias matches with this addCommand's aliases, including name.
     * Can take a list of aliases too and check them all.
     *
     * @param alias
     * @returns whether the alias[es] matches
     */
    public matchesAlias(alias: string | string[]): boolean {
        const aliases = Array.isArray(alias) ? alias : [alias];

        return Boolean(aliases.some((a) => this.name === a || this.aliases.includes(a)));
    }
}

export default Command;
