module.exports = {
  presets: [
    ['babel-preset-expo', {jsxImportSource: 'nativewind'}],
    'nativewind/babel',
  ],
  plugins: [
    [
      '@babel/plugin-transform-private-methods',
      {
        loose: true,
      },
    ],
    'module:react-native-dotenv',
    [
      '@babel/plugin-syntax-optional-chaining-assign',
      {
        version: '2023-07',
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
