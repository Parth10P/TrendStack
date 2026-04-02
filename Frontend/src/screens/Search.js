import React, { useEffect, useState } from "react";
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

const getAvatarSource = (name, avatarUrl) => ({
  uri:
    avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "User"
    )}&background=0D8ABC&color=fff`,
});

export default function Search({ navigation }) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("people");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch();
      } else {
        setResults([]);
        setError(null);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const data =
        activeTab === "people"
          ? await userAPI.search(searchQuery.trim())
          : await postAPI.search(searchQuery.trim());

      setResults(data || []);
    } catch (searchError) {
      console.error("Search error:", searchError);
      setError("Search failed. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUser = (item) => {
    navigation.navigate("UserProfile", {
      userId: item.id,
      initialUser: item,
    });
  };

  const handleOpenPost = (item) => {
    navigation.navigate("PostDetails", {
      postId: item.id,
      initialPost: item,
    });
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.userItem,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
        },
      ]}
      activeOpacity={0.88}
      onPress={() => handleOpenUser(item)}
    >
      <Image
        source={getAvatarSource(item.name, item.profile?.avatarUrl)}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.userHandle, { color: theme.textSecondary }]}>
          @{item.username}
        </Text>
      </View>
      <View
        style={[
          styles.followChip,
          {
            backgroundColor:
              theme.type === "dark" ? theme.surface : "#eef8f2",
          },
        ]}
      >
        <Text style={[styles.followChipText, { color: theme.primary }]}>
          View
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.postItem,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
        },
      ]}
      activeOpacity={0.88}
      onPress={() => handleOpenPost(item)}
    >
      <View style={styles.postHeader}>
        <View style={styles.postAuthorWrap}>
          <Image
            source={getAvatarSource(
              item.author?.name,
              item.author?.profile?.avatarUrl
            )}
            style={styles.postAvatar}
          />
          <View style={styles.postAuthorMeta}>
            <Text style={[styles.postAuthor, { color: theme.text }]}>
              {item.author?.name || "Unknown user"}
            </Text>
            <Text
              style={[styles.postHandle, { color: theme.textSecondary }]}
            >
              @{item.author?.username || "guest"}
            </Text>
          </View>
        </View>

        <Ionicons name="arrow-forward" size={18} color={theme.iconSecondary} />
      </View>
      <Text
        style={[styles.postContent, { color: theme.textSecondary }]}
        numberOfLines={3}
      >
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  const listEmpty =
    searchQuery.trim().length > 0 ? (
      <View
        style={[
          styles.emptyState,
          {
            backgroundColor: theme.cardBackground,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons name="search-outline" size={34} color={theme.primary} />
        <Text style={[styles.emptyTitle, { color: theme.text }]}>
          No {activeTab} found
        </Text>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Try a different keyword, username, or topic.
        </Text>
      </View>
    ) : (
      <View
        style={[
          styles.emptyState,
          {
            backgroundColor: theme.cardBackground,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons name="compass-outline" size={34} color={theme.primary} />
        <Text style={[styles.emptyTitle, { color: theme.text }]}>
          Search across TrendStack
        </Text>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Find people to follow or posts worth reading.
        </Text>
      </View>
    );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            {
              backgroundColor:
                theme.type === "dark" ? theme.surface : theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons name="arrow-back" size={20} color={theme.icon} />
        </TouchableOpacity>

        <View
          style={[
            styles.searchBar,
            {
              borderColor: theme.border,
              backgroundColor:
                theme.type === "dark" ? theme.surface : theme.cardBackground,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={18}
            color={theme.iconSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder={`Search ${activeTab}`}
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={theme.iconSecondary}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.contentWrap}>
        <Text style={[styles.screenTitle, { color: theme.text }]}>Discover</Text>
        <Text style={[styles.screenSubtitle, { color: theme.textSecondary }]}>
          Search for creators, conversations, and fresh ideas.
        </Text>

        <View
          style={[
            styles.tabs,
            {
              backgroundColor:
                theme.type === "dark" ? theme.surface : theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          {["people", "posts"].map((tab) => {
            const active = activeTab === tab;

            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  active && {
                    backgroundColor: theme.primary,
                  },
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: active ? theme.onPrimary : theme.textSecondary,
                    },
                  ]}
                >
                  {tab === "people" ? "People" : "Posts"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Searching {activeTab}...
            </Text>
          </View>
        ) : error ? (
          <View
            style={[
              styles.emptyState,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons name="alert-circle-outline" size={34} color={theme.danger} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Something went wrong
            </Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {error}
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={activeTab === "people" ? renderUserItem : renderPostItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={listEmpty}
          />
        )}
      </View>
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
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginRight: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  contentWrap: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },
  screenSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  tabs: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 18,
    padding: 4,
    marginBottom: 18,
  },
  tab: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: 28,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginTop: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 13,
  },
  followChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  followChipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  postItem: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  postAuthorWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postAuthorMeta: {
    flex: 1,
  },
  postAuthor: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },
  postHandle: {
    fontSize: 12,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 21,
  },
});
