import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";

import styles from "../styles/GroupScreenStyles";
import { themeColors, groups } from "../Colors";
import Header from "../components/header";
import api from "../api";

const GroupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { group } = route.params;

  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRole, setSelectedRole] = useState("그룹원");
  const [groupPassword, setGroupPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);const [groupNameInput, setGroupNameInput] = useState(group.name); // 화면 표시용
  const [groupName, setGroupName] = useState(group.name);
  const [editingGroupName, setEditingGroupName] = useState(""); // 편집용
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const [groupColor, setGroupColor] = useState(group.colorKey);

  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [memberListModalVisible, setMemberListModalVisible] = useState(false);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [selectedColorKey, setSelectedColorKey] = useState(group.colorKey);
  const [myRole, setMyRole] = useState();
  const [members, setMembers] = useState([]);

  const openMenuModal = () => {
    // 다른 모달 닫기
    setMemberListModalVisible(false);
    setAddMemberModalVisible(false);
    setColorModalVisible(false);
    setIsPermissionModalVisible(false);
    
    // 메뉴 모달 열기
    setMenuModalVisible(true);
  };

  const closeMenuModal = () => setMenuModalVisible(false);

  const fetchAuth = async () => {
    try {
      const res = await api.get("/group/my_auth", {
        params: { code: group.code },
      });
      setMyRole(res.data);
    } catch (err) {
      console.error("권한 확인 실패:", err);
    }
  };

  const fetchGroupInfo = async () => {
    try {
      const res = await api.get("/group/search_group", {
        params: { code: group.code },
      });
      const data = res.data;
      setGroupName(data.name);
      setGroupColor(data.group_color);
    } catch (err) {
      console.error("그룹 정보 불러오기 실패:", err);
    }
  };

  const fetchGroupPassword = async () => {
    try {
      const res = await api.get("/group/group_pass", {
        params: { code: group.code },
      });
      setGroupPassword(res.data.password); // 서버에서 받아온 평문 비밀번호
      console.log(res.data)
    } catch (err) {
      console.error("그룹 비밀번호 가져오기 실패:", err);
      console.error("그룹 비밀번호 가져오기 실패:", err.data);
      console.error("그룹 비밀번호 가져오기 실패:", err.status);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await api.get("/group/group_members", {
        params: { code: group.code },
      });

      const sorted = res.data.sort((a, b) => {
        if (a.auth !== b.auth) return a.auth - b.auth;
        return a.name.localeCompare(b.name, "ko");
      });
      setMembers(sorted);
    } catch (err) {
      console.error("그룹 멤버 조회 실패:", err);
    }
  };

  const handleSavePermission = async () => {
    if (!selectedMember) return;
    const roleInt = selectedRole === "관리자" ? 1 : 2;

    try {
      await api.post("/group/update_auth", {
        code: group.code,
        uuid: selectedMember.uuid,
        auth: roleInt,
      });
      console.log("권한 변경 완료");
      fetchMembers();
      setIsPermissionModalVisible(false);
    } catch (err) {
      console.error("권한 변경 실패:", err);
    }
  };

  const canEditPermission = () => {
    if (!selectedMember) return false;
    if (selectedMember.auth === 0) return false;
    if (myRole === 0) return true;
    if (myRole === 1 && selectedMember.auth === 2) return true;
    return false;
  };

  const saveGroupName = async () => {
    const trimmedName = editingGroupName.trim();
    if (trimmedName === "") {
      Alert.alert("이름 입력 오류", "그룹 이름을 입력해주세요.");
      setIsEditingGroupName(false);
      return;
    }

    try {
      await api.post("/group/change_info", {
        code: group.code,
        name: trimmedName,
        color: groupColor,
      });

      setGroupName(trimmedName); // 화면 표시용 상태 갱신
      setIsEditingGroupName(false);
      Alert.alert("변경 완료", "그룹 이름이 변경되었습니다.");
    } catch (error) {
      console.error("그룹 이름 변경 실패:", error);
      Alert.alert("오류", "그룹 이름 변경에 실패했습니다.");
      setIsEditingGroupName(false);
    }
  };

  const saveGroupColor = async () => {
    console.log("선택된 색상:", selectedColorKey);

    try {
      // 요청 보내기
      await api.post("/group/change_info", {
        code: group.code,
        name: groupNameInput,
        color: selectedColorKey, // 중요: groups 색상 키
      });

      fetchGroupInfo();
      setGroupColor(selectedColorKey);
      Alert.alert("변경 완료", "그룹 색상이 변경되었습니다.");
      setColorModalVisible(false);
    } catch (error) {
      if (error.response) {
        console.error("서버 응답 오류:", error.response.data);
        Alert.alert(
          "업데이트 실패",
          error.response.data?.detail || "그룹 색상 변경 실패"
        );
      } else {
        console.error("네트워크 오류:", error);
        Alert.alert("오류", "서버에 연결할 수 없습니다.");
      }
    }
  };

  const handleLeaveGroup = async (group) => {
    if (myRole === 0) {
      // 그룹장일 경우 그룹 삭제
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
                        if (response.status === 200) {
                          Alert.alert("완료", `"${group.name}" 그룹이 삭제되었습니다.`);
                          navigation.navigate("GroupListScreen", { refresh: true });
                        } else {
                          Alert.alert("에러", "그룹 삭제에 실패했습니다.");
                        }
                      } catch (error) {
                        console.error("그룹 삭제 실패:", error.response?.data || error.message);
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
      // 그룹원/관리자일 경우 그룹 나가기
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
                if (response.status === 200) {
                  Alert.alert("완료", `"${group.name}" 그룹에서 나갔습니다.`);
                  navigation.navigate("GroupListScreen", { refresh: true });
                } else {
                  Alert.alert("에러", "그룹 나가기에 실패했습니다.");
                }
              } catch (error) {
                console.error("그룹 나가기 실패:", error.response?.data || error.message);
                Alert.alert("에러", "그룹 나가기에 실패했습니다.");
              }
            },
          },
        ]
      );
    }
  };

  const handleCopyGroupInfo = () => {
    const textToCopy = `${groupName} 그룹에 초대합니다.\n그룹 코드: ${group.code}\n그룹 비밀번호: ${groupPassword}`;
    Clipboard.setStringAsync(textToCopy);
    Alert.alert("복사 완료", "그룹 정보가 클립보드에 복사되었습니다.");
  };

  useEffect(() => {
    fetchAuth();
    fetchMembers();
    fetchGroupPassword();
    fetchGroupInfo();
  }, []);

  return (
    <View style={styles.container}>
      <Header />

      {/* 상단 헤더 */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Image source={require("../assets/images/backArrow.png")} style={styles.iconImage} />
        </TouchableOpacity>

        <Text style={styles.headText}>{groupName}</Text>

        <TouchableOpacity onPress={openMenuModal} style={styles.iconButton}>
          <Image source={require("../assets/images/menuIcon.png")} style={styles.iconImage} />
        </TouchableOpacity>
      </View>

      {/* 메뉴 모달 */}
      {menuModalVisible && (
        <TouchableWithoutFeedback onPress={closeMenuModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuModalContainer}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuModalVisible(false);
                    setMemberListModalVisible(true);
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={require("../assets/images/groupIcon.png")} style={styles.icon} />
                    <Text style={styles.menuItemText}>그룹원 목록</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuModalVisible(false);
                    setAddMemberModalVisible(true);
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={require("../assets/images/infoIcon.png")} style={styles.infoIcon} />
                    <Text style={styles.menuItemText}>그룹 정보</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuModalVisible(false);
                    setColorModalVisible(true);
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={require("../assets/images/penIcon.png")} style={styles.icon} />
                    <Text style={styles.menuItemText}>그룹색 변경</Text>
                  </View>
                </TouchableOpacity>
                {myRole !== undefined && (
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuModalVisible(false);
                      handleLeaveGroup(group);
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        source={
                          myRole === 0
                            ? require("../assets/images/trashIcon.png")
                            : require("../assets/images/logoutIcon.png")
                        }
                        style={styles.trashIcon}
                      />
                      <Text
                        style={[
                          styles.menuItemText,
                          { color: themeColors.sunday }
                        ]}
                      >
                        {myRole === 0 ? "그룹 삭제" : "그룹 나가기"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* 그룹원 목록 모달 */}
      {memberListModalVisible && (
        <TouchableWithoutFeedback onPress={() => setMemberListModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuModalContainer}>
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomColor: themeColors.text,
                  borderBottomWidth: 1.5,
                }}>
                  <Image source={require("../assets/images/groupIcon.png")} style={styles.icon} />
                  <Text style={styles.menuItemText}>그룹원 목록</Text>
                </View>
                <ScrollView style={{ maxHeight: 300 }}>
                {members.map((member) => {
                  const icon =
                    member.auth === 0
                      ? require("../assets/images/startIcon.png")
                      : member.auth === 1
                      ? require("../assets/images/shieldIcon.png")
                      : require("../assets/images/authPersonIcon.png");

                  return (
                    <TouchableOpacity
                      key={member.uuid}
                      style={styles.menuItem}
                      onPress={() => {
                        setSelectedMember(member);
                        setSelectedRole(
                          member.auth === 0
                            ? "그룹장"
                            : member.auth === 1
                            ? "관리자"
                            : "그룹원"
                        );
                        setIsPermissionModalVisible(true);
                      }}
                    >
                      <Image source={icon} style={styles.subIcon} />
                      <Text style={styles.itemText}>{member.name}</Text>
                    </TouchableOpacity>
                  );
                })}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* 권한 설정 모달 */}
      <Modal
        visible={isPermissionModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsPermissionModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsPermissionModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.authModalHeader}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={
                        selectedMember?.auth === 0
                          ? require("../assets/images/startIcon.png")
                          : selectedMember?.auth === 1
                          ? require("../assets/images/shieldIcon.png")
                          : require("../assets/images/authPersonIcon.png")
                      }
                      style={[styles.subIcon, { marginRight: 6 }]}
                    />
                    <Text style={[styles.inputLabel, { fontSize: 20 }]}>
                      {selectedMember?.name}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderBottomColor: themeColors.highlight,
                    borderBottomWidth: 1,
                    marginVertical: 10,
                  }}
                />
                <Text style={styles.infoLabel}>그룹 권한</Text>
                {canEditPermission() ? (
                  <View style={styles.inputBackground}>
                    <Picker
                      selectedValue={selectedRole}
                      onValueChange={(value) => setSelectedRole(value)}
                      style={{ flex: 1, color: themeColors.highlight }}
                      dropdownIconColor={themeColors.highlight}
                    >
                      <Picker.Item label="그룹원" value="그룹원" />
                      <Picker.Item label="관리자" value="관리자" />
                    </Picker>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.infoInputRow,
                      { justifyContent: "center", paddingHorizontal: 10 },
                    ]}
                  >
                    <Text style={{ color: themeColors.highlight, fontSize: 16 }}>
                      {selectedMember?.auth === 0
                        ? "그룹장"
                        : selectedMember?.auth === 1
                        ? "관리자"
                        : "그룹원"}
                    </Text>
                  </View>
                )}
                <View style={styles.buttonContainer}>
                  {canEditPermission() && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={handleSavePermission}
                    >
                      <Text style={styles.actionButtonText}>저장</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 그룹 정보 모달 */}
      <Modal
        visible={addMemberModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditingGroupName(false)}
      >
        <TouchableWithoutFeedback onPress={() => {
          setAddMemberModalVisible(false);
          setIsEditingGroupName(false);
          }}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.groupInfoModal}>
                <View style={{borderBottomColor: themeColors.text, borderBottomWidth: 2}}>
                <Text style={[styles.inputLabel, { fontSize: 18, marginBottom: 12 }]}>그룹 정보</Text>
                </View>
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>그룹 이름</Text>
                  <View style={styles.infoInputRow}>
                    {isEditingGroupName ? (
                      <TextInput
                        placeholder={groupName}
                        value={editingGroupName}
                        onChangeText={setEditingGroupName}
                        onSubmitEditing={saveGroupName}  // 엔터 누르면 저장
                        autoFocus
                        style={styles.infoText}
                        maxLength={10}
                      />
                    ) : (
                      <>
                        <Text style={styles.infoText}>{groupName}</Text>
                        <TouchableOpacity
                          onPress={() => {
                            setEditingGroupName(""); // 빈칸으로 시작
                            setIsEditingGroupName(true);
                          }}
                        >
                          <Image
                            source={require("../assets/images/pencilIcon.png")}
                            style={{ width: 20, height: 20 }}
                          />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>그룹 코드</Text>
                  <View style={styles.infoInputRow}>
                    <Text style={styles.infoText}>{group.code}</Text>
                  </View>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>그룹 비밀번호</Text>
                  <View style={styles.infoInputRow}>
                    <Text style={styles.infoText}>
                      {showPassword ? groupPassword : "*".repeat(groupPassword.length)}
                    </Text>
                    <TouchableOpacity 
                    style={styles.iconButtonSmall}
                    onPress={() => setShowPassword(!showPassword)}
                    >
                      <Image
                        source={
                          showPassword
                            ? require("../assets/images/eyeOffIcon.png")
                            : require("../assets/images/eyeIcon.png")}
                        style={{ width: 24, height: 24, resizeMode: "contain" }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={handleCopyGroupInfo}
                >
                  <Text style={styles.copyButtonText}>복사</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/* 그룹 색 변경 모달 */}
      <Modal
        visible={colorModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setColorModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setColorModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>그룹 색상 변경</Text>
                </View>
                <View style={styles.colorGrid}>
                  {Object.keys(groups).map((key) => (
                    <TouchableOpacity
                      key={key}
                      onPress={() => setSelectedColorKey(key)}
                      style={styles.colorCircleWrapper}
                    >
                      <View
                        style={[
                          styles.colorCircle,
                          { backgroundColor: groups[key].checkbox },
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
                    onPress={() => setColorModalVisible(false)}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.actionButtonText}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={saveGroupColor}
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
    </View>
  );
};

export default GroupScreen;
