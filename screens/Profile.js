import React from "react";
import { View, Text } from "react-native";
import MainLayout from "screens/Mainlayout";
import { COLORS, SIZES, dummyData, FONTS, icons } from "constants";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { Switch } from "react-native";
import { useState } from "react";

const SectionTitle = ({ title }) => {
  return (
    <View style={{ marginTop: SIZES.padding }}>
      <Text style={{ color: COLORS.lightGray3, ...FONTS.h4 }}>{title}</Text>
    </View>
  );
};

const Setting = ({ title, value, type, onPress }) => {
  if (type == "button") {
    return (
      <TouchableOpacity
        style={{ flexDirection: "row", height: 50, alignItems: "center" }}
        onPress={onPress}
      >
        <Text style={{ flex: 1, color: COLORS.white, ...FONTS.h3 }}>
          {title}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              marginRight: SIZES.radius,
              color: COLORS.lightGray3,
              ...FONTS.h3,
            }}
          >
            {value}
          </Text>

          <Image
            source={icons.rightArrow}
            style={{
              height: 15,
              width: 15,
              tintColor: COLORS.white,
            }}
          />
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <View style={{ flexDirection: "row", height: 50, alignItems: "center" }}>
        <Text style={{ flex: 1, color: COLORS.white, ...FONTS.h3 }}>
          {title}
        </Text>
        <Switch value={value} onValueChange={(val) => onPress(val)} />
      </View>
    );
  }
};
const Profile = () => {
  const [faceId, setFaceId] = useState(true);
  return (
    <MainLayout>
      <View
        style={{
          flex: 1,
          paddingHorizontal: SIZES.padding,
          backgroundColor: COLORS.black,
        }}
      >
        <ScrollView>
          <View style={{ flexDirection: "row", marginTop: SIZES.radius }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                {dummyData.profile.email}
              </Text>

              <Text style={{ color: COLORS.lightGray3, ...FONTS.body4 }}>
                {dummyData.profile.contact}
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={icons.verified}
                style={{ height: 25, width: 25 }}
              />
              <Text
                style={{
                  marginLeft: SIZES.base,
                  color: COLORS.lightGreen,
                  ...FONTS.body4,
                }}
              >
                Verified
              </Text>
            </View>
          </View>

          <SectionTitle title={"APP"} />

          <Setting
            title={"Launch Screen"}
            value="Home"
            type="button"
            onPress={() => {}}
          />

          <Setting
            title={"Appearance"}
            value="Dark"
            type="button"
            onPress={() => {}}
          />

          <SectionTitle title={"ACCOUNT"} />

          <Setting
            title={"Payment Currency"}
            value="INR"
            type="button"
            onPress={() => {}}
          />

          <Setting
            title={"Language"}
            value="English"
            type="button"
            onPress={() => {}}
          />

          <SectionTitle title={"SECURITY"} />

          <Setting
            title={"FaceId"}
            value={faceId}
            type="switch"
            onPress={(val) => {
              setFaceId(val);
            }}
          />

          <Setting
            title={"Password Settings"}
            value=""
            type="button"
            onPress={() => {}}
          />

          <Setting
            title={"Change Password"}
            value=""
            type="button"
            onPress={() => {}}
          />

          <Setting
            title={"2-Factor Authentication"}
            value=""
            type="button"
            onPress={() => {}}
          />
        </ScrollView>
      </View>
    </MainLayout>
  );
};

export default Profile;
