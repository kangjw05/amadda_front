import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  ImageBackground,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import Swipeable from "react-native-gesture-handler/Swipeable";
import AsyncStorage from "@react-native-async-storage/async-storage";



import styles from "../styles/GroupListScreenStyles";
import Header from "../components/header";
import { groups } from "../Colors";

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
    Clipboard.setStringAsync(groupCode);
  }
  const [groupList, setGroupList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  useEffect(() => {
    loadGroupsFromStorage();
  }, []);

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
    if (groupName.trim() === "") {
    Alert.alert(
      "그룹명 미입력", 
      "그룹 이름을 입력해주세요.",
      [{text: "확인"}]
    );
    return;
  }
    if (groupPassword.trim() === "") {
      Alert.alert(
        "비밀번호 미입력",
        "비밀번호를 입력해주세요.",
      [{text: "확인"}]
      );
      return;
    }
    // 그룹 생성 로직
    console.log("그룹 생성:", groupName);
    const newGroup = {
      name: groupName,
      creator: "마정우",
      code: groupCode,
      password: groupPassword,
      colorKey: "group10",
    };
    const updatedGroups = [...groupList, newGroup];

    setGroupList(updatedGroups); // 그룹 목록에 추가
    saveGroupsToStorage(updatedGroups);
    closeModal();
  };

  const handleJoinGroup = () => {
    // 그룹 참가 로직
    console.log("그룹 참가:", groupCode, groupPassword);
    closeModal();
  };

  const saveGroupsToStorage = async (groups) => {
    try {
      await AsyncStorage.setItem("groupList", JSON.stringify(groups));
    } catch (error) {
      console.error("그룹 저장 실패:", error);
    }
  };

  const loadGroupsFromStorage = async () => {
    try {
      const storedGroups = await AsyncStorage.getItem("groupList");
      if (storedGroups !== null) {
        setGroupList(JSON.parse(storedGroups));
      }
    } catch (error) {
      console.error("그룹 불러오기 실패:", error);
    }
  };

  const renderRightActions = (group) => {
  return (
    <TouchableOpacity
      style={styles.leaveButton}
      onPress={() => handleLeaveGroup(group)}
    >
      <Text style={styles.leaveButtonText}>나가기</Text>
    </TouchableOpacity>
  );
};

  const handleLeaveGroup = (group) => {
    Alert.alert(
      "그룹 나가기",
      `"${group.name}" 그룹을 나가시겠습니까?`,
      [
        {text: "취소", style: "cancel"},
        {text: "나가기",
          style: "destructive",
          onPress: () => {
            const updatedGroups = groupList.filter(g => g.code !== group.code);
            setGroupList(updatedGroups);
            saveGroupsToStorage(updatedGroups);
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* 리스트 헤더 */}
      <View style={styles.topBar}>
        <Text style={styles.headText}>그룹</Text>
        <View style={{
          flexDirection: "row", 
          alignItems: "center",
          justifyContent: "flex-end",
         }}>
        {isSearchVisible && (
          <View style={{ width: "60%" }}>
          <TextInput
            placeholder="검색"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
          </View>
        )}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
        onPress={() => setIsSearchVisible(!isSearchVisible)}
        style={styles.addButton}
        >
          <Image
            source={require("../assets/images/searchIcon.png")}
            style={styles.searchIcon}
          />
          </TouchableOpacity>
        <TouchableOpacity onPress={openModal} style={styles.addButton}>
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
        </View>
        </View>
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
                  maxLength={20}
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
                  maxLength={20}
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
                  maxLength={6}
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
                  maxLength={20}
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
      <FlatList
        data={groupList.filter(item =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.creator.toLowerCase().includes(searchText.toLowerCase())
        )}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => {
          const colorTheme = groups[item.colorKey];
          return (
            <Swipeable renderRightActions={() => renderRightActions(item)}>
            <TouchableOpacity style={styles.groupItem}>
              <View style={[styles.groupIconContainer, { backgroundColor: colorTheme.checkbox }]}>
                <Image
                  source={require("../assets/images/groupIcon.png")} 
                  style={styles.groupIcon}
                  resizeMode="contain"
                >
                </Image>
              </View>
              <View style={styles.groupInfo}>
                <Text style={[styles.groupName, { color: colorTheme.text }]}>{item.name}</Text>
                <Text style={[styles.groupCreator, { color: colorTheme.text }]}>{item.creator}</Text>
              </View>
              <View style={styles.groupCodeContainer}>
              </View>
            </TouchableOpacity>
            </Swipeable>
          );
        }}
        />
    </View>
  );
};

export default GroupListScreen;