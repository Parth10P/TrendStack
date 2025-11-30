import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { postAPI } from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function CreatePost({ visible, onClose, onPostCreated }) {
  const { theme } = useTheme();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  // Handle post creation
  const handleCreatePost = async () => {
    // Validate content
    if (!content.trim()) {
      Alert.alert("Error", "Please write something to post!");
      return;
    }

    setIsLoading(true);

    try {
      // Call API to create post
      const response = await postAPI.createPost({ content: content.trim() });

      // Show success message
      Alert.alert("Success", "Post created successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Clear the input
            setContent("");
            // Close modal
            onClose();
            // Notify parent to refresh posts
            if (onPostCreated) {
              onPostCreated();
            }
          },
        },
      ]);
    } catch (error) {
      // Show error message
      Alert.alert("Error", error.message || "Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (content.trim()) {
      Alert.alert(
        "Discard Post?",
        "Are you sure you want to discard this post?",
        [
          { text: "Continue Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              setContent("");
              onClose();
            },
          },
        ]
      );
    } else {
      setContent("");
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleCancel}
    >
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Create Post</Text>
          <TouchableOpacity
            onPress={handleCreatePost}
            style={[styles.postButton, isLoading && styles.postButtonDisabled]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.postButtonText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {/* User Info (placeholder) */}
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: theme.border }]}>
              <Ionicons name="person" size={24} color="#4CAF50" />
            </View>
            <Text style={[styles.username, { color: theme.text }]}>You</Text>
          </View>

          {/* Text Input */}
          <TextInput
            style={[styles.textInput, { color: theme.text }]}
            placeholder="What's on your mind?"
            placeholderTextColor={theme.textSecondary}
            multiline
            value={content}
            onChangeText={setContent}
            maxLength={5000}
            autoFocus
          />

          {/* Character Count */}
          <View style={styles.characterCount}>
            <Text style={styles.characterCountText}>
              {content.length}/5000
            </Text>
          </View>

          {/* Optional: Add Image/Media Button (for future) */}
          <TouchableOpacity style={styles.addMediaButton}>
            <Ionicons name="image-outline" size={24} color="#4CAF50" />
            <Text style={styles.addMediaText}>Add Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e9ef",
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    color: "#666",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  postButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    opacity: 0.6,
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  contentArea: {
    flex: 1,
    padding: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e6e9ef",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: "#111",
    textAlignVertical: "top",
    padding: 0,
    marginBottom: 12,
  },
  characterCount: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  characterCountText: {
    fontSize: 12,
    color: "#999",
  },
  addMediaButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 12,
    borderStyle: "dashed",
  },
  addMediaText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "500",
  },
});

