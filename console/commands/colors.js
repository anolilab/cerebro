export default {
    name: "main:colors",
    description: "Output colors",
    dashed: true,
    execute: async (toolbox) => {
        const { logger, meta, prompts } = toolbox;

        logger.info(meta.version());

        const response = await prompts({
            type: 'number',
            name: 'value',
            message: 'How old are you?',
            validate: value => value < 18 ? `Nightclub is 18+ only` : true
        });

        logger.log(response);
    },
};
