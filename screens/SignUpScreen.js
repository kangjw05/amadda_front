import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import styles from "../styles/SignUpScreenStyles";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  return (
    <ScrollView contentContainerStyle={styles.mainContainer}>
      {/* 로고 */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/Tab/Logo.png")}
          style={styles.logoImage}
        />
        <Text style={styles.logoText}>Amadda</Text>
      </View>

      {/* 입력 영역 */}
      <View style={styles.inputsWrapper}>
        {/* 이메일 */}
        <View style={styles.inputRow}>
          <Image
            source={require("../assets/images/personIcon.png")}
            style={styles.personIcon}
          />
          <ImageBackground
            source={require("../assets/images/emailInput.png")}
            style={styles.inputBackground}
            imageStyle={styles.inputBackgroundImage}
          >
            <TextInput 
            placeholder="이메일" 
            style={styles.textInput}
            value={email}
            onChangeText={setEmail} />
          </ImageBackground>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => console.log("메일 전송")}
          >
            <Text style={styles.actionButtonText}>메일 발송</Text>
          </TouchableOpacity>
        </View>

        {/* 인증 코드 */}
        <View style={styles.inputRow}>
          <Image
            source={require("../assets/images/checkPersonIcon.png")}
            style={styles.personIcon}
          />
          <ImageBackground
            source={require("../assets/images/codeInput.png")}
            style={styles.inputBackground}
            imageStyle={styles.inputBackgroundImage}
          >
            <TextInput 
            placeholder="인증 코드" 
            style={styles.textInput} 
            value={code}
            onChangeText={setCode}/>
          </ImageBackground>
          {codeVerified ? (
            <Image
              source={require("../assets/images/checkBoxIcon.png")}
              style={styles.inputIconRight}
            />
          ) : (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                  console.log("인증 코드 확인");
                  // 여기서 실제 인증 로직 수행 후 성공이면:
                  setCodeVerified(true);
              }}
              >
              <Text style={styles.actionButtonText}>확인</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 계정 이름 */}
        <View style={styles.inputRow}>
          <Image
            source={require("../assets/images/personIcon.png")}
            style={styles.personIcon}
          />
          <ImageBackground
            source={require("../assets/images/nameInput.png")}
            style={styles.inputBackground}
            imageStyle={styles.inputBackgroundImage}
          >
            <TextInput 
            placeholder="계정 이름" 
            style={styles.textInput} 
            value={username}
            onChangeText={setUsername}/>
          </ImageBackground>
        </View>

        {/* 비밀번호 */}
        <View style={styles.inputRow}>
          <Image
            source={require("../assets/images/Lock.png")}
            style={styles.lockIcon}
          />
          <ImageBackground
            source={require("../assets/images/PWInput.png")}
            style={styles.inputBackground}
            imageStyle={styles.inputBackgroundImage}
          >
            <TextInput
              placeholder="비밀번호"
              secureTextEntry
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
            />
          </ImageBackground>
        </View>

        {/* 비밀번호 확인 */}
        <View style={styles.inputRow}>
          <Image
            source={require("../assets/images/Lock.png")}
            style={styles.lockIcon}
          />
          <ImageBackground
            source={require("../assets/images/codeInput.png")}
            style={styles.inputBackground}
            imageStyle={styles.inputBackgroundImage}
          >
            <TextInput
              placeholder="비밀번호 확인"
              secureTextEntry
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </ImageBackground>
                <Image
                source={(confirmPassword !== "") &&
                    (password !== "") &&
                    (password === confirmPassword)
                    ? require("../assets/images/checkBoxIcon.png")
                    : require("../assets/images/checkBoxOutlineIcon.png")
                }
                style={styles.inputIconRight}
                />
        </View>
        <View style={styles.buttonPart}>
        {/* 회원가입 버튼 */}
        <TouchableOpacity
            style={styles.joinButton}
            onPress={() => console.log("회원가입")}
        >
            <Text style={styles.joinButtonText}>회원가입</Text>
        </TouchableOpacity>
        </View>
      </View>
      {/* 하단 로그인/비밀번호 */}
      <View style={styles.footerLinks}>
        <TouchableOpacity onPress={() => console.log("비밀번호 찾기")}>
          <Text style={styles.footerLinkText}>비밀번호를 잊으셨나요?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.footerLinkText}>로그인</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;
