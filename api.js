import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "@env";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 처리
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest.__isRetryRequest
    ) {
      console.log("Access Token 만료, Refresh 시도");
      originalRequest.__isRetryRequest = true;

      try {
        const refreshRes = await fetch(`${API_BASE_URL}/users/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // credentials: "include", // 필요 시 켜세요
        });

        const data = await refreshRes.json();
        if (refreshRes.ok) {
          await SecureStore.setItemAsync("accessToken", data.access_token);
          await SecureStore.setItemAsync("refreshToken", data.refresh_token);
          console.log("Refresh 성공, 재시도");

          // Authorization 헤더 갱신
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return api(originalRequest);
        } else {
          console.log("Refresh 실패, 로그아웃 필요");
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
        }
      } catch (err) {
        console.error("Refresh 과정에서 오류", err);
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
