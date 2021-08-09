import { toolbox } from "@anolilab/cerebro-core";
import type { Toolbox as IToolbox } from "@anolilab/cerebro-core";
import { filesystem } from "@anolilab/cerebro-filesystem-extension";
import { strings } from "@anolilab/cerebro-strings-extension";
import ejs from "ejs";

const { replace, isBlank } = toolbox.utils;

const buildGenerate = (t: IToolbox) => {
    const { plugin, config, parameters } = t;

    /**
         * Generates a file from a template.
         *
         * @param options Generation options.
         * @return The generated string.
         */
    return async function generate(options: TemplateGenerateOptions): Promise<string> {
        const {
            template, target, props: properties = {}, directory,
        } = options;

        // add some goodies to the environment so templates can read them
        const data = {
            config,
            parameters,
            props: properties,
            filename: "",
            ...strings, // add our string tools to the filters available
        };

        // check the base directory for templates
        const baseDirectory = plugin && plugin.directory;
        let templateDirectory = directory || `${baseDirectory}/templates`;
        let pathToTemplate = `${templateDirectory}/${template}`;

        // check ./build/templates too, if that doesn't exist
        if (!filesystem.isFile(pathToTemplate)) {
            templateDirectory = directory || `${baseDirectory}/build/templates`;
            pathToTemplate = `${templateDirectory}/${template}`;
        }

        // bomb if the template doesn't exist
        if (!filesystem.isFile(pathToTemplate)) {
            throw new Error(`template not found ${pathToTemplate}`);
        }

        // add template path to support includes
        data.filename = pathToTemplate;

        // read the template
        const templateContent = filesystem.read(pathToTemplate);

        // render the template
        const content = ejs.render(templateContent, data);

        // save it to the file system
        if (!isBlank(target)) {
            // prep the destination directory
            const directiory = replace(/$(\/)*/g, "", target as string);
            const destination = filesystem.path(directiory);

            filesystem.write(destination, content);
        }

        // send back the rendered string
        return content;
    };
};

export default buildGenerate;

export interface TemplateGenerateOptions {
    /**
     * Path to the EJS template relative from the plugin's `template` directory.
     */
    template: string;
    /**
     * Path to create the file relative from the user's working directory.
     */
    target?: string;
    /**
     * Additional props to provide to the EJS template.
     */
    props?: { [name: string]: any };
    /**
     * An absolute path of where to find the templates (if not default).
     */
    directory?: string;
}
