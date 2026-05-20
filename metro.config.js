const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
const fs = require('fs');
const path = require('path');

// Resolve Windows junctions to canonical paths so Metro's internal realpath
// resolution and withNativeWind's input path comparison stay in sync.
const projectRoot = fs.realpathSync(__dirname);

const defaultConfig = getDefaultConfig(projectRoot);

const config = mergeConfig(defaultConfig, {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg', 'cjs'],
  },
});

module.exports = withNativeWind(config, {
  input: path.join(projectRoot, 'global.css'),
  // Always write processed CSS to disk instead of virtual modules.
  // Virtual module patching can silently fail on hot-reload, leaving styles empty.
  forceWriteFileSystem: true,
});
