import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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
  
  // Comment Modal State
  const [activePostId, setActivePostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

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

  const handleLike = async (postId) => {
    // Optimistic update
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
          };
        }
        return post;
      })
    );

    try {
      await postAPI.toggleLike(postId);
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // Revert on error (optional, but good practice)
      fetchPosts();
    }
  };

  const openComments = async (postId) => {
    setActivePostId(postId);
    setLoadingComments(true);
    try {
      const data = await postAPI.getComments(postId);
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const comment = await postAPI.addComment(activePostId, newComment);
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
      
      // Update comment count in post list
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === activePostId
            ? { ...post, commentCount: (post.commentCount || 0) + 1 }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to add comment:", error);
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
                    justifyContent: "flex-start", // Changed to start
                    marginTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: "#f0f0f0",
                    paddingTop: 12,
                  }}
                >
                  <TouchableOpacity 
                    style={{ marginRight: 20, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => handleLike(post.id)}
                  >
                    <Ionicons 
                      name={post.isLiked ? "heart" : "heart-outline"} 
                      size={24} 
                      color={post.isLiked ? "#ff3b30" : "#666"} 
                    />
                    <Text style={{ marginLeft: 6, color: "#666", fontSize: 14 }}>
                      {post.likeCount || 0}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={{ marginRight: 20, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => openComments(post.id)}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={22}
                      color="#666"
                    />
                    <Text style={{ marginLeft: 6, color: "#666", fontSize: 14 }}>
                      {post.commentCount || 0}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="share-social-outline" size={22} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
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

      {/* Comments Modal */}
      <Modal
        visible={activePostId !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActivePostId(null)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Comments</Text>
            <TouchableOpacity onPress={() => setActivePostId(null)}>
              <Ionicons name="close" size={24} color="#111" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.commentsList}>
            {loadingComments ? (
              <ActivityIndicator size="small" color="#246bff" style={{ marginTop: 20 }} />
            ) : comments.length === 0 ? (
              <Text style={styles.emptyComments}>No comments yet.</Text>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <Image
                    source={{
                      uri:
                        comment.author?.profile?.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${comment.author?.name}&background=0D8ABC&color=fff`,
                    }}
                    style={styles.commentAvatar}
                  />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentAuthor}>{comment.author?.name}</Text>
                    <Text style={styles.commentText}>{comment.content}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
              onPress={submitComment}
              disabled={!newComment.trim()}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  commentsList: {
    flex: 1,
    padding: 16,
  },
  emptyComments: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    padding: 10,
    borderRadius: 12,
  },
  commentAuthor: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
    color: "#111",
  },
  commentText: {
    fontSize: 14,
    color: "#333",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingBottom: Platform.OS === "ios" ? 30 : 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#246bff",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
});
