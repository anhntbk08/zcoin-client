module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true
    },
    extends: 'plugin:vue/recommended',
    globals: {
        __static: true
    },
    rules: {
        'indent': ['warn', 4],
        'vue/html-indent': ['warn', 4],
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        'vue/no-v-html': 0,
        'vue/component-name-in-template-casing': 'kebab-case',
        'vue/no-unused-components': 1,
        'vue/html-self-closing': 0,
        // The default behaviour is fine in some cases (like an append-only array).
        'vue/require-v-for-key': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    }
}
