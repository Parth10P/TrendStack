import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
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

export default function UserProfileScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { userId, initialUser } = route.params || {};
  const [profileUser, setProfileUser] = useState(initialUser || null);
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let active = true;

    async function fetchUser() {
      try {
        setLoading(true);
        const data = await userAPI.getUserById(userId);
        if (active) {
          setProfileUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      active = false;
    };
  }, [userId]);

  const stats = [
    {
      label: "Posts",
      value: `${profileUser?._count?.posts || 0}`,
      icon: "document-text-outline",
    },
    {
      label: "Comments",
      value: `${profileUser?._count?.comments || 0}`,
      icon: "chatbubble-ellipses-outline",
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
            User Profile
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : profileUser ? (
          <>
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
              <Text style={styles.heroLabel}>Creator profile</Text>
              <Text style={styles.heroTitle}>
                {profileUser.name || "TrendStack User"}
              </Text>
              <Text style={styles.heroSubtitle}>
                Explore this creator's identity and public presence.
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
                  profileUser.name,
                  profileUser.profile?.avatarUrl
                )}
                style={styles.avatar}
              />
              <Text style={[styles.name, { color: theme.text }]}>
                {profileUser.name}
              </Text>
              <Text style={[styles.handle, { color: theme.textSecondary }]}>
                @{profileUser.username}
              </Text>
              <Text style={[styles.bio, { color: theme.textSecondary }]}>
                {profileUser.profile?.bio || "No bio added yet."}
              </Text>

              <View style={styles.statsRow}>
                {stats.map((item) => (
                  <View
                    key={item.label}
                    style={[
                      styles.statCard,
                      {
                        backgroundColor:
                          theme.type === "dark" ? theme.surface : "#f5f8fc",
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Ionicons name={item.icon} size={18} color={theme.primary} />
                    <Text style={[styles.statValue, { color: theme.text }]}>
                      {item.value}
                    </Text>
                    <Text
                      style={[styles.statLabel, { color: theme.textSecondary }]}
                    >
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>

              <View
                style={[
                  styles.infoCard,
                  {
                    backgroundColor:
                      theme.type === "dark" ? theme.surface : "#f5f8fc",
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={18} color={theme.primary} />
                  <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                    {profileUser.profile?.location || "Location not shared"}
                  </Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.loaderWrap}>
            <Text style={{ color: theme.textSecondary }}>User not found.</Text>
          </View>
        )}
      </ScrollView>
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
  headerSpacer: {
    width: 44,
  },
  loaderWrap: {
    flex: 1,
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 28,
    padding: 20,
    paddingBottom: 88,
  },
  heroLabel: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    lineHeight: 21,
  },
  profileCard: {
    marginHorizontal: 18,
    marginTop: -54,
    borderRadius: 28,
    borderWidth: 1,
    padding: 18,
    alignItems: "center",
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    marginTop: -48,
    marginBottom: 14,
    borderWidth: 4,
    borderColor: "#fff",
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 4,
  },
  handle: {
    fontSize: 14,
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 16,
  },
  statsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  infoCard: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
  },
});
