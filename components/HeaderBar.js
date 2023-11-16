import React from "react";
import { View, Text } from "react-native";
import { COLORS, SIZES, FONTS } from "../constants";

export default HeaderBar = ({ title }) => {
  return (
    <View
      style={{
        height: 100,
        paddingHorizontal: SIZES.radius,
        justifyContent: "center",
      }}
    >
      <Text style={{ color: COLORS.white, ...FONTS.largeTitle }}>{title}</Text>
    </View>
  );
};
