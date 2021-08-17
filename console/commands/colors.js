module.exports = {
    name: "main:colors",
    description: "Output colors",
    dashed: true,
    execute: (toolbox) => {
        console.log(toolbox)
        const { logger, meta } = toolbox;

        logger.info(meta.version());
    },
};
