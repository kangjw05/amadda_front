import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  ImageBackground,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import Swipeable from "react-native-gesture-handler/Swipeable";
import api from "../api";

import styles from "../styles/GroupListScreenStyles";
import Header from "../components/header";
import { groups } from "../Colors";
import { AuthContext } from "../context/AuthContext";

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
  const { userInfo } = useContext(AuthContext);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState("create"); // "create" or "join"
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState(generateRandomCode());
  const [groupPassword, setGroupPassword] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    loadGroups();
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

  const handleCopyCode = () => {
    Clipboard.setStringAsync(groupCode);
  };

  const handleCreateGroup = async () => {
    if (groupName.trim() === "") {
      Alert.alert("그룹명 미입력", "그룹 이름을 입력해주세요.", [{ text: "확인" }]);
      return;
    }
    if (groupPassword.trim() === "") {
      Alert.alert("비밀번호 미입력", "비밀번호를 입력해주세요.", [{ text: "확인" }]);
      return;
    }

    try {
      const response = await api.post("/group/create_group", {
        name: groupName,
        password: groupPassword,
        group_color: "group10",
      });

      const newCode = response.data.code;

      const newGroup = {
        name: groupName,
        creator: userInfo?.name || "알수없음",
        code: newCode,
        password: groupPassword,
        colorKey: "group10",
      };

      setGroupList((prev) => [...prev, newGroup]);
      closeModal();
    } catch (error) {
      console.error("그룹 생성 실패:", error);
      Alert.alert("에러", "그룹 생성에 실패했습니다.");
    }
  };

  const handleJoinGroup = async () => {
    if (groupCode.trim() === "" || groupPassword.trim() === "") {
      Alert.alert("입력 필요", "코드와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await api.post("/group/register", {
        code: groupCode,
        password: groupPassword,
      });

      const { exists, passwordMatch } = response.data;

      if (!exists) {
        Alert.alert("오류", "존재하지 않는 그룹 코드입니다.");
        return;
      }
      if (!passwordMatch) {
        Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
        return;
      }

      await loadGroups();
      closeModal();
    } catch (error) {
      console.error("그룹 참가 실패:", error);
      Alert.alert("에러", "그룹 참가에 실패했습니다.");
    }
  };

  const loadGroups = async () => {
    try {
      const infoResponse = await api.get("/users/info");
      const myGroupCodes = infoResponse.data.groups || [];

      const detailedGroups = await Promise.all(
        myGroupCodes.map(async (g) => {
          const detailResponse = await api.get("/group/search_group", {
            params: { code: g.code },
          });
          const groupData = detailResponse.data;
          return {
            name: groupData.name,
            creator: groupData.creator,
            code: groupData.code,
            colorKey: groupData.group_color,
          };
        })
      );

      setGroupList(detailedGroups);
    } catch (error) {
      console.error("그룹 리스트 불러오기 실패:", error);
      Alert.alert("에러", "그룹 리스트를 불러오지 못했습니다.");
    }
  };

  const renderRightActions = (group) => (
    <TouchableOpacity
      style={styles.leaveButton}
      onPress={() => handleLeaveGroup(group)}
    >
      <Text style={styles.leaveButtonText}>나가기</Text>
    </TouchableOpacity>
  );

  const handleLeaveGroup = async (group) => {
    if (group.creator === userInfo?.name) {
      // 생성자인 경우 삭제
      Alert.alert(
        "그룹 삭제",
        `"${group.name}" 그룹의 생성자입니다.\n이 그룹을 삭제하려면 확인 버튼을 누르세요.`,
        [
          { text: "취소", style: "cancel" },
          {
            text: "확인",
            style: "destructive",
            onPress: () => {
              Alert.prompt(
                "그룹 이름 확인",
                `그룹 이름을 정확히 입력하면 삭제됩니다.`,
                [
                  { text: "취소", style: "cancel" },
                  {
                    text: "삭제",
                    style: "destructive",
                    onPress: async (inputText) => {
                      if (inputText.trim() !== group.name) {
                        Alert.alert("오류", "입력한 이름이 그룹 이름과 일치하지 않습니다.");
                        return;
                      }
                      try {
                        const response = await api.post("/group/del_group", {
                          code: group.code,
                        });
                        if (response.data.success) {
                          await loadGroups();
                          Alert.alert("완료", `"${group.name}" 그룹이 삭제되었습니다.`);
                        } else {
                          Alert.alert("에러", "그룹 삭제에 실패했습니다.");
                        }
                      } catch (error) {
                        console.error("그룹 삭제 실패:", error);
                        Alert.alert("에러", "그룹 삭제 중 오류가 발생했습니다.");
                      }
                    },
                  },
                ],
                "plain-text"
              );
            },
          },
        ]
      );
    } else {
      // 참여자인 경우 나가기
      Alert.alert(
        "그룹 나가기",
        `"${group.name}" 그룹을 나가시겠습니까?`,
        [
          { text: "취소", style: "cancel" },
          {
            text: "나가기",
            style: "destructive",
            onPress: async () => {
              try {
                const response = await api.post("/group/out_group", {
                  code: group.code,
                });
                if (response.data.success) {
                  await loadGroups();
                  Alert.alert("완료", `"${group.name}" 그룹에서 나갔습니다.`);
                } else {
                  Alert.alert("에러", "그룹 나가기 실패");
                }
              } catch (error) {
                console.error("그룹 나가기 실패:", error);
                Alert.alert("에러", "그룹 나가기에 실패했습니다.");
              }
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* 리스트 헤더 */}
      <View style={styles.topBar}>
        <Text style={styles.headText}>그룹</Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
          {isSearchVisible && (
            <View style={{ width: "60%" }}>
              <TextInput
                placeholder="검색"
                value={searchText}
                onChangeText={setSearchText}
                style={styles.searchInput}
                maxLength={16}
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
      {/* ... (기존 모달 그대로) */}

      <FlatList
        data={groupList.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.creator.toLowerCase().includes(searchText.toLowerCase())
        )}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => {
          const colorTheme = groups[item.colorKey];
          return (
            <Swipeable renderRightActions={() => renderRightActions(item)}>
              <TouchableOpacity style={styles.groupItem}>
                <View
                  style={[
                    styles.groupIconContainer,
                    { backgroundColor: colorTheme.checkbox },
                  ]}
                >
                  <Image
                    source={require("../assets/images/groupIcon.png")}
                    style={styles.groupIcon}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.groupInfo}>
                  <Text style={[styles.groupName, { color: colorTheme.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.groupCreator, { color: colorTheme.text }]}>
                    {item.creator}
                  </Text>
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
