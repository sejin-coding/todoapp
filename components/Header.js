import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Header = ({ show, openCalendar }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={openCalendar}
        style={styles.iconButton}
      >
        <Ionicons name="calendar" color="#FFFFFF" size={24} />
      </TouchableOpacity>
      <Text style={styles.title}>To-Do List</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={show}
        style={styles.button}
      >
        <Ionicons name="add" color="#FFFFFF" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#9370DB",
    paddingBottom: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4B0082",
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4B0082",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Header;
