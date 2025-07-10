import React, { useState, useEffect, useTransition } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import { themeColors, categories, groups } from "../Colors";

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const AddTodoModal = ({ visible, onClose, onAddTodo, selectedDate }) => {
  const today = new Date();

  const [todoText, setTodoText] = useState("");

  const [todoYear, setTodoYear] = useState(selectedDate.getFullYear());
  const [todoMonth, setTodoMonth] = useState(selectedDate.getMonth() + 1);
  const [todoDate, setTodoDate] = useState(selectedDate.getDate());

  useEffect(() => {
    if (visible && selectedDate) {
      const newYear = selectedDate.getFullYear();
      const newMonth = selectedDate.getMonth() + 1;
      const newDate = selectedDate.getDate();

      setTodoYear(newYear);
      setTodoMonth(newMonth);

      // 해당 연월에 존재하지 않는 일은 1일로 대체
      const lastDay = getDaysInMonth(newYear, newMonth);
      setTodoDate(Math.min(newDate, lastDay));
    }
  }, [visible, selectedDate]);

  // 달 일자 차이 보정
  useEffect(() => {
    const maxDate = getDaysInMonth(todoYear, todoMonth);
    if (todoDate > maxDate) {
      setTodoDate(maxDate);
    }
  }, [todoYear, todoMonth]);

  const [todoCategory, setTodoCategory] = useState("기타-1");

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>일정 추가</Text>

              <View style={styles.userInputContainer}>
                <Text style={styles.inputLabels}>일정 내용</Text>
                <TextInput
                  value={todoText}
                  onChangeText={setTodoText}
                  placeholder="일정을 입력하세요"
                  placeholderTextColor="#aaa"
                  keyboardType="default"
                  maxLength={9}
                  returnKeyType="done"
                  style={styles.textInput}
                />

                <Text
                  style={styles.inputLabels}
                >{`날짜 선택 [${todoYear}-${todoMonth}-${todoDate}]`}</Text>
                <View style={styles.dateInputContainer}>
                  <TextInput
                    value={todoYear.toString()}
                    onChangeText={(text) => {
                      const num = parseInt(text, 10);
                      if (!isNaN(num)) setTodoYear(num);
                      else setTodoYear(selectedDate.getFullYear());
                    }}
                    placeholder={todoYear.toString()}
                    placeholderTextColor="#aaa"
                    keyboardType="number-pad"
                    maxLength={4}
                    returnKeyType="done"
                    style={styles.yearInput}
                  />

                  <View style={styles.monthWrapper}>
                    <Picker
                      selectedValue={todoMonth}
                      onValueChange={(val) => setTodoMonth(val)}
                      style={styles.monthPicker}
                      itemStyle={styles.pickerItem}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <Picker.Item
                          key={i}
                          label={`${i + 1}월`}
                          value={i + 1}
                          color={themeColors.text}
                        />
                      ))}
                    </Picker>
                  </View>

                  <View style={styles.dateWrapper}>
                    <Picker
                      selectedValue={todoDate}
                      onValueChange={(val) => setTodoDate(val)}
                      style={styles.datePicker}
                      itemStyle={styles.pickerItem}
                    >
                      {Array.from(
                        { length: getDaysInMonth(todoYear, todoMonth) },
                        (_, i) => (
                          <Picker.Item
                            key={i}
                            label={`${i + 1}일`}
                            value={i + 1}
                            color={themeColors.text}
                          />
                        )
                      )}
                    </Picker>
                  </View>
                </View>
                <Text style={styles.inputLabels}>카테고리</Text>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.cancelBtn}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onAddTodo(/* todo 정보 */)}>
                  <Text style={styles.addBtn}>추가</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // 모달 배경 오버레이
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  // 모달 컨테이너
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "85%",
    padding: 17,
  },

  // 일정 추가 텍스트
  title: {
    fontSize: 21,
    fontWeight: 400,
    color: themeColors.text,
    paddingBottom: 13,
    paddingLeft: 9,
  },
  // 인풋 모음 컨테이너
  userInputContainer: {
    borderTopWidth: 1,
    borderTopColor: themeColors.text,
    paddingVertical: 10,
  },
  // 각 인풋 라벨
  inputLabels: {
    fontSize: 16,
    color: themeColors.text,
    marginTop: 13,
    marginBottom: 5,
    paddingLeft: 9,
  },
  // 일정 내용 입력 텍스트 인풋
  textInput: {
    backgroundColor: themeColors.bar,
    color: themeColors.text,
    borderColor: themeColors.lightText,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 18,
  },

  // 날짜 입력 요소 컨테이너
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  // 년 입력 텍스트 인풋
  yearInput: {
    width: 85,
    textAlign: "center",
    backgroundColor: themeColors.bar,
    color: themeColors.text,
    borderColor: themeColors.lightText,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 18,
  },
  // 달 입력 picker 래퍼
  monthWrapper: {
    flex: 1,
    overflow: "hidden",
    justifyContent: "center",
  },
  // 달 입력 피커
  monthPicker: {
    width: "100%",
  },
  // 일 입력 picker 래퍼
  dateWrapper: {
    flex: 1,
    overflow: "hidden",
    justifyContent: "center",
  },
  // 일 입력 피커
  datePicker: {
    width: "100%",
  },
  // 피커 아이템 스타일
  pickerItem: {
    fontSize: 18,
    textAlign: "center",
  },

  // 취소 / 추가 버튼 컨테이너
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelBtn: {
    fontSize: 18,
    padding: 10,
    color: "gray",
  },
  addBtn: {
    fontSize: 18,
    padding: 10,
    paddingHorizontal: 10 * 2,
    backgroundColor: themeColors.highlight,
    borderRadius: 7,
    color: "white",
    fontWeight: 450,
  },
});

export default AddTodoModal;
