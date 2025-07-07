import "react-native-gesture-handler";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./screens/LoginScreen";
import SignUp from "./screens/SignUpScreen";
import MainTab from "./navigation/MainTab";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import GroupScreen from "./screens/GroupScreen";


const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{ animationEnabled: false, headerShown: false }}
      >
        {!isLoggedIn ? (
          <>
          <Stack.Screen name="LoginScreen">
            {() => <LoginScreen onLogin={() => setIsLoggedIn(true)} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp" component={SignUp} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTab} />
            <Stack.Screen name="GroupScreen" component={GroupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
