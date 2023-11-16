import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { connect } from "react-redux";
import { setTradeModalVisibility } from "stores/tab/tabActions";
import { Home, Portfolio, Market, Profile } from "screens";
import { COLORS, icons } from "constants";
import TabIcon from "./components/TabIcon";
import { TabBarCustomButton } from "./components/TabBarCustomButton";

const Tab = createBottomTabNavigator();

const TabScreens = [
  { name: "Home", component: Home, icon: icons.home },
  { name: "Portfolio", component: Portfolio, icon: icons.briefcase },
  { name: "Trade", component: Home, icon: icons.trade },
  { name: "Market", component: Market, icon: icons.market },
  { name: "Profile", component: Profile, icon: icons.profile },
];

const Tabs = ({ setTradeModalVisibility, isTradeModalVisible }) => {
  const tradeTabButtonHandler = () => {
    setTradeModalVisibility(!isTradeModalVisible);
  };
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          height: 80,
          backgroundColor: COLORS.primary,
          borderTopColor: "transparent",
        },
      }}
    >
      {TabScreens.map((screen) => {
        if (screen.name == "Trade")
          return (
            <Tab.Screen
              name={`${screen.name}`}
              component={screen.component}
              options={{
                tabBarIcon: ({ focused }) => {
                  return (
                    <TabIcon
                      focused={focused}
                      icon={isTradeModalVisible ? icons.close : icons.trade}
                      iconStyle={
                        isTradeModalVisible
                          ? { width: 15, height: 15, tintColor: COLORS.white }
                          : {}
                      }
                      label="Trade"
                      isTrade
                      isTradeModalVisible={isTradeModalVisible}
                    />
                  );
                },
                tabBarButton: (prop) => {
                  return (
                    <TabBarCustomButton
                      {...prop}
                      onPress={tradeTabButtonHandler}
                    />
                  );
                },
              }}
            />
          );
        return (
          <Tab.Screen
            name={`${screen.name}`}
            component={screen.component}
            options={{
              tabBarIcon: ({ focused }) => {
                if (isTradeModalVisible) return null;
                return (
                  <TabIcon
                    focused={focused}
                    icon={screen.icon}
                    label={`${screen.name}`}
                  />
                );
              },
            }}
            listeners={{
              tabPress: (e) => {
                if (isTradeModalVisible) e.preventDefault();
              },
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

function mapStateToProps(state) {
  return {
    isTradeModalVisible: state.tabReducer.isTradeModalVisible,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setTradeModalVisibility: (isVisible) => {
      return dispatch(setTradeModalVisibility(isVisible));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
