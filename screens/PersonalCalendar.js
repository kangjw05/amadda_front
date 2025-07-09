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

import * as SecureStore from "expo-secure-store";
import api from "../api";

const PersonalCalendar = () => {
  const todos_test = {
    "2025-06-27": [
      {
        uuid: "test",
        name: "testD",
        category: "testC-1",
        isActive: false,
        isGroup: false,
      },
    ],
    "2025-07-01": [
      {
        uuid: "test",
        name: "testD",
        category: "testC-2",
        isActive: false,
        isGroup: false,
      },
      {
        uuid: "test",
        name: "testD",
        category: "testC-1",
        isActive: false,
        isGroup: false,
      },
      {
        uuid: "test",
        name: "testD",
        category: "testC-3",
        isActive: false,
        isGroup: false,
      },
    ],
    "2025-07-02": [
      {
        uuid: "test",
        name: "testD",
        category: "testC-4",
        isActive: false,
        isGroup: false,
      },
    ],
    "2025-07-05": [
      {
        uuid: "test",
        name: "testD",
        category: "testC-1",
        isActive: false,
        isGroup: false,
      },
      {
        uuid: "test",
        name: "testD",
        category: "testC-1",
        isActive: false,
        isGroup: false,
      },
    ],
    "2025-07-07": [
      {
        uuid: "test",
        name: "데과입 HW6",
        category: "과제-1",
        isActive: false,
        isGroup: true,
      },
      {
        uuid: "test",
        name: "함함이야 회의",
        category: "언톡-5",
        isActive: false,
        isGroup: true,
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

  const [todos, setTodos] = useState({});

  useEffect(() => {
    const getUserPlan = async () => {
      try {
        const response = await api.get("/plan/plans");
        const rawDatas = response.data;

        const tempTodos = {};

        rawDatas.forEach((todo) => {
          const dateKey = todo.date.split("T")[0];

          if (!tempTodos[dateKey]) {
            tempTodos[dateKey] = [];
          }

          tempTodos[dateKey].push({
            uuid: todo.uuid,
            name: todo.name,
            category: todo.category,
            isActive: todo.is_active === 1,
            isGroup: false,
          });
        });

        setTodos(tempTodos);

        console.log("퍼스널", tempTodos); // 테스트
      } catch (error) {
        console.log("plan update 실패", error);
      }
    };

    getUserPlan();
  }, []);

  const test_post = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      const response = await api.post("/plan/push_plan", {
        name: "testD",
        create_at: token,
        date: "2025-07-10",
        category: "testC-3",
      });
    } catch (error) {
      console.log(error);
    }
  };

  test_post();

  // const get_user_group_plan = async () => {
  //   try {
  //     const response = await api.get("/plan/plans");
  //     console.log(response.data);
  //   } catch (error) {
  //     console.log("plan get 실패", error);
  //   }
  // };

  return (
    <View style={styles.container}>
      <Header />
      <Calendar todoData={todos_test} />
    </View>
  );
};

export default PersonalCalendar;
