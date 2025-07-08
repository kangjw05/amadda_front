import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import { themeColors, categories, groups } from "../Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "../styles/SettingScreenStyles";
import Header from "../components/header";
import LoginScreen from "./LoginScreen";

const SettingScreen = ({ setIsLoggedIn }) => {
  const navigation = useNavigation();
  useEffect(() => {
    const loadData = async () => {
      try {
        const accountJson = await AsyncStorage.getItem("accountData");
        if (accountJson) {
          setAccountData(JSON.parse(accountJson));
        }
        const categoriesJson = await AsyncStorage.getItem("categoriesList");
        if (categoriesJson) {
          setCategoriesList(JSON.parse(categoriesJson));
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };
    loadData();
  }, []);

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("1234");

  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingPassword, setisEditingPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [checkPassword, setCheckPassword] = useState("");

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedColorKey, setSelectedColorKey] = useState("category1");

  const [isEditCategoryModalVisible, setIsEditCategoryModalVisible] =
    useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // {id, name, colorKey}
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [editingColorKey, setEditingColorKey] = useState("category1");

  const saveAccountData = async (data) => {
    try {
      await AsyncStorage.setItem("accountData", JSON.stringify(data));
    } catch (error) {
      console.error("accountData 저장 실패:", error);
    }
  };

  const saveCategoriesList = async (data) => {
    try {
      await AsyncStorage.setItem("categoriesList", JSON.stringify(data));
    } catch (error) {
      console.error("categoriesList 저장 실패:", error);
    }
  };

  const getMaskedPassword = (password) => {
    if (!password) return "";
    if (password.length <= 3) return "*".repeat(password.length);
    const visible = password.slice(0, 3);
    const hidden = "*".repeat(password.length - 3);
    return visible + hidden;
  };

  const openPasswordModal = () => {
    setPassword("");
    setTempPassword("");
    setCheckPassword("");
    setisEditingPassword(true);
  };

  const savePassword = async () => {
    if (tempPassword !== checkPassword) {
      Alert.alert("새 비밀번호 불일치", "새 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (tempPassword === "" || checkPassword === "") {
      Alert.alert("비밀번호 입력 오류", "비밀번호를 입력해주세요.");
      return;
    }
    if (tempPassword === accountData.password) {
      Alert.alert(
        "비밀번호 변경 오류",
        "새 비밀번호가 현재 비밀번호와 동일합니다."
      );
      return;
    }
    if (password !== accountData.password) {
      Alert.alert("비밀번호 오류", "현재 비밀번호가 일치하지 않습니다.");
      return;
    }
    const newAccountData = {
      ...accountData,
      password: tempPassword,
    };
    setAccountData(newAccountData);
    await saveAccountData(newAccountData);
    setisEditingPassword(false);
  };

  const saveAccount = async () => {
    if (account === "") {
      Alert.alert("이름 입력 오류", "이름을 입력해주세요.");
      return;
    }
    const newAccountData = {
      ...accountData,
      account: account,
    };
    setAccountData(newAccountData);
    await saveAccountData(newAccountData);
    setIsEditingAccount(false);
  };

  const [accountData, setAccountData] = useState({
    account: "마정우",
    email: "majw.naver.com",
    password: "1234",
  });

  const tempAccount = accountData.account;

  const [categoriesList, setCategoriesList] = useState([
    { id: 1, name: "기타", colorKey: "category1" },
  ]);

  const openCategoryModal = () => {
    if (categoriesList.length >= 20) {
      Alert.alert(
        "카테고리 제한",
        "최대 20개의 카테고리만 추가할 수 있습니다.",
        [{ text: "확인" }]
      );
      return;
    }
    setNewCategoryName("");
    setSelectedColorKey("category1");
    setIsCategoryModalVisible(true);
  };

  const saveCategory = async () => {
    if (newCategoryName.trim() === "") {
      return;
    }
    const newId =
      categoriesList.length > 0
        ? categoriesList[categoriesList.length - 1].id + 1
        : 1;
    const newCategory = {
      id: newId,
      name: newCategoryName.trim(),
      colorKey: selectedColorKey,
    };
    const newList = [...categoriesList, newCategory];
    setCategoriesList(newList);
    await saveCategoriesList(newList);
    setIsCategoryModalVisible(false);
  };

  const saveEditedCategory = async () => {
    if (editingCategoryName.trim() === "") {
      Alert.alert("카테고리 이름 입력", "카테고리 이름을 입력해주세요.");
      return;
    }
    const newList = categoriesList.map((cat) =>
      cat.id === editingCategory.id
        ? {
            ...cat,
            name: editingCategoryName.trim(),
            colorKey: editingColorKey,
          }
        : cat
    );
    setCategoriesList(newList);
    await saveCategoriesList(newList);
    setIsEditCategoryModalVisible(false);
  };

  const deleteCategory = async () => {
    const newList = categoriesList.filter(
      (cat) => cat.id !== editingCategory.id
    );
    setCategoriesList(newList);
    await saveCategoriesList(newList);
    setIsEditCategoryModalVisible(false);
  };

  const logout = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");

      const response = await fetch(
        "http://ser.iptime.org:8000/users/expire_token",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      const responseText = await response.text();
      console.log("🔁 로그아웃 응답:", response.status, responseText);

      // regardless of result, clear tokens
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      setIsLoggedIn(false);

      if (!response.ok) {
        Alert.alert("로그아웃 실패", responseText || "다시 시도해주세요.");
      }
    } catch (error) {
      console.error("🚨 로그아웃 네트워크 오류:", error);
      Alert.alert("오류", "서버에 연결할 수 없습니다.");
    }
  };

  return (
    <View style={styles.fullcontainer}>
      <View>
        <Header />
      </View>
      <View style={styles.setting}>
        <Text style={styles.font}>설정</Text>
      </View>
      <ScrollView
        style={{ flex: 1, backgroundColor: themeColors.bg }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.information}>
          <View style={styles.leftpannel}>
            <Image
              source={require("../assets/images/userIcon.png")}
              style={styles.icon}
            />
          </View>

          <View style={styles.rightpannel}>
            <View style={styles.inputRow}>
              <Text style={styles.label}>계정</Text>
              <View style={styles.inputContainer}>
                {isEditingAccount ? (
                  <TextInput
                    placeholder={tempAccount}
                    value={account}
                    onChangeText={setAccount}
                    onBlur={saveAccount}
                    autoFocus
                    style={styles.input}
                    maxLength={16}
                  />
                ) : (
                  <Text style={styles.input}>{accountData.account}</Text>
                )}
                <TouchableOpacity
                  onPress={() => setIsEditingAccount(!isEditingAccount)}
                >
                  <Image
                    source={require("../assets/images/pencilIcon.png")}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>이메일</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.input}>{accountData.email}</Text>
              </View>
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>비밀번호</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.input}>
                  {getMaskedPassword(accountData.password)}
                </Text>
                <TouchableOpacity onPress={() => openPasswordModal()}>
                  <Image
                    source={require("../assets/images/pencilIcon.png")}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <Modal
          visible={isEditingPassword}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setisEditingPassword(false)}
        >
          <TouchableWithoutFeedback onPress={() => setisEditingPassword(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>비밀번호 변경</Text>
                  </View>
                  <Text style={styles.modalLabel}>현재 비밀번호</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="현재 비밀번호"
                      value={password}
                      onChangeText={setPassword}
                      style={styles.modalInput}
                      maxLength={20}
                    />
                  </View>
                  <Text style={styles.modalLabel}>새 비밀번호</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="새 비밀번호"
                      value={tempPassword}
                      onChangeText={setTempPassword}
                      style={styles.modalInput}
                      maxLength={20}
                    />
                  </View>
                  <Text style={styles.modalLabel}>새 비밀번호 확인</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="새 비밀번호 확인"
                      value={checkPassword}
                      onChangeText={setCheckPassword}
                      style={styles.modalInput}
                      maxLength={20}
                    />
                    {tempPassword !== checkPassword ||
                    tempPassword === "" ||
                    checkPassword === "" ? (
                      <Image
                        source={require("../assets/images/checkBoxOutlineIcon.png")}
                        style={styles.checkIcon}
                      />
                    ) : (
                      <Image
                        source={require("../assets/images/checkBoxIcon.png")}
                        style={styles.checkIcon}
                      />
                    )}
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => setisEditingPassword(false)}
                      style={styles.cancelButton}
                    >
                      <Text style={styles.actionButtonText}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => savePassword()}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionButtonText}>변경</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <View style={styles.information}>
          <View style={styles.leftpannel}>
            <Image
              source={require("../assets/images/tagIcon.png")}
              style={styles.icon}
            />
          </View>
          <View style={styles.rightpannel}>
            <View style={styles.inputRow}>
              <View style={styles.labelContainer}>
                <Text style={styles.categoryLabel}>카테고리</Text>
                <TouchableOpacity
                  onPress={openCategoryModal}
                  style={styles.addCategoryButton}
                >
                  <Image
                    source={require("../assets/images/addIcon.png")}
                    style={styles.addIcon}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryContainer}>
                <FlatList
                  data={categoriesList}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setEditingCategory(item);
                        setEditingCategoryName(item.name);
                        setEditingColorKey(item.colorKey);
                        setIsEditCategoryModalVisible(true);
                      }}
                      style={styles.categoryItem}
                    >
                      <Text style={styles.categoryText}>{item.name}</Text>
                      <View
                        style={[
                          styles.selectedColor,
                          { backgroundColor: categories[item.colorKey].bg },
                        ]}
                      ></View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            </View>
          </View>
        </View>
        <Modal
          visible={isCategoryModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsCategoryModalVisible(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setIsCategoryModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>카테고리 추가</Text>
                  </View>
                  <Text style={styles.categoryModalLabel}>카테고리 이름</Text>
                  <TextInput
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                    placeholder="카테고리 이름"
                    style={styles.categoryModalInput}
                    maxLength={16}
                  />
                  <Text style={styles.categoryModalLabel}>카테고리 색상</Text>
                  <View style={styles.colorGrid}>
                    {Object.keys(categories).map((key) => (
                      <TouchableOpacity
                        key={key}
                        onPress={() => setSelectedColorKey(key)}
                        style={[styles.colorCircleWrapper]}
                      >
                        <View
                          style={[
                            styles.colorCircle,
                            { backgroundColor: categories[key].bg },
                          ]}
                        >
                          {selectedColorKey === key && (
                            <Image
                              source={require("../assets/images/checkIcon.png")}
                              style={styles.checkMark}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => setIsCategoryModalVisible(false)}
                      style={styles.cancelButton}
                    >
                      <Text style={styles.actionButtonText}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={saveCategory}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionButtonText}>추가</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          visible={isEditCategoryModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsEditCategoryModalVisible(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setIsEditCategoryModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>카테고리 수정</Text>
                  </View>

                  <Text style={styles.categoryModalLabel}>카테고리 이름</Text>
                  <TextInput
                    value={editingCategoryName}
                    onChangeText={setEditingCategoryName}
                    placeholder="카테고리 이름"
                    style={styles.categoryModalInput}
                    maxLength={16}
                  />
                  <Text style={styles.categoryModalLabel}>카테고리 색상</Text>
                  <View style={styles.colorGrid}>
                    {Object.keys(categories).map((key) => (
                      <TouchableOpacity
                        key={key}
                        onPress={() => setEditingColorKey(key)}
                        style={styles.colorCircleWrapper}
                      >
                        <View
                          style={[
                            styles.colorCircle,
                            { backgroundColor: categories[key].bg },
                          ]}
                        >
                          {editingColorKey === key && (
                            <Image
                              source={require("../assets/images/checkIcon.png")}
                              style={styles.checkMark}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={deleteCategory}
                      style={styles.cancelButton}
                    >
                      <Text style={styles.actionButtonText}>삭제</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={saveEditedCategory}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionButtonText}>변경</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <TouchableOpacity style={styles.information}>
          <View style={styles.leftpannel}>
            <Image
              source={require("../assets/images/lockIcon.png")}
              style={styles.lockIcon}
            />
          </View>
          <View style={styles.rightpannel}>
            <View style={styles.inputRow}>
              <Text style={styles.findPWFont}>비밀번호 찾기</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.information} onPress={logout}>
          <View style={styles.leftpannel}>
            <Image
              source={require("../assets/images/logoutIcon.png")}
              style={styles.outIcon}
            />
          </View>
          <View style={styles.rightpannel}>
            <View style={styles.inputRow}>
              <Text style={styles.outText}>로그아웃</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.information}>
          <View style={styles.leftpannel}>
            <Image
              source={require("../assets/images/userXIcon.png")}
              style={styles.outIcon}
            />
          </View>

          <View style={styles.rightpannel}>
            <View style={styles.inputRow}>
              <Text style={styles.outText}>앱 탈퇴</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SettingScreen;
