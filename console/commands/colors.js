export default {
    name: "main:colors",
    description: "Output colors",
    dashed: true,
    execute: (toolbox) => {
        const { logger, meta } = toolbox;

        logger.info(meta.version());
    },
};
