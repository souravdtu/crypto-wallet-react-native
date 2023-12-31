import React from "react";
import { View, Text, Image } from "react-native";

import { SIZES, COLORS, FONTS, icons } from "../constants";

const BalanceInfo = ({ title, displayAmount, changePct, containerStyle }) => {
  return (
    <View style={{ ...containerStyle }}>
      <Text style={{ color: COLORS.lightGray3, ...FONTS.h3 }}>{title}</Text>

      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        <Text style={{ color: COLORS.lightGray3, ...FONTS.h3 }}>
          {"\u20B9"}
        </Text>
        <Text style={{ color: COLORS.white, ...FONTS.h2 }}>
          {displayAmount?.toLocaleString("en-IN")}
        </Text>
        {/* <Text style={{ color: COLORS.lightGray3, ...FONTS.h3 }}> INR</Text> */}
      </View>
      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        {changePct != 0 && (
          <Image
            source={icons.upArrow}
            style={{
              width: 10,
              height: 10,
              alignSelf: "center",
              tintColor: changePct > 0 ? COLORS.lightGreen : COLORS.red,
              transform:
                changePct > 0 ? [{ rotate: "45deg" }] : [{ rotate: "125deg" }],
            }}
          />
        )}
        <Text
          style={{
            marginLeft: SIZES.base,
            alignSelf: "flex-end",
            color:
              changePct == 0
                ? COLORS.lightGray3
                : changePct > 0
                ? COLORS.lightGreen
                : COLORS.red,
            ...FONTS.h4,
          }}
        >
          {changePct.toFixed(2)}%
        </Text>
        <Text
          style={{
            marginLeft: SIZES.radius,
            alignSelf: "flex-end",
            color: COLORS.lightGray3,
            ...FONTS.h5,
          }}
        >
          7D change
        </Text>
      </View>
    </View>
  );
};

export default BalanceInfo;
