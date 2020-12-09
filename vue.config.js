module.exports = {
    runtimeCompiler: true,
    css: {
        extract: false,
    },
    // 修改 主入口 为 examples 目录
    pages: {
        index: {
            entry: 'examples/main.js',
        },
    },
    // 扩展 webbpack 配置，使 import 可以解构
    configureWebpack: {
        output: {
            library: 'Comments',
            libraryExport: 'default',
        },
    },
};
