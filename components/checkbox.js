import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

const CustomCheckbox = () => {
  const [checked, setChecked] = useState(false);

  return (
    <TouchableOpacity onPress={() => setChecked(!checked)}>
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#E2EEF7", // 체크 안 됐을 때 배경
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#86C5D8", // 체크 됐을 때 배경
  },
  checkmark: {
    color: "white",
    fontSize: 19,
    fontWeight: 450,
  },
});

export default CustomCheckbox;
