import { StyleSheet, Dimensions } from "react-native";
import { themeColors, categories, groups } from "../Colors";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const LoginScreenStyles = StyleSheet.create({
  container_logo: {
    backgroundColor: "white",
    width: screenWidth * 1,
    height: screenHeight * 0.47,
  },
  container_login1: {
    backgroundColor: "white",
    width: screenWidth * 1,
    height: screenHeight * 0.1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  container_login2: {
    backgroundColor: "white",
    width: screenWidth * 1,
    height: screenHeight * 0.1,
  },
  logo: {
    width: 400,
    height: 300,
    marginTop: 50,
  },
  logo_name: {
    textAlign: "center",
    fontSize: 40,
    color: "#555B8F",
  },
  input: {
    borderColor: "#7D8AAB",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 10,
    marginLeft: 20,
    fontSize: 18,
    borderWidth: 2,
    width: screenWidth * 0.65,
  },

  Login_idpw: {},

  Button: {
    backgroundColor: "#555B8F",
    paddingVertical: 13,
    paddingHorizontal: 23,
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 260,
    marginRight: 43,
  },
  ButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  container_fpw_join: {
    backgroundColor: "white",
    height: screenHeight * 0.3,
    alignItems: "center",
    justifyContent: "center",
  },
  fpw: {
    fontSize: 15,
    color: "#949494",
  },
  join: {
    paddingBottom: 100,
    fontSize: 15,
    color: "#949494",
  },
});
export default LoginScreenStyles;
