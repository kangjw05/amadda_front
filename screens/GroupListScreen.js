import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Dimensions,
  TouchableWithoutFeedback,
  FlatList,
  ImageBackground,
} from "react-native";
import * as Clipboard from "expo-clipboard";

import styles from "../styles/GroupListScreenStyles";
import Header from "../components/header";

function generateRandomCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

const GroupListScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState("create"); // "create" or "join"
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState(generateRandomCode());
  const [groupPassword, setGroupPassword] = useState("");
  const handleCopyCode = () => {
    Clipboard.setStringAsync(groupCode);}

  const openModal = () => {
    setGroupCode(generateRandomCode());
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setGroupName("");
    setGroupCode("");
    setGroupPassword("");
  };

  const handleCreateGroup = () => {
    // 그룹 생성 로직
    console.log("그룹 생성:", groupName);
    closeModal();
  };

  const handleJoinGroup = () => {
    // 그룹 참가 로직
    console.log("그룹 참가:", groupCode, groupPassword);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* 리스트 헤더 */}
      <View style={styles.topBar}>
        <Text style={styles.headText}>그룹</Text>
        <TouchableOpacity onPress={openModal} style={styles.addButton}>
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* 모달 */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            {/* 탭 */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === "create" && styles.tabSelected,
                ]}
                onPress={() => setSelectedTab("create")}
              >
                <Text style={[styles.tabText,
                  selectedTab === "create" && styles.tabTextSelected
                ]}>그룹 생성</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === "join" && styles.tabSelected,
                ]}
                onPress={() => setSelectedTab("join")}
              >
                <Text style={[styles.tabText,
                  selectedTab === "join" && styles.tabTextSelected
                ]}>그룹 참가</Text>
              </TouchableOpacity>
            </View>

            {/* 내용 */}
            {selectedTab === "create" ? (
              <View>
                <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>그룹명</Text>
                <ImageBackground
                  source={require("../assets/images/inputBox.png")}
                  style={styles.inputBackground}
                  imageStyle={{ borderRadius: 7 }}
                  >
                <TextInput
                  value={groupName}
                  onChangeText={setGroupName}
                  style={styles.input}
                />
                </ImageBackground>
                </View>
                <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>그룹 비밀번호</Text>
                <ImageBackground
                  source={require("../assets/images/inputBox.png")}
                  style={styles.inputBackground}
                  imageStyle={{ borderRadius: 7 }}
                  >
                <TextInput
                  value={groupPassword}
                  onChangeText={setGroupPassword}
                  style={styles.input}
                />
                </ImageBackground>
                </View>
                <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>그룹 코드</Text>
                <ImageBackground
                  source={require("../assets/images/inputBox.png")}
                  style={styles.inputBackground}
                  imageStyle={{ borderRadius: 7 }}
                  >
                <TextInput
                  value={groupCode}
                  editable={false}
                  style={styles.input}
                />
                <TouchableOpacity onPress={handleCopyCode}>
                  <ImageBackground source={require("../assets/images/Copy.png")} style={styles.copyIcon} />
                </TouchableOpacity>
                </ImageBackground>
                </View>
                <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleCreateGroup}
                >
                  <Text style={styles.actionButtonText}>생성</Text>
                </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>그룹 코드</Text>
                <ImageBackground
                  source={require("../assets/images/inputBox.png")}
                  style={styles.inputBackground}
                  imageStyle={{ borderRadius: 7 }}
                  >
                <TextInput
                  onChangeText={setGroupCode}
                  style={styles.input}
                />
                </ImageBackground>
                </View>
                <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>그룹 비밀번호</Text>
                <ImageBackground
                  source={require("../assets/images/inputBox.png")}
                  style={styles.inputBackground}
                  imageStyle={{ borderRadius: 7 }}
                  >
                <TextInput
                  value={groupPassword}
                  onChangeText={setGroupPassword}
                  style={styles.input}
                />
                </ImageBackground>
                </View>
                <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleJoinGroup}
                >
                  <Text style={styles.actionButtonText}>참가</Text>
                </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          </TouchableWithoutFeedback>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default GroupListScreen;