import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { userAPI, postAPI } from "../services/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CreatePost from "./CreatePost";
import ProfileButton from "../components/ProfileButton";

export default function Home({ user, onLogout, navigation }) {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postAPI.getAllPosts();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

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
          <ProfileButton
            onPress={() => navigation.navigate("Profile")}
            userImage={user?.avatar}
          />
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

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#246bff"
              style={{ marginTop: 20 }}
            />
          ) : posts.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#666", marginTop: 20 }}>
              No posts yet. Be the first to post!
            </Text>
          ) : (
            posts.map((post) => (
              <View
                key={post.id}
                style={[styles.postCard, { marginBottom: 16 }]}
              >
                <View style={styles.postHeader}>
                  <View style={styles.postHeaderLeft}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            post.author?.profile?.avatarUrl ||
                            `https://ui-avatars.com/api/?name=${post.author?.name}&background=0D8ABC&color=fff`,
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          marginRight: 10,
                        }}
                      />
                      <View>
                        <Text
                          style={{
                            fontWeight: "700",
                            fontSize: 16,
                            color: "#111",
                          }}
                        >
                          {post.author?.name}
                        </Text>
                        <Text style={{ fontSize: 12, color: "#666" }}>
                          @{post.author?.username}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.postDescription}>{post.content}</Text>
                  </View>
                </View>

                {/* Post Actions */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: "#f0f0f0",
                    paddingTop: 12,
                  }}
                >
                  <TouchableOpacity style={{ marginRight: 16 }}>
                    <Ionicons name="heart-outline" size={24} color="#666" />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginRight: 16 }}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={22}
                      color="#666"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="share-social-outline" size={22} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
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
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Search")}
        >
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
          fetchPosts();
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
