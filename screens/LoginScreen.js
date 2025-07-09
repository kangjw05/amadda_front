import React, { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/LoginScreenStyles";
import { API_BASE_URL } from "@env";
import api from "../api"; // axios 인스턴스 사용

const LoginScreen = ({ onLogin }) => {
  const navigation = useNavigation();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const { setUserInfo } = useContext(AuthContext);

  const login = async () => {
    const formBody = `username=${encodeURIComponent(id)}&password=${encodeURIComponent(pw)}`;

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: formBody,
      });

      const result = await response.json();
      console.log("로그인 응답 result:", result);

      if (response.ok && result.access_token && result.refresh_token) {
        // 토큰 저장
        await SecureStore.setItemAsync("accessToken", result.access_token);
        await SecureStore.setItemAsync("refreshToken", result.refresh_token);

        // 사용자 정보 가져오기 (api.js에 자동 토큰 넣음 & 재발급)
        const protectedRes = await api.get("/users/info");
        const protectedData = protectedRes.data;

        console.log("보호된 유저 데이터:", protectedData);
        setUserInfo(protectedData); // 전역 상태 저장
        onLogin(); // 로그인 성공 후 이동
      } else {
        console.log("로그인 실패: 응답 비정상 또는 토큰 없음");
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
          style={styles.Login_idpw}
        />
        <TextInput
          placeholder="ID"
          style={styles.input}
          value={id}
          onChangeText={setId}
        />
      </View>

      <View style={styles.container_login1}>
        <Image
          source={require("../assets/images/Lock.png")}
          style={styles.Login_idpw}
        />
        <TextInput
          placeholder="PW"
          style={styles.input}
          secureTextEntry
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
        <Text />
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.join}>회원이 아니신가요?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
