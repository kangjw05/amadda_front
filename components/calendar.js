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

const Calendar = () => {
  const today = new Date();

  // centerYear을 중심으로 앞 뒤 1년씩 총 3년 렌더링
  const generateCalendarData = (year) => {
    let data = [];
    for (let y = year - 1; y <= year + 1; y++) {
      for (let m = 1; m <= 12; m++) {
        data.push({ year: y, month: m });
      }
    }
    return data;
  };

  // 스크롤 엔드 이벤트
  const handleScrollEnd = useCallback((e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);

    // 캘린더 헤더 업데이트
    const viewed = calendarData[index];
    if (viewed) {
      setCurrentHeader({ year: viewed.year, month: viewed.month });
    }
  }, []);

  // flatList 렌더링 함수
  const renderItem = useCallback(({ item }) => {
    return (
      <View style={styles.bg}>
        <CalendarPage year={item.year} month={item.month} />
      </View>
    );
  }, []);

  const flatListRef = useRef(null);

  const [calendarData, setCalendarData] = useState(() =>
    generateCalendarData(today.getFullYear())
  );
  const [currentHeader, setCurrentHeader] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  return (
    <ScrollView style={styles.bg} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerDate}>
          <Text style={styles.headerText}>
            {currentHeader.year}년 {currentHeader.month}월
          </Text>
          <TouchableOpacity>
            <Text>tmp</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>tmp</Text>
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
        initialScrollIndex={12 + today.getMonth()}
        initialNumToRender={5}
        windowSize={5}
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={renderItem}
      />

      <View style={styles.something}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  something: {
    height: 800,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "orange",
  },

  bg: {
    flex: 1,
    width: screenWidth,
    backgroundColor: themeColors.bg,
  },
  header: {},
  headerText: {
    fontSize: 24,
    color: themeColors.text,
    fontWeight: 300,
    flex: 8,
  },
  headerDate: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingTop: 5,
    paddingHorizontal: 21,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBlockColor: "#ccc",
  },

  dayCell: {
    flex: 1,
    aspectRatio: 1.1,
    alignItems: "center",
    justifyContent: "center",
  },
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
});

export default Calendar;
