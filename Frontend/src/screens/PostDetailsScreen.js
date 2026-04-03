import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { postAPI } from "../services/api";

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

export default function PostDetailsScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { postId, initialPost } = route.params || {};
  const [post, setPost] = useState(initialPost || null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadPost() {
      try {
        setLoading(true);
        const [postData, commentsData] = await Promise.all([
          postAPI.getPostById(postId),
          postAPI.getComments(postId),
        ]);

        if (active) {
          setPost(postData);
          setComments(commentsData || []);
        }
      } catch (error) {
        console.error("Failed to load post details:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (postId) {
      loadPost();
    } else {
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [postId]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
          Post Details
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : post ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View
            style={[
              styles.postCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.postHeader}>
              <Image
                source={getAvatarSource(
                  post.author?.name,
                  post.author?.profile?.avatarUrl
                )}
                style={styles.avatar}
              />
              <View style={styles.postMeta}>
                <Text style={[styles.authorName, { color: theme.text }]}>
                  {post.author?.name || "Unknown user"}
                </Text>
                <Text style={[styles.authorHandle, { color: theme.textSecondary }]}>
                  @{post.author?.username || "guest"}
                </Text>
              </View>
            </View>

            <Text style={[styles.postContent, { color: theme.text }]}>
              {post.content}
            </Text>

            {getPrimaryImageUri(post.attachments) ? (
              <Image
                source={{ uri: getPrimaryImageUri(post.attachments) }}
                style={styles.postImage}
                resizeMode="cover"
              />
            ) : null}

            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Ionicons
                  name={post.isLiked ? "heart" : "heart-outline"}
                  size={18}
                  color={post.isLiked ? theme.danger : theme.iconSecondary}
                />
                <Text style={[styles.metricText, { color: theme.textSecondary }]}>
                  {post.likeCount || 0} likes
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={18}
                  color={theme.iconSecondary}
                />
                <Text style={[styles.metricText, { color: theme.textSecondary }]}>
                  {post.commentCount || 0} comments
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.commentsSection}>
            <Text style={[styles.commentsTitle, { color: theme.text }]}>
              Comments
            </Text>

            {comments.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={{ color: theme.textSecondary }}>
                  No comments on this post yet.
                </Text>
              </View>
            ) : (
              comments.map((comment) => (
                <View
                  key={comment.id}
                  style={[
                    styles.commentCard,
                    {
                      backgroundColor: theme.cardBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={styles.commentHeader}>
                    <Image
                      source={getAvatarSource(
                        comment.author?.name,
                        comment.author?.profile?.avatarUrl
                      )}
                      style={styles.commentAvatar}
                    />
                    <View style={styles.commentMeta}>
                      <Text style={[styles.commentAuthor, { color: theme.text }]}>
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
                  </View>

                  <Text
                    style={[styles.commentContent, { color: theme.textSecondary }]}
                  >
                    {comment.content}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.loaderWrap}>
          <Text style={{ color: theme.textSecondary }}>Post not found.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollContent: {
    padding: 18,
    paddingBottom: 32,
  },
  postCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  postMeta: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
  },
  authorHandle: {
    fontSize: 13,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 16,
  },
  postImage: {
    width: "100%",
    height: 260,
    borderRadius: 18,
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: "row",
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 18,
  },
  metricText: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: "600",
  },
  commentsSection: {},
  commentsTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
  },
  commentCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  commentMeta: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },
  commentHandle: {
    fontSize: 12,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 21,
  },
});
