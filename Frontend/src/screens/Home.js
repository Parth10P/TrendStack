import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { userAPI } from "../services/api";

export default function Home({ user, onLogout }) {
  const handleLogout = async () => {
    try {
      await userAPI.logout();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still log out locally even if API call fails
      if (onLogout) {
        onLogout();
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to TrendStack!</Text>
        
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user.name || "N/A"}</Text>
            
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.value}>@{user.username || "N/A"}</Text>
            
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email || "N/A"}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  content: {
    padding: 24,
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 32,
    textAlign: "center",
  },
  userInfo: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#111",
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

