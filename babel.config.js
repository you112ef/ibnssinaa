module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
      alias: {
        '@': './src',
        '@components': './src/components',
        '@screens': './src/screens',
        '@utils': './src/utils',
        '@styles': './src/styles',
        '@context': './src/context'
      }
    }],
    'react-native-reanimated/plugin',
  ],
  env: {
    production: {
      plugins: [
        ['module-resolver', {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@utils': './src/utils',
            '@styles': './src/styles',
            '@context': './src/context'
          }
        }],
        'react-native-reanimated/plugin',
      ]
    }
  }
};