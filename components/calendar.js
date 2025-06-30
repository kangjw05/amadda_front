import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { themeColors, categories, groups } from "../Colors";

const days = ["일", "월", "화", "수", "목", "금", "토"];
const months = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [checkDate, setCheckDate] = useState("");

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleDayPress = (day, isInCurrentMonth) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    if (!isInCurrentMonth) {
      const isNextMonth = day < 15;
      const newMonth = isNextMonth ? month + 1 : month - 1;
      const newYear = newMonth < 0 ? year - 1 : newMonth > 11 ? year + 1 : year;
      const adjustedMonth = (newMonth + 12) % 12;

      const newCurrentMonth = new Date(newYear, adjustedMonth, 1);
      setCurrentMonth(newCurrentMonth);

      const formattedMonth =
        adjustedMonth < 9 ? `0${adjustedMonth + 1}` : adjustedMonth + 1;
      const formattedDay = day < 10 ? `0${day}` : day;
      const formattedDate = `${newYear}-${formattedMonth}-${formattedDay}`;

      setSelectedDay(day);
      setCheckDate(formattedDate);
    } else {
      const formattedMonth = month < 9 ? `0${month + 1}` : month + 1;
      const formattedDay = day < 10 ? `0${day}` : day;
      const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
      setSelectedDay(day);
      setCheckDate(formattedDate);
    }
  };

  const generateMatrix = () => {
    var matrix = []; // 날짜들을 담을 새로운 매트릭스 생성 ( 주석 내가씀,, )
    var year = currentMonth.getFullYear();
    var month = currentMonth.getMonth(); // 아래 변수를 위한 새 객체 생성에 사용
    var firstDay = new Date(year, month, 1).getDay(); // 현재 달, 첫번째 날의 요일
    var maxDays = new Date(year, month + 1, 0).getDate(); // 현재 달의 마지막 날짜

    var counter = -firstDay + 1;
    for (var row = 0; row < 5; row++) {
      matrix[row] = [];
      for (var col = 0; col < 7; col++) {
        let cellValue = counter > 0 && counter <= maxDays ? counter : "";
        matrix[row][col] = {
          day: cellValue,
          isInCurrentMonth: counter > 0 && counter <= maxDays,
        };
        counter++;
      }
    }
    return matrix;
  };

  const getCellStyle = (colIndex, item) => {
    let cellStyle = [styles.cell]; // 기본 셀 스타일
    let textStyle = [styles.cellText]; // 기본 셀 텍스트 스타일
    if (colIndex === 0)
      textStyle.push(styles.cellTextRed); // 일요일이면 빨강 텍스트
    else if (colIndex == 6) textStyle.push(styles.cellTextBlue); // 토요일이면 파랑 텍스트

    if (!item.isInCurrentMonth) textStyle.push(styles.cellTextGray); // 현재 달이 아니면 투명도

    if (item.day === selectedDay) cellStyle.push(styles.selectedCell); // 선택시 배경
    // 객체로 변환 후 리턴
    let totalStyles = {
      cell: cellStyle,
      text: textStyle,
    };

    return totalStyles;
  };

  const renderCalendar = () => {
    var matrix = generateMatrix();
    var rows = matrix.map((row, rowIndex) => {
      var rowItems = row.map((item, colIndex) => {
        const totalStyle = getCellStyle(colIndex, item);
        return (
          <TouchableOpacity
            style={totalStyle.cell}
            key={colIndex}
            onPress={() => handleDayPress(item.day, item.isInCurrentMonth)}
          >
            <Text style={totalStyle.text}>{item.day}</Text>
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
      <View style={styles.header}>
        <View style={styles.dateSelect}>
          <Text style={styles.monthLabel}>
            {currentMonth.getFullYear()}년&nbsp;
            {months[currentMonth.getMonth()]}
          </Text>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Text style={styles.selectMonth}>&lt;</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextMonth}>
            <Text style={styles.selectMonth}>&gt;</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.daysRow}>
          {days.map((day, index) => {
            const textStyle = [styles.daysText];
            if (index === 0) textStyle.push(styles.cellTextRed);
            if (index === 6) textStyle.push(styles.cellTextBlue);
            return (
              <View style={styles.dayCell} key={index}>
                <Text style={textStyle}>{day}</Text>
              </View>
            );
          })}
        </View>
      </View>
      <View style={styles.calendar}>{renderCalendar()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: themeColors.bg,
  },
  header: {},
  dateSelect: {
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
    marginBottom: 3,
  },
  calendar: {
    width: "100%",
    justifyContent: "space-between",
  },
  monthLabel: {
    fontSize: 36,
    color: themeColors.text,
    fontWeight: 300,
    flex: 8,
  },
  selectMonth: {
    flex: 1,
    padding: 10,
    fontSize: 25,
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

  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    height: 80,
    alignItems: "center",
  },
  selectedCell: {
    backgroundColor: themeColors.bar,
    borderRadius: 7,
  },
  cellText: {
    color: themeColors.text,
    paddingTop: 5,
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
  selectedDay: {
    backgroundColor: "#E6EEF5",
  },
  cellTextGrayOpacity: {
    opacity: 0.3,
  },
  specificDate: {
    color: "#FF0000",
  },
});

export default Calendar;
