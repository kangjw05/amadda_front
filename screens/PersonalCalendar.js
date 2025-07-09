import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView,
} from "react-native";
import { themeColors, categories, groups } from "../Colors";

import styles from "../styles/PersonalCalendarStyles";
import Header from "../components/header";
import Calendar from "../components/calendar";

const PersonalCalendar = () => {
  const todos = {
    "2025-06-27": [
      { uuid: "test", name: "testD", category: "testC-1", isActive: false },
    ],
    "2025-07-01": [
      { uuid: "test", name: "testD", category: "testC-2", isActive: false },
      { uuid: "test", name: "testD", category: "testC-1", isActive: false },
      { uuid: "test", name: "testD", category: "testC-3", isActive: false },
    ],
    "2025-07-02": [
      { uuid: "test", name: "testD", category: "testC-4", isActive: false },
    ],
    "2025-07-05": [
      { uuid: "test", name: "testD", category: "testC-1", isActive: false },
      { uuid: "test", name: "testD", category: "testC-1", isActive: false },
    ],
    "2025-07-07": [
      {
        uuid: "test",
        name: "데과입 HW6",
        category: "과제-1",
        isActive: false,
      },
      {
        uuid: "test",
        name: "함함이야 회의",
        category: "언톡-5",
        isActive: false,
      },
      {
        uuid: "test",
        name: "대책은없지만무작정긴플랜이름과연?",
        category: "testC-2",
        isActive: false,
      },
      { uuid: "test", name: "testD", category: "testC-3", isActive: false },
    ],
    "2025-07-10": [
      { uuid: "test", name: "testD", category: "testC-3", isActive: false },
    ],
    "2025-07-15": [
      { uuid: "test", name: "testD", category: "testC-1", isActive: false },
    ],
    "2025-07-24": [
      { uuid: "test", name: "testD", category: "testC-6", isActive: false },
      { uuid: "test", name: "testD", category: "testC-7", isActive: false },
    ],
    "2025-07-30": [
      { uuid: "test", name: "testD", category: "testC-8", isActive: false },
    ],
    "2025-08-13": [
      { uuid: "test", name: "testD", category: "testC-2", isActive: false },
    ],
  };

  return (
    <View style={styles.container}>
      <Header />
      <Calendar todoData={todos} />
    </View>
  );
};

export default PersonalCalendar;
