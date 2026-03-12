import React from "react";
import { TouchableOpacity, StyleSheet, Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const ProfileButton = ({ onPress, userImage }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor:
            theme.type === "dark" ? theme.surface : theme.cardBackground,
          borderColor: theme.border,
        },
      ]}
    >
      {userImage ? (
        <Image source={{ uri: userImage }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="person-circle-outline" size={24} color={theme.icon} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 42,
    height: 42,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileButton;
