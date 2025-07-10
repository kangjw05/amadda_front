import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { themeColors, categories, groups } from "../Colors";

const CalendarPage = ({
  year,
  month,
  selectedDate,
  setSelectedDate,
  todos,
}) => {
  const generateMatrix = () => {
    const matrix = [];

    const firstDay = new Date(year, month - 1, 1).getDay(); // 현재 달의 첫번째 요일
    const prevMaxDays = new Date(year, month - 1, 0).getDate(); // 현재로부터 한달 전의 마지막 날짜
    const maxDays = new Date(year, month + 0, 0).getDate(); // 현재 달의 마지막 날짜

    let counter = -firstDay + 1;

    for (let row = 0; row < 6; row++) {
      matrix[row] = [];
      for (let col = 0; col < 7; col++) {
        if (counter <= 0) {
          let cellValue = prevMaxDays + counter;
          matrix[row][col] = { day: cellValue, isInCurrentMonth: false };
        } else if (counter <= maxDays) {
          let cellValue = counter;
          matrix[row][col] = { day: cellValue, isInCurrentMonth: true };
        } else {
          let cellValue = counter - maxDays;
          matrix[row][col] = { day: cellValue, isInCurrentMonth: false };
        }
        counter++;
      }
    }
    return matrix;
  };

  const getCellStyle = (item, colIndex) => {
    let cellStyle = [styles.cell]; // 기본 셀 스타일
    let textStyle = [styles.cellText]; // 기본 셀 텍스트 스타일
    if (colIndex === 0)
      textStyle.push(styles.cellTextRed); // 일요일이면 빨강 텍스트
    else if (colIndex == 6) textStyle.push(styles.cellTextBlue); // 토요일이면 파랑 텍스트

    if (!item.isInCurrentMonth) textStyle.push(styles.cellTextGray); // 현재 달이 아니면 투명도

    const isSelected =
      selectedDate &&
      year === selectedDate.getFullYear() &&
      month === selectedDate.getMonth() + 1 &&
      item.day === selectedDate.getDate() &&
      item.isInCurrentMonth;

    if (isSelected) {
      cellStyle.push(styles.selectedCell); // 선택시 배경
    }

    // 객체로 변환 후 리턴
    let totalStyles = {
      cell: cellStyle,
      text: textStyle,
    };

    return totalStyles;
  };

  // 추가 수정 필요
  const handleDayPress = (day, isInCurrentMonth) => {
    if (isInCurrentMonth) {
      setSelectedDate(new Date(year, month - 1, day));
    }
  };

  const getTodoColor = (item) => {
    const categoryNum = item.category.split("-")[1];
    let key = "category1";
    if (item.isGroup) {
      key = `group${categoryNum}`;
      return (
        groups[key] || { bg: "#638A7E", text: "#DBF0E4", checkbox: "#324B25" }
      );
    } else {
      key = `category${categoryNum}`;
      return (
        categories[key] || {
          bg: "#C3DFF0",
          text: "#6488BB",
          checkbox: "#7EB4BC",
        }
      );
    }
  };

  const renderCalendar = () => {
    var matrix = generateMatrix();
    var rows = matrix.map((row, rowIndex) => {
      var rowItems = row.map((item, colIndex) => {
        const dayStr = String(item.day).padStart(2, "0");
        const monthStr = String(month).padStart(2, "0");
        const dateKey = `${year}-${monthStr}-${dayStr}`;
        const dailyTodos = todos[dateKey] || [];

        const totalStyle = getCellStyle(item, colIndex);

        return (
          <TouchableOpacity
            style={totalStyle.cell}
            key={colIndex}
            onPress={() => handleDayPress(item.day, item.isInCurrentMonth)}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={totalStyle.text}>{item.day}</Text>
            </View>

            {item.isInCurrentMonth && dailyTodos.length > 0 && (
              <View style={styles.todosContainer}>
                {dailyTodos.slice(0, 3).map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.todoContent,
                      { backgroundColor: getTodoColor(item).bg },
                    ]}
                  >
                    <View
                      style={[
                        styles.colorBar,
                        {
                          backgroundColor: getTodoColor(item).checkbox,
                        },
                      ]}
                    ></View>
                    <Text
                      style={[
                        styles.todoText,
                        { color: getTodoColor(item).text },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="clip"
                    >
                      {item.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        );
      });
      return (
        <View style={styles.row} key={rowIndex}>
          {rowItems}
        </View>
      );
    });
    return <View style={styles.calendar}>{rows}</View>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendar}>{renderCalendar()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: themeColors.bg,
  },
  calendar: {
    width: "100%",
    justifyContent: "space-between",
    padding: 3,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    height: 80,
    paddingHorizontal: 3,
  },
  selectedCell: {
    backgroundColor: themeColors.bar,
    borderRadius: 7,
  },
  selectedDay: {
    backgroundColor: "#E6EEF5",
  },

  cellText: {
    color: themeColors.text,
    marginTop: 5,
  },
  cellTextRed: {
    color: themeColors.sunday,
  },
  cellTextBlue: {
    color: themeColors.saturday,
  },
  cellTextGray: {
    color: "#0000004D",
  },

  cellTextGrayOpacity: {
    opacity: 0.3,
  },
  todosContainer: {
    overflow: "hidden",
    flex: 1,
  },
  todoContent: {
    width: "100%",
    height: 15,
    marginTop: 3,
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center",
    fontSize: 10,
  },
  colorBar: {
    width: 3,
    height: "100%",
  },
  todoText: {
    fontSize: 10,
    marginLeft: 3,
  },
});

export default React.memo(CalendarPage);
