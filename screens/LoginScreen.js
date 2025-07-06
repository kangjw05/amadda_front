import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
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

import styles from "../styles/LoginScreenStyles";

const LoginScreen = ({ onLogin }) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const login = async () => {
    const formBody = `username=${encodeURIComponent(
      id
    )}&password=${encodeURIComponent(pw)}`;

    try {
      const response = await fetch("http://121.145.169.65:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody,
      });

      const result = await response.json();
      console.log("로그인 결과:", result);

      if (response.ok) {
        onLogin(); // 성공 처리
      } else {
        alert("로그인 실패: " + result.message);
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
          source={require("../assets/Tab/Login_ID.png")}
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
          source={require("../assets/Tab/Login_PW.png")}
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
        <TouchableOpacity onPress={() => console.log("비밀번호 찾기")}>
          <Text style={styles.fpw}>비밀번호를 잊으셨나요?</Text>
        </TouchableOpacity>

        <Text></Text>

        <TouchableOpacity onPress={() => console.log("회원가입")}>
          <Text style={styles.join}>회원이 아니신가요?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
