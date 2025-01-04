import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Swipeable from "react-native-gesture-handler/Swipeable";

const TodoItem = ({ title, done, remove, toggle }) => {
  const swipeableRef = useRef(null);

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            if (swipeableRef.current) {
              swipeableRef.current.close();
            }
            remove();
          }}
        >
          <Text style={styles.deleteText}>삭제</Text>
        </TouchableOpacity>
      )}
    >
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggle}
          style={[styles.check, done && styles.done]}
        >
          <FontAwesome
            name="check"
            color={done ? "#FFFFFF" : "#E0E0E0"}
            size={14}
          />
        </TouchableOpacity>
        <Text style={[styles.title, done && styles.titleDone]}>{title}</Text>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    color: "#4B0082",
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: "#B0B0B0",
  },
  check: {
    borderWidth: 1,
    borderColor: "#9370DB",
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  done: {
    backgroundColor: "#9370DB",
  },
  deleteButton: {
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 55, // 부모 높이에 맞춤
    borderRadius: 8,
  },
  deleteText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TodoItem;
