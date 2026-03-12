import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { postAPI } from "../services/api";
import { useTheme } from "../context/ThemeContext";

const getAvatarSource = (name, avatarUrl) => ({
  uri:
    avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "User"
    )}&background=0D8ABC&color=fff`,
});

export default function CreatePost({
  visible,
  onClose,
  onPostCreated,
  user,
}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const trimmedLength = content.trim().length;
  const remaining = 5000 - content.length;
  const canPost = trimmedLength > 0 && !isLoading;

  const helperMessage = useMemo(() => {
    if (content.length === 0) {
      return "Share a quick update, a thought, or the start of a blog post.";
    }

    if (remaining < 120) {
      return `${remaining} characters left`;
    }

    return "Make it useful, personal, or interesting enough to start replies.";
  }, [content.length, remaining]);

  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please write something to post.");
      return;
    }

    setIsLoading(true);

    try {
      await postAPI.createPost({ content: content.trim() });
      setContent("");
      onClose();

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (content.trim()) {
      Alert.alert("Discard Post?", "Your draft will be removed.", [
        { text: "Keep Editing", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            setContent("");
            onClose();
          },
        },
      ]);
      return;
    }

    setContent("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleCancel}
    >
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 8, backgroundColor: theme.background },
        ]}
      >
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: theme.textSecondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: theme.text }]}>
            New Post
          </Text>

          <TouchableOpacity
            onPress={handleCreatePost}
            style={[
              styles.postButton,
              {
                backgroundColor: theme.primary,
                opacity: canPost ? 1 : 0.55,
              },
            ]}
            disabled={!canPost}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.onPrimary} />
            ) : (
              <Text style={[styles.postButtonText, { color: theme.onPrimary }]}>
                Post
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.contentArea}>
          <LinearGradient
            colors={
              theme.type === "dark"
                ? ["rgba(109, 254, 156, 0.12)", "rgba(9, 19, 40, 0.96)"]
                : ["#effff4", "#ffffff"]
            }
            style={[
              styles.introCard,
              {
                borderColor: theme.border,
                backgroundColor: theme.cardBackground,
              },
            ]}
          >
            <View style={styles.userInfo}>
              <Image
                source={getAvatarSource(user?.name, user?.profile?.avatarUrl)}
                style={styles.avatar}
              />
              <View style={styles.userMeta}>
                <Text style={[styles.username, { color: theme.text }]}>
                  {user?.name || "You"}
                </Text>
                <Text
                  style={[styles.visibilityText, { color: theme.textSecondary }]}
                >
                  Posting to your TrendStack feed
                </Text>
              </View>
            </View>

            <Text style={[styles.promptTitle, { color: theme.text }]}>
              What is worth sharing right now?
            </Text>
            <Text style={[styles.promptText, { color: theme.textSecondary }]}>
              Thoughtful posts tend to get more comments than one-line updates.
            </Text>
          </LinearGradient>

          <View
            style={[
              styles.editorCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <TextInput
              style={[styles.textInput, { color: theme.text }]}
              placeholder="Write your update here..."
              placeholderTextColor={theme.textSecondary}
              multiline
              value={content}
              onChangeText={setContent}
              maxLength={5000}
              autoFocus
              textAlignVertical="top"
            />

            <View style={styles.editorFooter}>
              <Text
                style={[
                  styles.helperText,
                  {
                    color: remaining < 120 ? theme.danger : theme.textSecondary,
                  },
                ]}
              >
                {helperMessage}
              </Text>
              <Text
                style={[
                  styles.characterCountText,
                  { color: theme.textSecondary },
                ]}
              >
                {content.length}/5000
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.tipCard,
              {
                backgroundColor:
                  theme.type === "dark" ? theme.surface : "#f4f8fb",
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons
              name="bulb-outline"
              size={20}
              color={theme.primary}
              style={styles.tipIcon}
            />
            <Text style={[styles.tipText, { color: theme.textSecondary }]}>
              Posts that ask a question or share a clear takeaway usually spark
              better conversation.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.addMediaButton,
              {
                borderColor: theme.border,
                backgroundColor:
                  theme.type === "dark" ? theme.surface : "#ffffff",
              },
            ]}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.addMediaIconWrap,
                {
                  backgroundColor:
                    theme.type === "dark" ? "rgba(109, 254, 156, 0.12)" : "#eef8f2",
                },
              ]}
            >
              <Ionicons name="image-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.addMediaContent}>
              <Text style={[styles.addMediaTitle, { color: theme.text }]}>
                Media upload coming soon
              </Text>
              <Text
                style={[styles.addMediaText, { color: theme.textSecondary }]}
              >
                The layout is ready for photos and richer posts next.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerButton: {
    minWidth: 72,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
  },
  postButton: {
    minWidth: 72,
    height: 40,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  postButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  contentArea: {
    flex: 1,
    padding: 18,
  },
  introCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userMeta: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  visibilityText: {
    fontSize: 13,
  },
  promptTitle: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
    marginBottom: 8,
  },
  promptText: {
    fontSize: 14,
    lineHeight: 21,
  },
  editorCard: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    minHeight: 240,
  },
  editorFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  helperText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    marginRight: 12,
  },
  characterCountText: {
    fontSize: 12,
    fontWeight: "700",
  },
  tipCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tipIcon: {
    marginTop: 1,
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  addMediaButton: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  addMediaIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addMediaContent: {
    flex: 1,
  },
  addMediaTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },
  addMediaText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
