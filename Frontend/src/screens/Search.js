import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { userAPI, postAPI } from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function Search({ navigation }) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("people"); // 'people' or 'posts'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch();
      } else {
        setResults([]);
        setError(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (activeTab === "people") {
        data = await userAPI.search(searchQuery);
      } else {
        data = await postAPI.search(searchQuery);
      }
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={[styles.userItem, { backgroundColor: theme.cardBackground }]}>
      <Image
        source={{
          uri:
            item.profile?.avatarUrl ||
            `https://ui-avatars.com/api/?name=${item.name}&background=0D8ABC&color=fff`,
        }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.userHandle, { color: theme.textSecondary }]}>@{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPostItem = ({ item }) => (
    <TouchableOpacity style={[styles.postItem, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.postHeader}>
        <Image
          source={{
            uri:
              item.author?.profile?.avatarUrl ||
              `https://ui-avatars.com/api/?name=${item.author?.name}&background=0D8ABC&color=fff`,
          }}
          style={styles.postAvatar}
        />
        <Text style={[styles.postAuthor, { color: theme.text }]}>{item.author?.name}</Text>
      </View>
      <Text style={[styles.postContent, { color: theme.textSecondary }]} numberOfLines={2}>
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>
        <View style={[styles.searchBar, { backgroundColor: theme.cardBackground }]}>
          <Ionicons name="search" size={20} color={theme.iconSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={theme.iconSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "people" && styles.activeTab]}
          onPress={() => setActiveTab("people")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "people" && styles.activeTabText,
              { color: activeTab === "people" ? theme.primary : theme.textSecondary }
            ]}
          >
            People
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "posts" && styles.activeTab]}
          onPress={() => setActiveTab("posts")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "posts" && styles.activeTabText,
              { color: activeTab === "posts" ? theme.primary : theme.textSecondary }
            ]}
          >
            Posts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#246bff" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color="#ff6b6b" />
          <Text style={[styles.errorText, { color: theme.textSecondary }]}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={activeTab === "people" ? renderUserItem : renderPostItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.center}>
              {searchQuery.trim() ? (
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No results found</Text>
              ) : (
                <>
                  <Ionicons name="search-outline" size={48} color={theme.iconSecondary} />
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    Type to search for {activeTab}
                  </Text>
                </>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f7fb",
    borderRadius: 8,
    marginLeft: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111",
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#246bff",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#246bff",
  },
  listContent: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
  // User Item Styles
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  userHandle: {
    fontSize: 14,
    color: "#666",
  },
  // Post Item Styles
  postItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  postAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  postContent: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});
