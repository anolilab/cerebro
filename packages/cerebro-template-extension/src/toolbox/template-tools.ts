import { Toolbox } from "@anolilab/cerebro-core/domain/toolbox";
import { replace } from "@anolilab/cerebro-core/toolbox/utils";
import { filesystem } from "@anolilab/cerebro-filesystem-extension";
import { strings } from "@anolilab/cerebro-strings-extension";
import ejs from "ejs";

import { TemplateGenerateOptions as ITemplateGenerateOptions } from "../types";

const buildGenerate = (toolbox: Toolbox) => {
    const { plugin, config, parameters } = toolbox;

    /**
         * Generates a file from a template.
         *
         * @param options Generation options.
         * @return The generated string.
         */
    return async function generate(options: ITemplateGenerateOptions): Promise<string> {
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
        if (!strings.isBlank(target)) {
            // prep the destination directory
            const directiory = replace(/$(\/)*/g, "", target);
            const destination = filesystem.path(directiory);

            filesystem.write(destination, content);
        }

        // send back the rendered string
        return content;
    };
};

export default buildGenerate;
