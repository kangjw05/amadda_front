import React, { createContext, useState, useEffect } from "react";
import api from "../api"; // axios 인스턴스
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (refreshToken) {
        try {
          const res = await api.post("/users/refresh_token", {}, { withCredentials: true });
          const newAccessToken = res.data.access_token;
          await SecureStore.setItemAsync("accessToken", newAccessToken);

          // 유저 정보도 복구
          const infoRes = await api.get("/users/info");
          setUserInfo(infoRes.data);

          setIsLoggedIn(true);
          console.log("앱 시작 시 토큰 갱신 및 유저정보 복구 성공");
        } catch (err) {
          console.error("토큰 갱신 실패:", err);
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } else {
        console.log("refresh_token 없음");
        setIsLoggedIn(false);
      }
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
