import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
} from "react-native";

import { themeColors, categories, groups } from "../Colors";
import CalendarPage from "./calendarPage";

const screenWidth = Dimensions.get("window").width;

const days = ["일", "월", "화", "수", "목", "금", "토"];

const mockupTodos = [
  "테스트1",
  "테스트2",
  "테스트3",
  "테스트4",
  "테스트5",
  "테스트6",
  "테스트7",
  "테스트8",
  "테스트9",
  "테스트10",
  "테스트11",
  "테스트12",
  "테스트13",
];

const Calendar = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  // 1년치 데이터 생성 함수
  const generateOneYearData = (year) => {
    let data = [];
    for (let m = 1; m <= 12; m++) {
      data.push({ year, month: m });
    }
    return data;
  };

  // centerYear을 중심으로 앞 뒤 2년씩 총 5년 렌더링
  const generateCalendarData = (year) => {
    let data = [];
    for (let y = year - 2; y <= year + 2; y++) {
      data.push(...generateOneYearData(y));
    }
    return data;
  };

  // 스크롤 엔드 이벤트
  const handleScrollEnd = useCallback((e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);

    // 페이징 인덱스 동기화
    setCurrentIndex(index);

    // 새로운 페이지 로딩 임계값
    const threshold = 1;

    // 오른쪽 끝 도달 시 동적 할당
    if (index > calendarDataRef.current.length - 1 - threshold) {
      const lastItem = calendarDataRef.current.at(-1);
      const moreData = generateOneYearData(lastItem.year + 1);
      setCalendarData((prev) => {
        const updated = [...prev, ...moreData];
        calendarDataRef.current = updated;
        return updated;
      });
    }

    // 왼쪽 끝 도달 시 동적 할당 ( flatList 한계 상 불완전 구현 )
    // 그래서 그냥 냅다 5년치 한번에 로딩해버리기로 해스요
    if (index < 1) {
      const firstItem = calendarDataRef.current[0];
      console.log(firstItem);
      const moreData = [];
      for (let y = firstItem.year - 5; y < firstItem.year; y++) {
        moreData.push(...generateOneYearData(y));
      }
      const updated = [...moreData, ...calendarDataRef.current];
      calendarDataRef.current = updated;
      setCalendarData(updated);

      const offsetAfter = screenWidth * (index + 60);
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToOffset({
          offset: offsetAfter,
          animated: false,
        });

        setCurrentIndex((prev) => prev + 60);
      });
    }

    // 캘린더 헤더 업데이트
    const viewed = calendarDataRef.current[index];
    if (viewed) {
      setCurrentHeader({ year: viewed.year, month: viewed.month });
    }
  }, []);

  // 다음달 이동 버튼 이벤트
  const goToNextMonth = () => {
    if (currentIndex < calendarData.length - 1) {
      const newIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      setCurrentIndex(newIndex);
    }
  };
  // 이전달 이동 버튼 이벤트
  const goToPreviousMonth = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      setCurrentIndex(newIndex);
    }
  };
  // 특정달 이동 이벤트
  const goToMonth = (targetYear, targetMonth) => {
    const newData = generateCalendarData(targetYear);
    const newIndex = 12 + (targetYear - 1);

    setCalendarData(newData);
    setCurrentIndex(newIndex);

    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: false });
    }, 5);
  };

  // flatList 렌더링 함수
  const renderItem = useCallback(
    ({ item }) => {
      return (
        <View style={styles.bg}>
          <CalendarPage
            year={item.year}
            month={item.month}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </View>
      );
    },
    [selectedDate]
  );

  // FlatList 레퍼런스
  const flatListRef = useRef(null);

  // FlatList 렌더링 데이터
  const [calendarData, setCalendarData] = useState(() =>
    generateCalendarData(today.getFullYear())
  );
  // calendarData 레퍼런스
  const calendarDataRef = useRef(calendarData);
  // setState가 비동기 작업이므로 동기화된 레퍼런스가 필요
  useEffect(() => {
    calendarDataRef.current = calendarData;
  }, [calendarData]);

  // 페이지, 헤더 동기화
  const [currentHeader, setCurrentHeader] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });
  // 페이징 이동용 현재 인덱스 정보
  const [currentIndex, setCurrentIndex] = useState(24 + today.getMonth());

  return (
    <ScrollView style={styles.bg} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerDate}>
          <Text style={styles.headerText}>
            {currentHeader.year}년 {currentHeader.month}월
          </Text>
          <TouchableOpacity
            style={styles.moveMonthBtn}
            onPress={goToPreviousMonth}
          >
            <Text style={styles.moveBtnText}>{"<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moveMonthBtn} onPress={goToNextMonth}>
            <Text style={styles.moveBtnText}>{">"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.daysRow}>
          {days.map((day, index) => {
            const textStyle = [styles.daysText];
            if (index === 0) textStyle.push(styles.textRed);
            if (index === 6) textStyle.push(styles.textBlue);
            return (
              <View style={styles.dayCell} key={index}>
                <Text style={textStyle}>{day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={flatListRef}
        data={calendarData}
        keyExtractor={(item) => `${item.year}${item.month}`}
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        initialScrollIndex={24 + today.getMonth()}
        initialNumToRender={3}
        windowSize={3}
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={renderItem}
      />

      <View style={styles.todosContainer}>
        <View style={styles.todoHeader}>
          <Text style={styles.todoHeaderText}>
            {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
          </Text>
          <TouchableOpacity style={styles.todoAddBtn}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {mockupTodos.map((item, index) => (
          <View key={index} style={styles.todos}>
            <Text>{item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // 배경 전체 컨테이너 스타일
  bg: {
    flex: 1,
    width: screenWidth,
    backgroundColor: themeColors.bg,
  },
  // 헤더 컨테이너 스타일
  header: {},
  // 연월 텍스트, 이동 버튼 포함 컨테이너
  headerDate: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingTop: 13,
    paddingHorizontal: 21,
  },
  // 헤더의 20XX년 XX월 텍스트 스타일
  headerText: {
    fontSize: 24,
    color: themeColors.text,
    fontWeight: 300,
    flex: 8,
  },
  // 헤더 이동 좌우 버튼
  moveMonthBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 30,
  },
  // 버튼 속 텍스트
  moveBtnText: {
    fontSize: 24,
    fontWeight: 300,
  },
  // 일월화수목금토일 컨테이너
  daysRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBlockColor: "#ccc",
  },
  // 각 요일 셀 스타일
  dayCell: {
    flex: 1,
    aspectRatio: 1.1,
    alignItems: "center",
    justifyContent: "center",
  },
  // 각 요일 텍스트 스타일
  daysText: {
    color: themeColors.text,
    fontWeight: 600,
    fontSize: 16,
  },

  textRed: {
    color: themeColors.sunday,
  },
  textBlue: {
    color: themeColors.saturday,
  },

  // 일정 목록 컨테이너
  todosContainer: {
    flex: 1,
    marginHorizontal: 19,
    borderRadius: 23,
    backgroundColor: themeColors.bar,
    paddingVertical: "5%",
    paddingHorizontal: "7%",
  },
  todoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  todoHeaderText: { color: themeColors.text, fontWeight: 600, fontSize: 27 },
  todoAddBtn: {},
  addBtnText: { color: themeColors.text, fontWeight: 600, fontSize: 27 },

  todos: {
    flex: 1,
    backgroundColor: categories.category1.bg,
    borderRadius: 13,
    marginTop: 21,
    paddingVertical: "5%",
    paddingHorizontal: "7%",
    width: "100%",
    height: 77,
  },
});

export default Calendar;
