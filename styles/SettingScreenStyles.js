import { StyleSheet, Dimensions } from "react-native";
import { themeColors, categories, groups } from "../Colors";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const SettingScreenStyles = StyleSheet.create({
  fullsontainer: {
    flex: 1,
  },
  setting: {
    backgroundColor: themeColors.bg,
    height: 40,
    justifyContent: "center",
  },
  font: {
    fontSize: 25,
    color: "#555B8F",
    paddingLeft: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#555B8F",
  },
  information: {
    flexDirection: "row",
    height: "45%",
    backgroundColor: themeColors.bg,
  },
  leftpannel: {
    flex: 1.5,
    justifyContent: "flex-first",
    alignItems: "center",
  },
  setuser: {
    width: "65%",
    height: "35%",
    resizeMode: "contain",
  },
  rightpannel: {
    flex: 9,
  },
  inputRow: {
    marginBottom: 12,
    paddingHorizontal: 10,
    flex: 1,
  },
  label: {
    width: "20%",
    fontSize: 16,
    marginBottom: 5,
    color: "#555B8F",
  },

  input: {
    borderColor: themeColors.bg,
    backgroundColor: "#E2EEF7",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 15,
    fontSize: 20,
    borderWidth: 2,
    flex: 1,
  },
});

export default SettingScreenStyles;
