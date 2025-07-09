import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

import { API_BASE_URL } from "@env";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 userInfo 복구
  useEffect(() => {
    const restoreUserInfo = async () => {
      const token = await SecureStore.getItemAsync("accessToken");
      if (token) {
        try {
          let res = await fetch(`${API_BASE_URL}/users/info`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (res.status === 401) {
            // 토큰 만료 시 refresh
            const refreshRes = await fetch(
              `${API_BASE_URL}/users/refresh`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              }
            );
            const refreshData = await refreshRes.json();
            if (refreshRes.ok) {
              await SecureStore.setItemAsync("accessToken", refreshData.access_token);
              res = await fetch(`${API_BASE_URL}/users/info`, {
                headers: {
                  Authorization: `Bearer ${refreshData.access_token}`,
                  "Content-Type": "application/json",
                },
              });
            }
          }
          if (res.ok) {
            const data = await res.json();
            setUserInfo(data);
            console.log("앱 시작 시 userInfo 복구 성공:", data);
          } else {
            console.log("앱 시작 시 userInfo 불러오기 실패");
          }
        } catch (e) {
          console.error("유저정보 복구 실패:", e);
        }
      }
      setLoading(false);
    };

    restoreUserInfo();
  }, []);

  // 로딩 중이면 null
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
