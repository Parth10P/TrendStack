import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { userAPI } from "../services/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CreatePost from "./CreatePost";

export default function Home({ user, onLogout }) {
  const [showCreatePost, setShowCreatePost] = useState(false);
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
        <View style={styles.statusIcons}>
          <TouchableOpacity>
            <Ionicons name="person-circle-outline" size={28} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Recently Post Section */}
        <View style={styles.postSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Post</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
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
                  <Ionicons name="camera-outline" size={22} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.postIcon}>
                  <Ionicons name="settings-outline" size={22} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Overlapping Image Cards */}
            <View style={styles.imageCardsContainer}>
              <View style={[styles.imageCard, styles.imageCard1]}>
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="fitness-outline" size={40} color="#999" />
                </View>
              </View>
              <View style={[styles.imageCard, styles.imageCard2]}>
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="flash-outline" size={40} color="#999" />
                </View>
              </View>
              <View style={[styles.imageCard, styles.imageCard3]}>
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="images-outline" size={40} color="#999" />
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
              <Ionicons name="person" size={30} color="#666" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={26} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="search-outline" size={26} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setShowCreatePost(true)}
        >
          <View style={styles.addButton}>
            <Ionicons name="add" size={28} color="#fff" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="camera-outline" size={26} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-add-outline" size={26} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Create Post Modal */}
      <CreatePost
        visible={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={() => {
          // You can add logic here to refresh the posts feed
          console.log("Post created! Refresh feed here if needed.");
        }}
      />
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
  scrollView: {
    flex: 1,
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
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
});
