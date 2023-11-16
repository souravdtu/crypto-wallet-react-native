module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    "react-native-reanimated/plugin",
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          // screen: "./screen",
          // Add more aliases for your directories as needed
        },
      },
    ],
  ],
};
