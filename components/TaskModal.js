import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";

const TaskModal = ({ isVisible, add, hide }) => {
  const [content, setContent] = useState("");

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={hide}
      avoidKeyboard
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.title}>새로운 할 일</Text>
        <TextInput
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholder="할 일을 입력해 주세요"
          placeholderTextColor="#A09DBB"
          style={styles.input}
          onSubmitEditing={() => {
            if (content.trim()) {
              add(content);
              setContent("");
            }
          }}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (content.trim()) {
              add(content);
              setContent("");
            }
          }}
        >
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={hide}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    margin: 20,
  },
  container: {
    backgroundColor: "#F0F0FF", // 은은한 보라색 배경
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B0082", // 인디고 색상
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#9370DB", // 연한 보라색 테두리
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: "#4B0082",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addButton: {
    backgroundColor: "#9370DB", // 중간 보라색
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#D3D3D3", // 연한 회색
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#4B0082",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TaskModal;
