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
import { jwtDecode } from "jwt-decode";

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

  const userplan_test = [
    {
      // 1
      category: "testcase-1",
      date: "2025-07-10T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      // 2
      category: "testcase-7",
      date: "2025-07-10T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      // 3
      category: "testcase-1",
      date: "2025-07-10T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      // 4
      category: "testcase-2",
      date: "2025-07-15T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      // 5
      category: "testcase-3",
      date: "2025-07-19T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      // 5
      category: "testcase-3",
      date: "2025-07-19T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      // 5
      category: "testcase-5",
      date: "2025-07-21T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      // 5
      category: "testcase-5",
      date: "2025-07-21T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
  ];

  const group1_test = [
    {
      category: "gcase-5",
      date: "2025-07-06T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      category: "gcase-5",
      date: "2025-07-06T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      category: "gcase-5",
      date: "2025-07-10T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      category: "gcase-5",
      date: "2025-07-13T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      category: "gcase-5",
      date: "2025-07-15T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
  ];
  const group2_test = [
    {
      category: "gcase-8",
      date: "2025-07-12T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      category: "gcase-8",
      date: "2025-07-15T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      category: "gcase-8",
      date: "2025-07-15T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      category: "gcase-8",
      date: "2025-07-21T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      category: "gcase-8",
      date: "2025-07-24T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      category: "gcase-8",
      date: "2025-07-24T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
  ];
  const group3_test = [
    {
      category: "gcase-6",
      date: "2025-07-19T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      category: "gcase-6",
      date: "2025-07-19T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      category: "gcase-6",
      date: "2025-07-10T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
    {
      category: "gcase-6",
      date: "2025-07-30T21:25:20",
      is_active: 1,
      name: "테스트 플랜2",
      uuid: "efac0746-a881-4f20-ad7a-d0fc827c5594",
    },
  ];

  const [todos, setTodos] = useState({});

  const ensureValidAccessToken = async () => {
    try {
      // 1. 유효성 검사
      await api.get("/users/verify_token");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // 2. 만료됐으면 새로 발급
        console.log("Access Token 만료, 새로 발급 요청");
        try {
          const refreshResponse = await api.post("users/refresh_token");
          const newAccessToken = refreshResponse.data.accessToken;
          await SecureStore.setItemAsync("accessToken", newAccessToken);
          console.log("Access Token 재발급 완료");
        } catch (refreshError) {
          console.error("토큰 재발급 실패:", refreshError);
          throw new Error("세션이 만료되었습니다. 다시 로그인해주세요.");
        }
      } else {
        throw error;
      }
    }
  };

  const handleAddTodo = async (newTodo) => {
    try {
      //0, access token 유효성 검사
      await ensureValidAccessToken();

      //1, 토큰 가져오기, uuid 추출
      const token = await SecureStore.getItemAsync("accessToken");
      const decoded = jwtDecode(token);

      // 2, 새 일정 post
      const response = await api.post("/plan/push_plan", {
        name: newTodo.name,
        category: newTodo.category,
        date: newTodo.date,
        create_at: decoded.uuid,
      });

      // 3, 렌더할 새 일정 추가
      const addedTodo = {
        uuid: response.data.uuid,
        name: response.data.name,
        category: response.data.category,
        isActive: response.data.is_active === 1,
        isGroup: false,
      };

      // 4, 새 일정 렌더
      setTodos((prev) => {
        const dateKey = response.data.date.split("T")[0];
        const updated = { ...prev };
        if (!updated[dateKey]) updated[dateKey] = [];
        updated[dateKey].push(addedTodo);
        return updated;
      });
    } catch (err) {
      console.log("일정 추가 실패: ", err);
    }
  };

  const handleDeleteTodo = async (uuid, dateKey) => {
    try {
      await api.post("/plan/del_plan", {
        uuid: uuid,
      });

      // 성공 시 사용자에게 알림
      alert("삭제 완료!");
    } catch (err) {
      console.log("플랜 삭제 실패: ", err);
      alert("삭제 실패. 다시 시도해주세요.");
      return; // 실패했으면 setTodos 건너뛰기
    }

    // 삭제 성공한 경우에만 state 업데이트
    setTodos((prev) => {
      const filtered = prev[dateKey].filter((item) => item.uuid !== uuid);
      return {
        ...prev,
        [dateKey]: filtered,
      };
    });
  };

  useEffect(() => {
    const loadAllPlan = async () => {
      try {
        const tempTodos = {};

        const userRes = await api.get("/plan/plans");
        const userTodos = userRes.data;

        userTodos.forEach((todo) => {
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

        // // 그룹 부분 로딩
        // const groupTodos = [...group1_test, ...group2_test, ...group3_test];

        // groupTodos.forEach((todo) => {
        //   const dateKey = todo.date.split("T")[0];
        //   if (!tempTodos[dateKey]) {
        //     tempTodos[dateKey] = [];
        //   }

        //   tempTodos[dateKey].push({
        //     uuid: todo.uuid,
        //     name: todo.name,
        //     category: todo.category,
        //     isActive: todo.is_active === 1,
        //     isGroup: true,
        //   });
        // });

        setTodos(tempTodos);
        // console.log("퍼스널", tempTodos); // 테스트
      } catch (error) {
        console.log("plan update 실패", error);
      }
    };
    loadAllPlan();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <Calendar
        todoData={todos}
        onAddTodo={handleAddTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </View>
  );
};

export default PersonalCalendar;
