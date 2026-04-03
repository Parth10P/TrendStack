import React, { useEffect, useMemo, useState } from "react";
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
  ActivityIndicator,
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

const getPrimaryImageUri = (attachments) => {
  if (!Array.isArray(attachments) || attachments.length === 0) {
    return null;
  }

  const imageAttachment = attachments.find(
    (attachment) => attachment?.type === "image" && attachment?.uri
  );

  return imageAttachment?.uri || null;
};

const formatCompactCount = (value = 0) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }

  return `${value}`;
};

export default function ProfileScreen({ navigation, user, onLogout }) {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [displayedUser, setDisplayedUser] = useState(user);
  const [userPosts, setUserPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayedUser(user);
  }, [user]);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!user?.id) {
        if (active) {
          setLoadingProfile(false);
        }
        return;
      }

      try {
        setLoadingProfile(true);
        const [userDetails, posts] = await Promise.all([
          userAPI.getUserById(user.id),
          userAPI.getUserPosts(user.id),
        ]);

        if (!active) {
          return;
        }

        setDisplayedUser((prev) => ({
          ...prev,
          ...userDetails,
          profile: {
            ...(prev?.profile || {}),
            ...(userDetails.profile || {}),
          },
        }));
        setUserPosts(posts || []);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        if (active) {
          setLoadingProfile(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [user?.id]);

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
      setDisplayedUser((prev) => ({
        ...prev,
        ...response.user,
        profile: {
          ...(prev?.profile || {}),
          ...(response.user?.profile || {}),
        },
      }));
      setModalVisible(false);
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Error", error.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutPress = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          if (onLogout) {
            onLogout();
          }
        },
      },
    ]);
  };

  const stats = useMemo(
    () => [
      {
        label: "Posts",
        value: formatCompactCount(displayedUser?.postsCount || userPosts.length),
        icon: "grid-outline",
      },
      {
        label: "Followers",
        value: formatCompactCount(displayedUser?.followersCount || 0),
        icon: "people-outline",
      },
      {
        label: "Following",
        value: formatCompactCount(displayedUser?.followingCount || 0),
        icon: "person-add-outline",
      },
    ],
    [displayedUser?.followersCount, displayedUser?.followingCount, displayedUser?.postsCount, userPosts.length]
  );

  const featuredPosts = userPosts.slice(0, 6);
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
              ? ["#12335d", "#1c995a", "#0f1f38"]
              : ["#2bb673", "#14865a", "#f2fbf6"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroGallery}>
            <View style={[styles.heroTile, styles.heroTileLarge]} />
            <View style={[styles.heroTile, styles.heroTileMedium]} />
            <View style={[styles.heroTile, styles.heroTileSmall]} />
          </View>
        </LinearGradient>

        <View
          style={[
            styles.profileShell,
            {
              backgroundColor: theme.background,
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
                borderColor:
                  theme.type === "dark" ? theme.background : "#ffffff",
              },
            ]}
          />

          <Text style={[styles.name, { color: theme.text }]}>
            {displayedUser?.name || "User"}
          </Text>
          <Text style={[styles.handle, { color: theme.textSecondary }]}>
            @{displayedUser?.username || "username"}
          </Text>

          <View style={styles.tagRow}>
            <Text style={[styles.tagText, { color: theme.textSecondary }]}>
              #TrendStack
            </Text>
            <Text style={[styles.tagText, { color: theme.textSecondary }]}>
              #Creator
            </Text>
            <Text style={[styles.tagText, { color: theme.textSecondary }]}>
              #Community
            </Text>
          </View>

          <Text style={[styles.bio, { color: theme.textSecondary }]}>
            {displayedUser?.profile?.bio ||
              "Digital enthusiast and trend setter"}
          </Text>

          <View style={styles.statsRow}>
            {stats.map((item) => (
              <View key={item.label} style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.text }]}>
                  {item.value}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

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
                name="location-outline"
                size={14}
                color={theme.primary}
              />
              <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
                {displayedUser?.profile?.location || "Location not added"}
              </Text>
            </View>
            <View
              style={[
                styles.metaChip,
                {
                  backgroundColor: mutedSurface,
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
                {loadingProfile ? "Loading profile" : "Profile updated"}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Posts
              </Text>
              <Text
                style={[styles.sectionSubtitle, { color: theme.textSecondary }]}
              >
                Everything you have shared on TrendStack
              </Text>
            </View>
            <View
              style={[
                styles.sectionCountPill,
                {
                  backgroundColor: softSurface,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={[styles.sectionCountText, { color: theme.primary }]}
              >
                {displayedUser?.postsCount || userPosts.length}
              </Text>
            </View>
          </View>

          {loadingProfile ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="small" color={theme.primary} />
            </View>
          ) : featuredPosts.length === 0 ? (
            <View
              style={[
                styles.emptyPostsCard,
                {
                  backgroundColor: softSurface,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={24}
                color={theme.primary}
              />
              <Text style={[styles.emptyPostsTitle, { color: theme.text }]}>
                No posts yet
              </Text>
              <Text
                style={[styles.emptyPostsText, { color: theme.textSecondary }]}
              >
                Share your first post and it will appear here.
              </Text>
            </View>
          ) : (
            <View style={styles.postsGrid}>
              {featuredPosts.map((post, index) => (
                <TouchableOpacity
                  key={post.id}
                  style={[
                    styles.postTile,
                    !getPrimaryImageUri(post.attachments) && {
                      backgroundColor:
                        index % 3 === 0
                          ? "#0f1f38"
                          : index % 3 === 1
                            ? "#1f7a5a"
                            : "#d59d3d",
                    },
                  ]}
                  onPress={() =>
                    navigation.navigate("PostDetails", {
                      postId: post.id,
                      initialPost: post,
                    })
                  }
                >
                  {getPrimaryImageUri(post.attachments) ? (
                    <Image
                      source={{ uri: getPrimaryImageUri(post.attachments) }}
                      style={styles.postTileImage}
                      resizeMode="cover"
                    />
                  ) : null}
                  <View style={styles.postTileOverlay} />
                  <Text style={styles.postTileMeta}>
                    {formatCompactCount(post.likeCount || 0)} likes
                  </Text>
                  <Text style={styles.postTileText} numberOfLines={4}>
                    {post.content}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.cardBackground,
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
                  styles.preferenceIconWrap,
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
            onPress={handleLogoutPress}
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
    padding: 18,
    height: 210,
    justifyContent: "flex-start",
  },
  heroGallery: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroTile: {
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  heroTileLarge: {
    width: "30%",
    height: 132,
  },
  heroTileMedium: {
    width: "30%",
    height: 148,
    marginTop: 8,
  },
  heroTileSmall: {
    width: "30%",
    height: 124,
    marginTop: 4,
  },
  profileShell: {
    marginTop: -52,
    alignItems: "center",
    paddingHorizontal: 22,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 4,
    marginBottom: 14,
  },
  name: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 4,
  },
  handle: {
    fontSize: 15,
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 12,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "600",
    marginHorizontal: 8,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 18,
    maxWidth: 320,
  },
  statsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  metaRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 6,
    marginBottom: 8,
  },
  metaChipText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "600",
  },
  sectionCard: {
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  sectionCountPill: {
    minWidth: 42,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  sectionCountText: {
    fontSize: 14,
    fontWeight: "800",
  },
  loaderWrap: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyPostsCard: {
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    padding: 24,
  },
  emptyPostsTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 6,
  },
  emptyPostsText: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
  },
  postsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  postTile: {
    width: "48.5%",
    minHeight: 156,
    borderRadius: 22,
    padding: 14,
    marginBottom: 12,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  postTileImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  postTileOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  postTileMeta: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 12,
    fontWeight: "700",
  },
  postTileText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
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
  preferenceIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
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
