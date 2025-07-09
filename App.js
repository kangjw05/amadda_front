import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const authFetch = async (url, options = {}) => {
    let token = await AsyncStorage.getItem("accessToken");

    let response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      const refreshResponse = await fetch(
        `${API_BASE_URL}/users/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const refreshResult = await refreshResponse.json();

      if (!refreshResponse.ok) throw new Error("토큰 갱신 실패");

      await AsyncStorage.setItem("accessToken", refreshResult.access);
      await AsyncStorage.setItem("refreshToken", refreshResult.refresh_token);

      response = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${refreshResult.access}`,
          "Content-Type": "application/json",
        },
      });
    }

    return response;
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");

      if (accessToken) {
        try {
          const res = await authFetch(`${API_BASE_URL}/users/info`);
          if (res.ok) {
            console.log("유저정보 불러오기 성공");
            setIsLoggedIn(true);
          } else {
            console.log("유저정보 불러오기 실패. 로그아웃 상태로 유지");
            setIsLoggedIn(false);
          }
        } catch (e) {
          console.error("유저정보 불러오기 실패:", e);
          setIsLoggedIn(false);
        }
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
                <Stack.Screen name="LoginScreen" options={{ headerShown: false }}>
                  {() => (
                    <LoginScreen onLogin={() => { setIsLoggedIn(true); }}/>
                  )}
                </Stack.Screen>
                <Stack.Screen name="FindPw" component={FindPwScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }}/>
              </>
            ) : (
              <>
                <Stack.Screen name="Main" options={{ headerShown: false }}>
                  {() => (
                    <MainTab setIsLoggedIn={setIsLoggedIn}/>
                  )}
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
