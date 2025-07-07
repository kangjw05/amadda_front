import { StyleSheet } from "react-native";

import { themeColors, categories, groups } from "../Colors";

const FindPwScreenStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: themeColors.bg,
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 30,
  },
  logoImage: {
    width: 104,
    height: 99,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 30,
    color: themeColors.highlight,
    marginTop: 10,
  },
  inputsWrapper: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  personIcon: {
    width: 25,
    height: 25,
    marginRight: 8,
    resizeMode: "contain",
  },
  lockIcon: {
    width: 25,
    height: 25,
    marginRight: 8,
  },
  inputBackground: {
    flex: 1,
    height: 45,
    justifyContent: "center",
  },
  inputBackgroundImage: {
    resizeMode: "stretch",
    borderRadius: 4,
  },
  textInput: {
    paddingHorizontal: 10,
    height: "100%",
  },
  actionButton: {
    backgroundColor: themeColors.highlight,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 12,
    marginLeft: 6,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 15,
  },
  inputIconRight: {
    width: 24,
    height: 24,
    marginLeft: 6,
    tintColor: "#739A6D",
  },
  buttonPart: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
  },
  joinButton: {
    backgroundColor: themeColors.highlight,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  footerLinks: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    margin: 10,
    marginBottom: 100,
  },
  footerLinkText: {
    color: "#949494",
    marginVertical: 10,
    fontSize: 15,
  },
});

export default FindPwScreenStyles;
