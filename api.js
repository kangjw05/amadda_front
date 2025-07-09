import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "@env";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 필요 시
});

// 🔹 요청 인터셉터
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 응답 인터셉터 (자동 재발급)
api.interceptors.response.use(
  (response) => response, // 정상 응답은 그대로
  async (error) => {
    const originalRequest = error.config;

    // AccessToken 만료라고 판단하는 조건 (예: 401 Unauthorized)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // refresh_token API 호출해서 새 Access Token 발급
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/users/refresh_token`,
          {},
          {
            withCredentials: true, // 서버에서 쿠키에 저장된 refresh_token 사용
          }
        );
        console.log("새 Access Token 값:", refreshResponse.data.access_token);
        console.log("=== refreshResponse.data ===", refreshResponse.data);
        console.log("=== typeof ===", typeof refreshResponse.data);
        const newAccessToken = refreshResponse.data.access_token;

        // 새 Access Token 저장
        await SecureStore.setItemAsync("accessToken", newAccessToken);

        // 새 토큰으로 Authorization 헤더 갱신 후 재요청
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // RefreshToken도 만료되었으면 로그아웃 처리
        console.log("Refresh Token 만료:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
