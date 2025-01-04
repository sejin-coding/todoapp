import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const DeleteButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.button}
    >
      <Text style={styles.text}>삭제</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FE5746",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, // 좌우 여백
    paddingVertical: 10, // 상하 여백
    borderRadius: 8, // 모서리 둥글게
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default DeleteButton;
