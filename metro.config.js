const {getDefaultConfig} = require('expo/metro-config');
const {withNativeWind} = require('nativewind/metro');
const { mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

const merged = mergeConfig(defaultConfig, config);


module.exports = withNativeWind(merged, {input: './global.css'});
