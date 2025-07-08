import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./screens/LoginScreen";
import FindPw from "./screens/FindPwScreen";
import SignUp from "./screens/SignUpScreen";
import MainTab from "./navigation/MainTab";
import { AuthProvider } from "./context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import GroupScreen from "./screens/GroupScreen";
import FindPwScreen from "./screens/FindPwScreen";
import SignUpScreen from "./screens/SignUpScreen";


const Stack = createNativeStackNavigator();

const AuthStack = ({ onLogin }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LoginScreen">
      {() => <LoginScreen onLogin={onLogin} />}
    </Stack.Screen>
    <Stack.Screen name="FindPw" component={FindPwScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");

      if (accessToken) {
        setIsLoggedIn(true); // 저장된 토큰 있으면 로그인 상태로
      }

      setLoading(false); // 로딩 완료
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return null; // 로딩 중일 때는 아무 것도 안 보여줌 (스플래시 넣어도 됨)
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ 
              animation: "none", 
              headerShown: false }}
          >
            {!isLoggedIn ? (
              <>
              <Stack.Screen name="LoginScreen">
                {() => <LoginScreen onLogin={() => setIsLoggedIn(true)} />}
              </Stack.Screen>
              <Stack.Screen name="FindPw" component={FindPwScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              </>
            ) : (
              <Stack.Screen name="Main">
                {() => <MainTab setIsLoggedIn={setIsLoggedIn} />}
              </Stack.Screen>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>

    </GestureHandlerRootView>
  );
};

export default App;
