import { StyleSheet } from "react-native";
import { themeColors } from "../Colors"; // 색상 불러오기

const GroupScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: themeColors.bg },

  // 그룹 헤더 스타일
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    borderBottomColor: themeColors.highlight,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  headText: {
    flex: 1,
    fontSize: 25,
    padding: 8,
    marginVertical: 10,
    marginLeft: 10,
    color: themeColors.highlight,
    textAlign: "center",
  },
  iconButton: {
    padding: 4,
    marginLeft: 5,
  },
  iconImage: {
    width: 24,
    height: 24,
    marginTop: 4,
    tintColor: themeColors.highlight,
  },


  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},
modalContainer: {
  backgroundColor: themeColors.bg,
  borderRadius: 8,
  padding: 20,
  width: 380,
},
inputLabel: {
  fontSize: 16,
  color: themeColors.highlight,
},
inputBackground: {
  width: "100%",
  height: 54.5,
  justifyContent: "center",
  alignItems: "center",
  marginVertical: 6,
  flexDirection: "row",
},
buttonContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 20,
},
actionButton: {
  width: "48%",
  backgroundColor: themeColors.highlight,
  borderRadius: 10,
  padding: 12,
  alignItems: "center",
},
actionButtonText: {
  color: "white",
  fontWeight: "bold",
},

});

export default GroupScreenStyles;
