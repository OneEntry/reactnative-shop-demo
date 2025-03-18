module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
      },
    ],
  },
  ignorePatterns: ['metro.config.js', 'babel.config.js', 'tailwind.config.js'],
};
