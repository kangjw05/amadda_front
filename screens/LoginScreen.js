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
        <TextInput placeholder={"ID"} style={styles.input} />
      </View>

      <View style={styles.container_login1}>
        <Image
          source={require("../assets/Tab/Login_PW.png")}
          style={styles.Login_idpw} //아직 Login_pw 스타일 없음.
        />
        <TextInput placeholder={"PW"} style={styles.input} />
      </View>

      <View style={styles.container_login2}>
        <TouchableOpacity
          style={styles.Button}
          onPress={() => {
            console.log("로그인");
            onLogin();
          }}
        >
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
