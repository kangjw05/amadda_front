import { StyleSheet } from "react-native";
import { themeColors, categories, groups } from "../Colors";

const GroupListScreenStyles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomColor: themeColors.highlight,
    borderBottomWidth: 1,
  },
  headText: {
    flex: 1,
    fontSize: 30,
    padding: 8,
    color: themeColors.highlight,
  },
  addButton: {
    padding: 8,
  },
  addButtonText: {
    fontSize: 30,
    color: themeColors.highlight,
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
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabSelected: {
    borderBottomColor: themeColors.highlight,
  },
  tabText: {
    fontSize: 16,
    color: themeColors.lightText,
  },
  tabTextSelected: {
    fontSize: 16,
    color: themeColors.highlight,
  },
  inputContainer: {
    marginVertical: 5,
    alignItems: "flex-start",
    flexDirection: "column",
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
  imageStyle: {
    borderRadius: 7,
    overflow: "hidden",
    resizeMode: "contain",
  },
  copyIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
    marginVertical: 6,
    tintColor: themeColors.highlight,
  },
  input: {
    flex: 1,
    borderRadius: 6,
    padding: 8,
    marginVertical: 6,
    marginHorizontal: 4,
    fontSize: 20,
    color: themeColors.highlight,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
  },
  actionButton: {
    width: "25%",
    backgroundColor: themeColors.highlight,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  groupItem: {
    flex: 0.95,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.highlight,
    marginHorizontal: 10,
  },
  groupInfo: {
    flex: 1,
    marginLeft: 10,
  },
  groupIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 10,
  },
  groupIcon: {
    width: "50%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  groupName: {
    fontSize: 20,
    color: themeColors.highlight,
    marginVertical: 4,
  },
  groupCreator: {
    fontSize: 16,
    color: themeColors.highlight,
    marginVertical: 4,
  },
});

export default GroupListScreenStyles;
