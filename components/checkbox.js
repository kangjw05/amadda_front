import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

import { themeColors, categories, groups } from "../Colors";

const CustomCheckbox = ({
  color = "#7EB4BC",
  onToggle = () => {},
  uuid,
  initialChecked,
}) => {
  const [checked, setChecked] = useState(initialChecked);

  const handlePress = () => {
    const newValue = !checked;
    setChecked(newValue);
    onToggle(uuid, newValue);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.checkbox, { backgroundColor: color }]}>
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
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "white",
    fontSize: 19,
    fontWeight: 450,
  },
});

export default CustomCheckbox;
