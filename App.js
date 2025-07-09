import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";

import LoginScreen from "./screens/LoginScreen";
import FindPwScreen from "./screens/FindPwScreen";
import SignUpScreen from "./screens/SignUpScreen";
import MainTab from "./navigation/MainTab";
import ChangePwScreen from "./screens/changePwScreen";
import { AuthProvider } from "./context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { API_BASE_URL } from "@env";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (refreshToken) {
        try {
          const res = await fetch(`${API_BASE_URL}/users/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok) {
            console.log("앱 시작 시 토큰 갱신 성공");
            await SecureStore.setItemAsync("accessToken", data.access_token);
            await SecureStore.setItemAsync("refreshToken", data.refresh_token);
            setIsLoggedIn(true);
          } else {
            console.log("refresh_token 만료");
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("토큰 갱신 실패", error);
          setIsLoggedIn(false);
        }
      } else {
        console.log("⛔ refresh_token 없음");
        setIsLoggedIn(false);
      }
      setLoading(false);
    };
    checkLoginStatus();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ animation: "none" }}>
            {!isLoggedIn ? (
              <>
                <Stack.Screen
                  name="LoginScreen"
                  options={{ headerShown: false }}
                >
                  {() => (
                    <LoginScreen
                      onLogin={() => {
                        setIsLoggedIn(true);
                      }}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen
                  name="FindPw"
                  component={FindPwScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="SignUp"
                  component={SignUpScreen}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Main"
                  options={{ headerShown: false }}
                >
                  {() => <MainTab setIsLoggedIn={setIsLoggedIn} />}
                </Stack.Screen>
                <Stack.Screen
                  name="ChangePw"
                  component={ChangePwScreen}
                  options={{
                    title: "비밀번호 변경",
                  }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
