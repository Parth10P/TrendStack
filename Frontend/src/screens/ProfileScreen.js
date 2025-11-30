import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function ProfileScreen({ navigation, user, onLogout }) {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
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
                source={{
                  uri:
                    user?.profile?.avatarUrl ||
                    "https://ui-avatars.com/api/?name=" +
                      (user?.name || "User") +
                      "&background=0D8ABC&color=fff",
                }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.name, { color: theme.text }]}>{user?.name || "User"}</Text>
            <Text style={[styles.bio, { color: theme.textSecondary }]}>
              {user?.profile?.bio || "No bio available"}
            </Text>
          </View>

          <View style={styles.infoSection}>
            <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
              <Ionicons name="mail-outline" size={24} color={theme.iconSecondary} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Email</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {user?.email || "No email"}
                </Text>
              </View>
            </View>

            <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
              <Ionicons name="call-outline" size={24} color={theme.iconSecondary} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Phone</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {user?.profile?.phone || "No phone number"}
                </Text>
              </View>
            </View>
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
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.cardBackground }]}>
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
});
