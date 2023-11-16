import React from "react";
import { StatusBar } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./stores/rootReducer";
import Tabs from "./navigation/Tabs";

const Stack = createStackNavigator();
const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {
  console.log(StatusBar);
  return (
    <Provider store={store}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTitle: "Crypto Wallet",
            headerTitleStyle: {
              color: "white",
            },
          }}
          initialRouteName={"BottomDrawer"}
        >
          <Stack.Screen name="BottomDrawer" component={Tabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
