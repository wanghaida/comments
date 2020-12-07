module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
    ],
    parserOptions: {
        parser: 'babel-eslint',
    },
    rules: {
        // 强制 error
        indent: ['error', 4, { SwitchCase: 1 }],
        'vue/html-indent': ['error', 4],
        'vue/html-quotes': ['error', 'double'],
        'no-empty': ['error', { allowEmptyCatch: true }],
        // 推荐 warn
        'max-len': ['warn', { code: 200 }],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        // 关闭 off
        'no-param-reassign': 'off',
    },
};
