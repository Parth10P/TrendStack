import React, { useEffect, useState } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";
import { userAPI } from "../services/api";

const getAvatarSource = (name, avatarUrl) => ({
  uri:
    avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "User"
    )}&background=0D8ABC&color=fff`,
});

export default function ProfileScreen({ navigation, user, onLogout }) {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [displayedUser, setDisplayedUser] = useState(user);
  const [modalVisible, setModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayedUser(user);
  }, [user]);

  const openEditModal = () => {
    setEditName(displayedUser?.name || "");
    setEditEmail(displayedUser?.email || "");
    setModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert("Error", "Name and email are required.");
      return;
    }

    setSaving(true);

    try {
      const updatedData = {
        name: editName.trim(),
        email: editEmail.trim(),
        username: displayedUser?.username,
      };

      const response = await userAPI.updateProfile(updatedData);
      setDisplayedUser({ ...displayedUser, ...response.user });
      setModalVisible(false);
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Error", error.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const activityStats = [
    { label: "Posts", value: "120", icon: "document-text-outline" },
    { label: "Followers", value: "4.5k", icon: "people-outline" },
    { label: "Following", value: "380", icon: "person-add-outline" },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={[
              styles.headerIconButton,
              {
                borderColor: theme.border,
                backgroundColor:
                  theme.type === "dark" ? theme.surface : theme.cardBackground,
              },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={theme.icon} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Profile
          </Text>
          <TouchableOpacity
            style={[
              styles.headerIconButton,
              {
                borderColor: theme.border,
                backgroundColor:
                  theme.type === "dark" ? theme.surface : theme.cardBackground,
              },
            ]}
            onPress={openEditModal}
          >
            <Ionicons name="create-outline" size={18} color={theme.icon} />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={theme.gradient || [theme.primary, theme.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <Text style={styles.heroLabel}>Creator space</Text>
            <TouchableOpacity style={styles.heroChip} onPress={openEditModal}>
              <Ionicons name="create-outline" size={15} color="#fff" />
              <Text style={styles.heroChipText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heroTitle}>Your public identity on TrendStack</Text>
          <Text style={styles.heroSubtitle}>
            Keep your profile polished so people know what you post about.
          </Text>
        </LinearGradient>

        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Image
            source={getAvatarSource(
              displayedUser?.name,
              displayedUser?.profile?.avatarUrl
            )}
            style={[
              styles.avatar,
              {
                borderColor: theme.type === "dark" ? theme.surface : "#ffffff",
              },
            ]}
          />

          <Text style={[styles.name, { color: theme.text }]}>
            {displayedUser?.name || "User"}
          </Text>
          <Text style={[styles.handle, { color: theme.textSecondary }]}>
            @{displayedUser?.username || "username"}
          </Text>
          <Text style={[styles.bio, { color: theme.textSecondary }]}>
            {displayedUser?.profile?.bio || "Digital enthusiast and trend setter"}
          </Text>

          <View style={styles.statsContainer}>
            {activityStats.map((item) => (
              <View
                key={item.label}
                style={[
                  styles.statCard,
                  {
                    backgroundColor:
                      theme.type === "dark" ? theme.surface : "#f8fafc",
                    borderColor: theme.border,
                  },
                ]}
              >
                <Ionicons name={item.icon} size={18} color={theme.primary} />
                <Text style={[styles.statValue, { color: theme.text }]}>
                  {item.value}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.infoSection,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Account details
          </Text>

          <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
            <Ionicons name="mail-outline" size={20} color={theme.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Email
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {displayedUser?.email || "No email added"}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="person-outline" size={20} color={theme.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Username
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                @{displayedUser?.username || "username"}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.settingsSection,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Preferences
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIconWrap,
                  {
                    backgroundColor:
                      theme.type === "dark" ? theme.surface : "#eef8f2",
                  },
                ]}
              >
                <Ionicons
                  name={isDarkMode ? "moon" : "sunny-outline"}
                  size={18}
                  color={theme.primary}
                />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: theme.text }]}>
                  Dark mode
                </Text>
                <Text
                  style={[styles.settingHint, { color: theme.textSecondary }]}
                >
                  Switch the app mood for day or night use.
                </Text>
              </View>
            </View>

            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: "#d7dbe2", true: "#abefc6" }}
              thumbColor={isDarkMode ? theme.primary : "#ffffff"}
            />
          </View>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.primaryAction, { backgroundColor: theme.primary }]}
            onPress={openEditModal}
          >
            <Ionicons name="create-outline" size={18} color={theme.onPrimary} />
            <Text
              style={[styles.primaryActionText, { color: theme.onPrimary }]}
            >
              Edit profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryAction,
              {
                backgroundColor:
                  theme.type === "dark"
                    ? "rgba(255, 113, 108, 0.12)"
                    : "#ffefef",
                borderColor:
                  theme.type === "dark"
                    ? "rgba(255, 113, 108, 0.2)"
                    : "#ffd7d7",
              },
            ]}
            onPress={onLogout}
          >
            <Ionicons name="log-out-outline" size={18} color={theme.danger} />
            <Text style={[styles.secondaryActionText, { color: theme.danger }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
          <View
            style={[styles.modalHeader, { borderBottomColor: theme.border }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Edit Profile
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={theme.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      theme.type === "dark" ? theme.surface : theme.cardBackground,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      theme.type === "dark" ? theme.surface : theme.cardBackground,
                    borderColor: theme.border,
                    color: theme.text,
                  },
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
              style={[
                styles.saveButton,
                { backgroundColor: theme.primary, opacity: saving ? 0.7 : 1 },
              ]}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              <Text style={[styles.saveButtonText, { color: theme.onPrimary }]}>
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
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  hero: {
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 28,
    padding: 20,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  heroLabel: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  heroChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  heroChipText: {
    color: "#ffffff",
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "700",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    lineHeight: 21,
  },
  profileCard: {
    marginHorizontal: 18,
    marginTop: -24,
    borderRadius: 26,
    borderWidth: 1,
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 18,
    alignItems: "center",
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 4,
    marginTop: -54,
    marginBottom: 14,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },
  handle: {
    fontSize: 14,
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 18,
    paddingHorizontal: 6,
  },
  statsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  infoSection: {
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  infoTextContainer: {
    marginLeft: 14,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  settingsSection: {
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  settingIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
  },
  settingHint: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionSection: {
    marginHorizontal: 18,
    marginTop: 18,
  },
  primaryAction: {
    height: 52,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  primaryActionText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryAction: {
    height: 52,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryActionText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "700",
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  formContainer: {
    padding: 18,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
  },
  saveButton: {
    height: 52,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
