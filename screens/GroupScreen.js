import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

import GroupScreenStyles from "../styles/GroupScreenStyles";
import { themeColors } from "../Colors";
import Header from "../components/header";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native"; 

const GroupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const group = route.params.group;

  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("그룹원");

  const handleMenuPress = () => setIsPermissionModalVisible(true);
  const closePermissionModal = () => setIsPermissionModalVisible(false);

  //그룹삭제함수
  const handleDeleteGroup = async () => {
  Alert.alert(
    "그룹 삭제",
    `"${group.name}" 그룹을 정말 삭제하시겠습니까?`,
    [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            const storedGroups = await AsyncStorage.getItem("groupList");
            const parsedGroups = storedGroups ? JSON.parse(storedGroups) : [];

            const updatedGroups = parsedGroups.filter(g => g.code !== group.code);
            await AsyncStorage.setItem("groupList", JSON.stringify(updatedGroups));

            setIsPermissionModalVisible(false); // 모달 닫기
            navigation.goBack(); // 이전 화면으로 이동
          } catch (error) {
            console.error("그룹 삭제 실패:", error);
          }
        }
      }
    ]
  );
};
  //그룹저장함수

  return (
    <View style={GroupScreenStyles.container}>
      <Header />
      {/* 그룹 헤더 */}
      <View style={GroupScreenStyles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={GroupScreenStyles.iconButton}>
          <Image source={require("../assets/images/backArrow.png")} style={GroupScreenStyles.iconImage} />
        </TouchableOpacity>

        <Text style={GroupScreenStyles.headText}>{group.name}</Text>

        <TouchableOpacity onPress={handleMenuPress} style={GroupScreenStyles.iconButton}>
          <Image source={require("../assets/images/menuIcon.png")} style={GroupScreenStyles.iconImage} />
        </TouchableOpacity>
      </View>

      {/* 권한 설정 모달 */}
      <Modal
        visible={isPermissionModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closePermissionModal}
      >
        <TouchableWithoutFeedback onPress={closePermissionModal}>
          <View style={GroupScreenStyles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={GroupScreenStyles.modalContainer}>
                <Text style={[GroupScreenStyles.inputLabel, { fontSize: 20 }]}>마정우</Text>
                <View style={{
                  borderBottomColor: themeColors.highlight,
                  borderBottomWidth: 1,
                  marginVertical: 10,
                }} />

                <Text style={GroupScreenStyles.inputLabel}>그룹 권한</Text>
                <View style={GroupScreenStyles.inputBackground}>
                  <Picker
                    selectedValue={selectedRole}
                    onValueChange={(itemValue) => setSelectedRole(itemValue)}
                    style={{ flex: 1, color: themeColors.highlight }}
                    dropdownIconColor={themeColors.highlight}
                  >
                    <Picker.Item label="그룹원" value="그룹원" />
                    <Picker.Item label="관리자" value="관리자" />
                  </Picker>
                </View>

                <View style={GroupScreenStyles.buttonContainer}>
                  <TouchableOpacity
                    style={[GroupScreenStyles.actionButton, { backgroundColor: themeColors.sunday }]}
                    onPress={handleDeleteGroup}
                  >
                    <Text style={GroupScreenStyles.actionButtonText}>그룹 삭제</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={GroupScreenStyles.actionButton}>
                    <Text style={GroupScreenStyles.actionButtonText}>저장</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default GroupScreen;
