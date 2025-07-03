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
} from "react-native";
import { themeColors, categories, groups } from "../Colors";

import styles from "../styles/SettingScreenStyles";
import Header from "../components/header";

const SettingScreen = () => {
  return (
    <View style={styles.fullcontainer}>
      <View>
        <Header />
      </View>
      <View style={styles.setting}>
        <Text style={styles.font}>설정</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.information}>
        <View style={styles.leftpannel}>
          <Image
            source={require("../assets/Tab/setting_user.png")}
            style={styles.setuser}
          />
        </View>

        <View style={styles.rightpannel}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>계정</Text>
            <TextInput placeholder={"마정우"} style={styles.input} />
            <TouchableOpacity onPress={() => console.log("아이콘 클릭됨!")}>
              <Image
                source={require("../assets/Tab/set_pencil.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>이메일</Text>
            <TextInput placeholder={"이메일"} style={styles.input} />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput placeholder={"비밀번호"} style={styles.input} />
            <TouchableOpacity onPress={() => console.log("아이콘 클릭됨!")}>
              <Image
                source={require("../assets/Tab/set_pencil.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.separator} />
    </View>
  );
};

export default SettingScreen;
