import React from "react";
import { TouchableOpacity, StyleSheet, Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProfileButton = ({ onPress, userImage }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {userImage ? (
        <Image source={{ uri: userImage }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="person-circle-outline" size={28} color="#111" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileButton;
