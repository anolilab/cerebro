module.exports = {
    presets: [
        [
            "@anolilab/babel-preset",
            {
                targets: {
                    node: 12,
                },
                typescript: true,
                looseClasses: true,
                looseComputedProperties: true,
                looseParameters: true,
                looseTemplateLiterals: true,

                runtimeVersion: "7.14.8",
            },
        ],
    ],
};
