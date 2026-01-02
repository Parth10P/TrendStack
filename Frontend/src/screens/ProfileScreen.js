import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { userAPI } from "../services/api";

import darkModeProfileLogo from "../../assets/dark_mode_profile_logo.png";

export default function ProfileScreen({ navigation, user, onLogout }) {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  
  // Local state for user to allow immediate UI updates
  const [displayedUser, setDisplayedUser] = useState(user);
  
  // Edit Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayedUser(user);
  }, [user]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const openEditModal = () => {
    setEditName(displayedUser?.name || "");
    setEditEmail(displayedUser?.email || "");
    setModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert("Error", "Name and Email are required");
      return;
    }

    setSaving(true);
    try {
      const updatedData = {
        name: editName,
        email: editEmail,
        username: displayedUser?.username 
      };

      const response = await userAPI.updateProfile(updatedData);
      
      // Update local state immediately
      setDisplayedUser({ ...displayedUser, ...response.user });
      setModalVisible(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.icon} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
          <View style={{ width: 24 }} />
        </View>

          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  isDarkMode
                    ? darkModeProfileLogo
                    : {
                        uri:
                          displayedUser?.profile?.avatarUrl ||
                          "https://ui-avatars.com/api/?name=" +
                            (displayedUser?.name || "User") +
                            "&background=0D8ABC&color=fff",
                      }
                }
                style={styles.avatar}
              />

            </View>
            <Text style={[styles.name, { color: theme.text }]}>{displayedUser?.name || "User"}</Text>
            <Text style={[styles.bio, { color: theme.textSecondary }]}>
              {displayedUser?.profile?.bio || "No bio available"}
            </Text>
          </View>

          <View style={styles.infoSection}>
            <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
              <Ionicons name="mail-outline" size={24} color={theme.iconSecondary} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Email</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {displayedUser?.email || "No email"}
                </Text>
              </View>
            </View>
            
            {/* Phone Number Removed */}
        </View>

        <View style={styles.settingsSection}>
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={24} color={theme.iconSecondary} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: "#e0e0e0", true: "#bfdbfe" }}
              thumbColor={isDarkMode ? "#246bff" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.cardBackground }]}
            onPress={openEditModal}
          >
            <Text style={[styles.actionButtonText, { color: theme.text }]}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.actionButtonText, styles.logoutText]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[styles.modalContainer, { backgroundColor: theme.background }]}
        >
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={theme.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Name</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.inputBackground, 
                    borderColor: theme.inputBorder,
                    color: theme.text 
                  }
                ]}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Email</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.inputBackground, 
                    borderColor: theme.inputBorder,
                    color: theme.text 
                  }
                ]}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Enter your email"
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, { opacity: saving ? 0.7 : 1 }]}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  infoSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoTextContainer: {
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#111",
  },
  settingsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    color: "#111",
    marginLeft: 16,
  },
  actionSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  actionButton: {
    backgroundColor: "#f6f7fb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  logoutButton: {
    backgroundColor: "#ffebee",
  },
  logoutText: {
    color: "#d32f2f",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  formContainer: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#246bff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
