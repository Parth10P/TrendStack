import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { userAPI } from "../services/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("Discover");
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    try {
      await userAPI.logout();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error("Logout error:", error);
      if (onLogout) {
        onLogout();
      }
    }
  };

  // Sample stories data
  const stories = [
    { id: 1, label: "Your Story", image: "👤" },
    { id: 2, label: "Story 1", image: "👟" },
    { id: 3, label: "Story 2", image: "🏃" },
    { id: 4, label: "Story 3", image: "⚡" },
    { id: 5, label: "Story 4", image: "💪" },
  ];

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <View style={styles.topBarLeft}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>P</Text> 
            {/* trend stack logo above*/}
          </View>
          <Text style={styles.appName}>TRENDSTACK</Text>
        </View>
        <View style={styles.statusIcons}>{/* profile icon */}</View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("Discover")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Discover" && styles.tabTextActive,
            ]}
          >
            Discover
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("Following")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Following" && styles.tabTextActive,
            ]}
          >
            Following
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Stories Section */}
        <View style={styles.storiesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesScroll}
          >
            {stories.map((story) => (
              <View key={story.id} style={styles.storyItem}>
                <View style={styles.storyCircle}>
                  <Text style={styles.storyEmoji}>{story.image}</Text>
                </View>
                <Text style={styles.storyLabel}>{story.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recently Post Section */}
        <View style={styles.postSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Post</Text>
            <TouchableOpacity>
              <Text style={styles.moreIcon}>⋯</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postHeaderLeft}>
                <Text style={styles.postTitle}>
                  Google's MUM Update: SEO Revolution?
                </Text>
                <Text style={styles.postDescription}>
                  Discover adventure in states SEO Revlun's regions the world
                </Text>
              </View>
              <View style={styles.postIcons}>
                <TouchableOpacity style={styles.postIcon}>
                  <Text style={styles.iconText}>📷</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postIcon}>
                  <Text style={styles.iconText}>⚙️</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Overlapping Image Cards */}
            <View style={styles.imageCardsContainer}>
              <View style={[styles.imageCard, styles.imageCard1]}>
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imageEmoji}>🏃</Text>
                </View>
              </View>
              <View style={[styles.imageCard, styles.imageCard2]}>
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imageEmoji}>⚡</Text>
                </View>
              </View>
              <View style={[styles.imageCard, styles.imageCard3]}>
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imageEmoji}>👟</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Featured Blog Section */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Blog</Text>
          <View style={styles.featuredCard}>
            <View style={styles.featuredProfile}>
              <Text style={styles.featuredEmoji}>👤</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, styles.navIconActive]}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.addButton}>
            <Text style={styles.addIcon}>+</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e6e9ef",
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  time: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginRight: 12,
  },
  backButton: {
    marginRight: 8,
  },
  backIcon: {
    fontSize: 20,
    color: "#111",
  },
  logoContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  logoIcon: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111",
  },
  appName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    letterSpacing: 0.5,
  },
  statusIcons: {
    flexDirection: "row",
  },
  statusIcon: {
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e9ef",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 20,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
  },
  tabTextActive: {
    color: "#4CAF50",
  },
  scrollView: {
    flex: 1,
  },
  storiesContainer: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e9ef",
  },
  storiesScroll: {
    paddingHorizontal: 16,
  },
  storyItem: {
    alignItems: "center",
    marginRight: 16,
  },
  storyCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#e6e9ef",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  storyEmoji: {
    fontSize: 30,
  },
  storyLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  postSection: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e9ef",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  moreIcon: {
    fontSize: 20,
    color: "#666",
  },
  postCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  postHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  postIcons: {
    alignItems: "flex-end",
  },
  postIcon: {
    marginBottom: 8,
  },
  iconText: {
    fontSize: 18,
  },
  imageCardsContainer: {
    flexDirection: "row",
    height: 120,
    position: "relative",
  },
  imageCard: {
    position: "absolute",
    width: 100,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
  },
  imageCard1: {
    left: 0,
    zIndex: 1,
  },
  imageCard2: {
    left: 50,
    zIndex: 2,
  },
  imageCard3: {
    left: 100,
    zIndex: 3,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  imageEmoji: {
    fontSize: 40,
  },
  featuredSection: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e9ef",
  },
  featuredCard: {
    marginTop: 12,
  },
  featuredProfile: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e6e9ef",
    justifyContent: "center",
    alignItems: "center",
  },
  featuredEmoji: {
    fontSize: 30,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e6e9ef",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    fontSize: 24,
    color: "#999",
  },
  navIconActive: {
    color: "#4CAF50",
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "300",
  },
});
