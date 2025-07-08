import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Button,
} from "react-native";
import { themeColors, categories, groups } from "../Colors";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/LoginScreenStyles";

const LoginScreen = ({ onLogin }) => {
  const navigation = useNavigation();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const { setUserInfo } = useContext(AuthContext);
  const refreshAccessToken = async () => {
    try {
      const response = await fetch("http://ser.iptime.org:8000/users/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ 쿠키 전송 필수
      });

      const result = await response.json();

      if (response.ok && result.access_token && result.refresh_token) {
        await AsyncStorage.setItem("accessToken", result.access);
        await AsyncStorage.setItem("refreshToken", result.refresh_token);
        console.log("✅ Access Token 갱신 성공");
        return result.access;
      } else {
        throw new Error("토큰 갱신 실패");
      }
    } catch (error) {
      console.error("토큰 갱신 중 오류:", error);
      throw error;
    }
  };

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
      try {
        // 토큰 만료 → 새로 받기
        const newToken = await refreshAccessToken();

        // 재요청
        response = await fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${newToken}`,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        return;
      }
    }

    return response;
  };

  //이게 로그인
  const login = async () => {
    const formBody = `username=${encodeURIComponent(
      id
    )}&password=${encodeURIComponent(pw)}`;

    try {
      const response = await fetch("http://ser.iptime.org:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: formBody,
      });

      const result = await response.json();
      console.log("✅ 로그인 응답 result:", result);
      if (response.ok && result.access_token) {
        // 토큰 저장
        await AsyncStorage.setItem("accessToken", result.access_token);

        const protectedRes = await authFetch(
          "http://ser.iptime.org:8000/users/info"
        );
        const protectedData = await protectedRes.json();
        console.log("🔒 보호된 유저 데이터:", protectedData);

        setUserInfo(protectedData); // ✅ 전역 상태로 저장
        onLogin(); // 로그인 성공 후 이동
      } else {
        console.log("❌ 로그인 실패: 응답 비정상 또는 토큰 없음");
        r;
        alert("로그인 실패: " + JSON.stringify(result));
      }
    } catch (err) {
      console.error("로그인 요청 실패:", err);
      alert("서버 연결 실패");
    }
  };

  return (
    <View style={styles.fullcontainer}>
      <View style={styles.container_logo}>
        <Image source={require("../assets/Tab/Logo.png")} style={styles.logo} />
        <Text style={styles.logo_name}>Amadda</Text>
      </View>

      <View style={styles.container_login1}>
        <Image
          source={require("../assets/images/personIcon.png")}
          style={styles.Login_idpw} //아직 Login_id 스타일 없음.
        />
        <TextInput
          placeholder={"ID"}
          style={styles.input}
          value={id}
          onChangeText={setId}
        />
      </View>

      <View style={styles.container_login1}>
        <Image
          source={require("../assets/images/Lock.png")}
          style={styles.Login_idpw} //아직 Login_pw 스타일 없음.
        />
        <TextInput
          placeholder={"PW"}
          style={styles.input}
          // secureTextEntry
          value={pw}
          onChangeText={setPw}
        />
      </View>

      <View style={styles.container_login2}>
        <TouchableOpacity style={styles.Button} onPress={login}>
          <Text style={styles.ButtonText}>로그인</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container_fpw_join}>
        <TouchableOpacity onPress={() => navigation.navigate("FindPw")}>
          <Text style={styles.fpw}>비밀번호를 잊으셨나요?</Text>
        </TouchableOpacity>

        <Text></Text>

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.join}>회원이 아니신가요?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
