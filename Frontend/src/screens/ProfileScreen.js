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

  const infoRows = [
    {
      label: "Email",
      value: displayedUser?.email || "No email added",
      icon: "mail-outline",
    },
    {
      label: "Username",
      value: `@${displayedUser?.username || "username"}`,
      icon: "at-outline",
    },
  ];

  const cardBackground =
    theme.type === "dark" ? theme.cardBackground : theme.cardBackground;
  const softSurface = theme.type === "dark" ? theme.surface : "#f5f8fc";
  const mutedSurface = theme.type === "dark" ? "#111d36" : "#edf7f1";

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
                backgroundColor: softSurface,
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
                backgroundColor: softSurface,
              },
            ]}
            onPress={openEditModal}
          >
            <Ionicons name="create-outline" size={18} color={theme.icon} />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={
            theme.type === "dark"
              ? ["#18355f", "#1db767"]
              : ["#2bb673", "#13975e"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroGlowOne} />
          <View style={styles.heroGlowTwo} />

          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Creator profile</Text>
              <Text style={styles.heroTitle}>Make your profile feel alive.</Text>
            </View>

            <TouchableOpacity style={styles.heroChip} onPress={openEditModal}>
              <Ionicons name="create-outline" size={14} color="#fff" />
              <Text style={styles.heroChipText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.heroSubtitle}>
            A clean profile helps people trust what you post and follow you
            faster.
          </Text>
        </LinearGradient>

        <View
          style={[
            styles.identityCard,
            {
              backgroundColor: cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.identityTop}>
            <View style={styles.avatarWrap}>
              <Image
                source={getAvatarSource(
                  displayedUser?.name,
                  displayedUser?.profile?.avatarUrl
                )}
                style={[
                  styles.avatar,
                  {
                    borderColor:
                      theme.type === "dark" ? theme.background : "#ffffff",
                  },
                ]}
              />
              <View
                style={[
                  styles.onlineDot,
                  { borderColor: cardBackground, backgroundColor: "#30d158" },
                ]}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.editPill,
                {
                  backgroundColor: mutedSurface,
                  borderColor: theme.border,
                },
              ]}
              onPress={openEditModal}
            >
              <Ionicons name="brush-outline" size={15} color={theme.primary} />
              <Text style={[styles.editPillText, { color: theme.primary }]}>
                Customize
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.name, { color: theme.text }]}>
            {displayedUser?.name || "User"}
          </Text>
          <Text style={[styles.handle, { color: theme.textSecondary }]}>
            @{displayedUser?.username || "username"}
          </Text>

          <Text style={[styles.bio, { color: theme.textSecondary }]}>
            {displayedUser?.profile?.bio ||
              "Digital enthusiast and trend setter"}
          </Text>

          <View style={styles.metaRow}>
            <View
              style={[
                styles.metaChip,
                {
                  backgroundColor: softSurface,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name="sparkles-outline"
                size={14}
                color={theme.primary}
              />
              <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
                Active creator
              </Text>
            </View>

            <View
              style={[
                styles.metaChip,
                {
                  backgroundColor: softSurface,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name="globe-outline"
                size={14}
                color={theme.primary}
              />
              <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
                TrendStack
              </Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            {activityStats.map((item) => (
              <View
                key={item.label}
                style={[
                  styles.statCard,
                  {
                    backgroundColor: softSurface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statIconWrap,
                    {
                      backgroundColor: mutedSurface,
                    },
                  ]}
                >
                  <Ionicons name={item.icon} size={16} color={theme.primary} />
                </View>
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
            styles.sectionCard,
            {
              backgroundColor: cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Account details
          </Text>

          {infoRows.map((item, index) => (
            <View
              key={item.label}
              style={[
                styles.infoRow,
                index !== infoRows.length - 1 && {
                  borderBottomColor: theme.border,
                  borderBottomWidth: 1,
                },
              ]}
            >
              <View
                style={[
                  styles.infoIconWrap,
                  {
                    backgroundColor: mutedSurface,
                  },
                ]}
              >
                <Ionicons name={item.icon} size={18} color={theme.primary} />
              </View>

              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                  {item.label}
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Preferences
          </Text>

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLeft}>
              <View
                style={[
                  styles.infoIconWrap,
                  {
                    backgroundColor: mutedSurface,
                  },
                ]}
              >
                <Ionicons
                  name={isDarkMode ? "moon" : "sunny-outline"}
                  size={18}
                  color={theme.primary}
                />
              </View>

              <View style={styles.preferenceTextWrap}>
                <Text style={[styles.preferenceTitle, { color: theme.text }]}>
                  Dark mode
                </Text>
                <Text
                  style={[styles.preferenceHint, { color: theme.textSecondary }]}
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
                    : "#fff2f2",
                borderColor:
                  theme.type === "dark"
                    ? "rgba(255, 113, 108, 0.2)"
                    : "#ffd9d9",
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
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 92,
    overflow: "hidden",
  },
  heroGlowOne: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.10)",
    top: -40,
    right: -10,
  },
  heroGlowTwo: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -30,
    left: -10,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  heroLabel: {
    color: "rgba(255,255,255,0.86)",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
    maxWidth: 220,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 260,
  },
  heroChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  heroChipText: {
    color: "#ffffff",
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "700",
  },
  identityCard: {
    marginHorizontal: 18,
    marginTop: -56,
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
  },
  identityTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
  },
  onlineDot: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
  },
  editPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editPillText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "700",
  },
  name: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  handle: {
    fontSize: 15,
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 8,
  },
  metaChipText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionCard: {
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  infoIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  preferenceLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  preferenceTextWrap: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  preferenceHint: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionSection: {
    marginHorizontal: 18,
    marginTop: 18,
  },
  primaryAction: {
    height: 54,
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
    height: 54,
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
