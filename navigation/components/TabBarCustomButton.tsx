import React from "react";
import { TouchableOpacity } from "react-native";

export const TabBarCustomButton = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};
