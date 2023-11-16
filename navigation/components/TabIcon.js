import React from "react";
import { Image, Text } from "react-native";
import { View } from "react-native";
import { COLORS, FONTS } from "../../constants";

const TabIcon = ({
  focused,
  icon,
  iconStyle,
  label,
  isTrade,
  isTradeModalVisible,
}) => {
  if (isTrade)
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: COLORS.black,
        }}
      >
        <Image
          source={icon}
          style={{
            width: 25,
            height: 25,
            tintColor: focused ? COLORS.white : COLORS.secondary,
            ...iconStyle,
          }}
        ></Image>
        <Text
          style={[
            { color: COLORS.white },
            !isTradeModalVisible && { color: COLORS.secondary },
          ]}
        >
          {label}
        </Text>
      </View>
    );
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{
          width: 25,
          height: 25,
          tintColor: focused ? COLORS.white : COLORS.secondary,
          ...iconStyle,
        }}
      />
      <Text
        style={{
          color: focused ? COLORS.white : COLORS.secondary,
          fontSize: 14,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

export default TabIcon;
