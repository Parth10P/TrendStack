import React, { useEffect, useState } from "react";
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
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { userAPI, postAPI } from "../services/api";
import CreatePost from "./CreatePost";
import ProfileButton from "../components/ProfileButton";
import { useTheme } from "../context/ThemeContext";

const getAvatarSource = (name, avatarUrl) => ({
  uri:
    avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "User"
    )}&background=0D8ABC&color=fff`,
});

const formatCount = (value = 0) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }

  return `${value}`;
};

const sortComments = (commentList = []) =>
  [...commentList].sort((left, right) => {
    if (left.pinned === right.pinned) {
      return new Date(right.createdAt || 0) - new Date(left.createdAt || 0);
    }

    return left.pinned ? -1 : 1;
  });

export default function Home({ user, onLogout, navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activePostId, setActivePostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [activePostAuthorId, setActivePostAuthorId] = useState(null);
  const [activePostAuthorUsername, setActivePostAuthorUsername] = useState(null);

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
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likeCount: post.isLiked
                ? (post.likeCount || 1) - 1
                : (post.likeCount || 0) + 1,
            }
          : post
      )
    );

    try {
      await postAPI.toggleLike(postId);
    } catch (error) {
      console.error("Failed to toggle like:", error);
      fetchPosts();
    }
  };

  const openComments = async (postId) => {
    setActivePostId(postId);
    setLoadingComments(true);
    setNewComment("");

    try {
      const data = await postAPI.getComments(postId);
      setComments(sortComments(data || []));
      const post = posts.find((item) => item.id === postId);
      setActivePostAuthorId(post?.author?.id || null);
      setActivePostAuthorUsername(post?.author?.username || null);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const closeComments = () => {
    setActivePostId(null);
    setComments([]);
    setNewComment("");
    setActivePostAuthorId(null);
    setActivePostAuthorUsername(null);
  };

  const handleCommentLike = async (commentId) => {
    setComments((prev) =>
      sortComments(
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                isLiked: !comment.isLiked,
                likeCount: comment.isLiked
                  ? (comment.likeCount || 1) - 1
                  : (comment.likeCount || 0) + 1,
              }
            : comment
        )
      )
    );

    try {
      await postAPI.toggleCommentLike(commentId);
    } catch (error) {
      console.error("Failed to toggle comment like:", error);
      if (activePostId) {
        openComments(activePostId);
      }
    }
  };

  const handlePinComment = async (commentId) => {
    try {
      const result = await postAPI.pinComment(commentId);
      setComments((prev) =>
        sortComments(
          prev.map((comment) =>
            comment.id === commentId
              ? { ...comment, pinned: result.pinned }
              : comment
          )
        )
      );
    } catch (error) {
      console.error("Failed to pin comment:", error);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) {
      return;
    }

    try {
      const comment = await postAPI.addComment(activePostId, newComment.trim());
      setComments((prev) => sortComments([comment, ...prev]));
      setNewComment("");

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

  const handleLogoutPress = async () => {
    try {
      await userAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      if (onLogout) {
        onLogout();
      }
    }
  };

  const headerSubtitle = user?.name
    ? `Welcome back, ${user.name.split(" ")[0]}`
    : "See what your community is talking about";
  const canPinComments =
    Boolean(user?.id && activePostAuthorId && user.id === activePostAuthorId) ||
    Boolean(
      user?.username &&
        activePostAuthorUsername &&
        user.username === activePostAuthorUsername
    );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.topBar,
          {
            paddingTop: insets.top + 8,
            borderBottomColor: theme.border,
            backgroundColor: theme.background,
          },
        ]}
      >
        <View style={styles.topBarLeft}>
          <Image
            source={require("../../assets/trendStack_logo.png")}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <View>
            <Text style={[styles.appName, { color: theme.text }]}>
              TrendStack
            </Text>
            <Text
              style={[styles.appSubtitle, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {headerSubtitle}
            </Text>
          </View>
        </View>
        <ProfileButton
          onPress={() => navigation.navigate("Profile")}
          userImage={user?.profile?.avatarUrl || user?.avatar}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 144 + Math.max(insets.bottom, 12) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={[
            styles.composerCard,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
          onPress={() => setShowCreatePost(true)}
          activeOpacity={0.9}
        >
          <Image
            source={getAvatarSource(user?.name, user?.profile?.avatarUrl)}
            style={styles.composerAvatar}
          />
          <View style={styles.composerContent}>
            <Text style={[styles.composerPrompt, { color: theme.text }]}>
              What do you want to share today?
            </Text>
            <Text
              style={[
                styles.composerSubtext,
                { color: theme.textSecondary },
              ]}
            >
              Post an update, a thought, or the first lines of your next blog.
            </Text>
          </View>
          <View
            style={[
              styles.composerAction,
              { backgroundColor: theme.type === "dark" ? theme.surface : "#eef4ff" },
            ]}
          >
            <Ionicons name="add" size={20} color={theme.primary} />
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recent posts
            </Text>
            <Text
              style={[styles.sectionSubtitle, { color: theme.textSecondary }]}
            >
              Fresh updates from your network
            </Text>
          </View>
          <TouchableOpacity onPress={fetchPosts}>
            <Text style={[styles.refreshText, { color: theme.primary }]}>
              Refresh
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View
            style={[
              styles.centerStateCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.stateText, { color: theme.textSecondary }]}>
              Loading the latest conversations...
            </Text>
          </View>
        ) : posts.length === 0 ? (
          <View
            style={[
              styles.centerStateCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.stateIconWrap,
                {
                  backgroundColor:
                    theme.type === "dark" ? theme.surface : "#eef8f2",
                },
              ]}
            >
              <Ionicons name="sparkles-outline" size={28} color={theme.primary} />
            </View>
            <Text style={[styles.stateTitle, { color: theme.text }]}>
              No posts yet
            </Text>
            <Text style={[styles.stateText, { color: theme.textSecondary }]}>
              Start the first conversation and give the community something to
              react to.
            </Text>
          </View>
        ) : (
          posts.map((post) => (
            <View
              key={post.id}
              style={[
                styles.postCard,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.postHeader}>
                <View style={styles.postIdentity}>
                  <Image
                    source={getAvatarSource(
                      post.author?.name,
                      post.author?.profile?.avatarUrl
                    )}
                    style={[
                      styles.postAvatar,
                      { borderColor: theme.type === "dark" ? theme.surface : "#fff" },
                    ]}
                  />
                  <View style={styles.postMeta}>
                    <Text style={[styles.postAuthor, { color: theme.text }]}>
                      {post.author?.name || "Unknown user"}
                    </Text>
                    <Text
                      style={[
                        styles.postHandle,
                        { color: theme.textSecondary },
                      ]}
                    >
                      @{post.author?.username || "guest"}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.postContent, { color: theme.text }]}>
                {post.content}
              </Text>

              <View
                style={[
                  styles.postFooter,
                  {
                    borderTopColor: theme.border,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => handleLike(post.id)}
                >
                  <MaterialIcons
                    name={post.isLiked ? "favorite" : "favorite-border"}
                    size={22}
                    color={post.isLiked ? theme.danger : theme.iconSecondary}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      {
                        color: post.isLiked ? theme.danger : theme.textSecondary,
                      },
                    ]}
                  >
                    {formatCount(post.likeCount || 0)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => openComments(post.id)}
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={22}
                    color={theme.iconSecondary}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {formatCount(post.commentCount || 0)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem}>
                  <Ionicons
                    name="paper-plane-outline"
                    size={22}
                    color={theme.iconSecondary}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Share
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View
        style={[
          styles.bottomNav,
          {
            paddingBottom:
              Platform.OS === "ios"
                ? Math.max(insets.bottom / 2, 12)
                : 12,
            backgroundColor:
              theme.type === "dark"
                ? "rgba(15, 25, 48, 0.95)"
                : "rgba(255, 255, 255, 0.96)",
            borderColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={22} color={theme.primary} />
          <Text style={[styles.navLabel, { color: theme.primary }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Search")}
        >
          <Ionicons name="search-outline" size={22} color={theme.iconSecondary} />
          <Text style={[styles.navLabel, { color: theme.textSecondary }]}>
            Search
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.centerNavButton}
          onPress={() => setShowCreatePost(true)}
        >
          <LinearGradient
            colors={theme.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addButton}
          >
            <Ionicons name="add" size={28} color={theme.onPrimary} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person-outline" size={22} color={theme.iconSecondary} />
          <Text style={[styles.navLabel, { color: theme.textSecondary }]}>
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={handleLogoutPress}>
          <Ionicons name="log-out-outline" size={22} color={theme.iconSecondary} />
          <Text style={[styles.navLabel, { color: theme.textSecondary }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      <CreatePost
        visible={showCreatePost}
        user={user}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={fetchPosts}
      />

      <Modal
        visible={activePostId !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeComments}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[styles.modalContainer, { backgroundColor: theme.background }]}
        >
          <View
            style={[styles.modalHeader, { borderBottomColor: theme.border }]}
          >
            <View>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Comments
              </Text>
              <Text
                style={[
                  styles.modalSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Join the conversation
              </Text>
            </View>
            <TouchableOpacity onPress={closeComments}>
              <Ionicons name="close" size={24} color={theme.icon} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.commentsList}
            contentContainerStyle={styles.commentsContent}
            showsVerticalScrollIndicator={false}
          >
            {loadingComments ? (
              <ActivityIndicator
                size="small"
                color={theme.primary}
                style={{ marginTop: 24 }}
              />
            ) : comments.length === 0 ? (
              <View
                style={[
                  styles.commentsEmptyCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={28}
                  color={theme.primary}
                />
                <Text style={[styles.stateTitle, { color: theme.text }]}>
                  No comments yet
                </Text>
                <Text
                  style={[styles.stateText, { color: theme.textSecondary }]}
                >
                  Be the first one to respond.
                </Text>
              </View>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentRow}>
                  <Image
                    source={getAvatarSource(
                      comment.author?.name,
                      comment.author?.profile?.avatarUrl
                    )}
                    style={styles.commentAvatar}
                  />
                  <View
                    style={[
                      styles.commentCard,
                      {
                        backgroundColor: theme.cardBackground,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <View style={styles.commentHeader}>
                      <View>
                        <Text
                          style={[styles.commentAuthor, { color: theme.text }]}
                        >
                          {comment.author?.name || "Unknown user"}
                        </Text>
                        <Text
                          style={[
                            styles.commentHandle,
                            { color: theme.textSecondary },
                          ]}
                        >
                          @{comment.author?.username || "guest"}
                        </Text>
                      </View>

                      {comment.pinned ? (
                        <View
                          style={[
                            styles.pinnedBadge,
                            {
                              backgroundColor:
                                theme.type === "dark"
                                  ? "rgba(243, 156, 18, 0.18)"
                                  : "#fff4dd",
                            },
                          ]}
                        >
                          <Ionicons name="pin" size={12} color="#f39c12" />
                          <Text style={styles.pinnedText}>Pinned</Text>
                        </View>
                      ) : null}
                    </View>

                    <Text
                      style={[styles.commentText, { color: theme.textSecondary }]}
                    >
                      {comment.content}
                    </Text>

                    <View style={styles.commentActions}>
                      <TouchableOpacity
                        onPress={() => handleCommentLike(comment.id)}
                        style={styles.commentAction}
                      >
                        <MaterialIcons
                          name={comment.isLiked ? "thumb-up" : "thumb-up-off-alt"}
                          size={18}
                          color={
                            comment.isLiked ? theme.primary : theme.iconSecondary
                          }
                        />
                        <Text
                          style={[
                            styles.commentActionText,
                            { color: theme.textSecondary },
                          ]}
                        >
                          {formatCount(comment.likeCount || 0)}
                        </Text>
                      </TouchableOpacity>

                      {canPinComments ? (
                        <TouchableOpacity
                          onPress={() => handlePinComment(comment.id)}
                          style={styles.commentAction}
                        >
                          <Ionicons
                            name={comment.pinned ? "pin" : "pin-outline"}
                            size={18}
                            color={
                              comment.pinned ? "#f39c12" : theme.iconSecondary
                            }
                          />
                          <Text
                            style={[
                              styles.commentActionText,
                              { color: theme.textSecondary },
                            ]}
                          >
                            {comment.pinned ? "Unpin" : "Pin"}
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <View
            style={[
              styles.commentInputContainer,
              {
                borderTopColor: theme.border,
                paddingBottom: Math.max(insets.bottom, 12),
                backgroundColor: theme.background,
              },
            ]}
          >
            <TextInput
              style={[
                styles.commentInput,
                {
                  backgroundColor:
                    theme.type === "dark" ? theme.surface : "#f4f7fb",
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Add a thoughtful reply..."
              placeholderTextColor={theme.textSecondary}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: theme.primary,
                  opacity: newComment.trim() ? 1 : 0.5,
                },
              ]}
              onPress={submitComment}
              disabled={!newComment.trim()}
            >
              <Ionicons name="send" size={18} color={theme.onPrimary} />
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
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  brandLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  appName: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  appSubtitle: {
    marginTop: 2,
    fontSize: 13,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  composerCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  composerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
  },
  composerContent: {
    flex: 1,
    marginRight: 12,
  },
  composerPrompt: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  composerSubtext: {
    fontSize: 13,
    lineHeight: 19,
  },
  composerAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  refreshText: {
    fontSize: 14,
    fontWeight: "700",
  },
  centerStateCard: {
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: "center",
  },
  stateIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  stateText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
  },
  postCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  postIdentity: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  postAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
  },
  postMeta: {
    flex: 1,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
  },
  postHandle: {
    fontSize: 13,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "500",
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  bottomNav: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: 28,
    paddingTop: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 12,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 58,
  },
  navLabel: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "600",
  },
  centerNavButton: {
    marginTop: -30,
  },
  addButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  modalSubtitle: {
    fontSize: 13,
    marginTop: 3,
  },
  commentsList: {
    flex: 1,
  },
  commentsContent: {
    padding: 18,
    paddingBottom: 28,
  },
  commentsEmptyCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
  },
  commentRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  commentAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    marginTop: 6,
  },
  commentCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "700",
  },
  commentHandle: {
    fontSize: 12,
    marginTop: 2,
  },
  pinnedBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  pinnedText: {
    marginLeft: 5,
    color: "#f39c12",
    fontSize: 12,
    fontWeight: "700",
  },
  commentText: {
    fontSize: 14,
    lineHeight: 21,
  },
  commentActions: {
    flexDirection: "row",
    marginTop: 12,
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 18,
  },
  commentActionText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 18,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  commentInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    marginRight: 12,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
