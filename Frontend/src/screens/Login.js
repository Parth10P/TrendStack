import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { userAPI } from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function Login({ onSignInSuccess }) {
  const { theme } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Login fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Sign up fields
  const [name, setName] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [email, setEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  
  const [loading, setLoading] = useState(false);

  async function handleLocalSignIn() {
    if (!username.trim() || !password) {
      Alert.alert("Validation", "Please enter username and password");
      return;
    }

    try {
      setLoading(true);
      const response = await userAPI.login({
        username: username.trim(),
        password,
      });

      setUsername("");
      setPassword("");

      if (onSignInSuccess) {
        onSignInSuccess(response.user || response);
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    if (!name.trim() || !signUpUsername.trim() || !email.trim() || !signUpPassword) {
      Alert.alert("Validation", "Please fill all sign up fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Validation", "Please enter a valid email address");
      return;
    }

    if (signUpPassword.length < 6) {
      Alert.alert("Validation", "Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await userAPI.signup({
        name: name.trim(),
        username: signUpUsername.trim(),
        email: email.trim(),
        password: signUpPassword,
      });

      setName("");
      setSignUpUsername("");
      setEmail("");
      setSignUpPassword("");

      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => {
            if (onSignInSuccess) {
              onSignInSuccess(response.user || response);
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    console.log(" google login");
    try {
      setLoading(true);
      const userInfo = {
        user: { name: "Google User", email: "user@google.com" },
        provider: "google",
      };
      if (onSignInSuccess) onSignInSuccess(userInfo);
    } catch (err) {
      console.log("Google sign in error", err);
      Alert.alert("Google Sign In", "Unable to sign in with Google");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Top Section: Brand Header */}
      <View style={styles.brandSection}>
          <Image
            source={require("../../assets/dark_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        <Text style={styles.brandSubtitle}>Discover what's trending now</Text>
      </View>

      {/* Bottom Section: Action Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.actionSheetContainer}
      >
        <View style={styles.actionSheet}>
          {/* Segmented Control Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, !isSignUp && styles.activeTab]}
              onPress={() => setIsSignUp(false)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  !isSignUp ? styles.activeTabText : styles.inactiveTabText,
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, isSignUp && styles.activeTab]}
              onPress={() => setIsSignUp(true)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  isSignUp ? styles.activeTabText : styles.inactiveTabText,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sheetTitle}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </Text>

          {isSignUp ? (
            /* Sign Up Fields */
            <>
               <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                />
              </View>

               <View style={styles.inputContainer}>
                <Ionicons name="at-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#999"
                  value={signUpUsername}
                  onChangeText={setSignUpUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password (min 6 chars)"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={signUpPassword}
                  onChangeText={setSignUpPassword}
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            /* Login Fields */
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="at-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#999"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleLocalSignIn}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Login</Text>
                )}
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={[styles.socialButton, loading && styles.buttonDisabled]}
                onPress={handleGoogleSignIn}
                disabled={loading}
              >
                <Image
                  source={{
                    uri: "https://developers.google.com/identity/images/g-logo.png",
                  }}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1b1e", // Dark background for brand section
  },
  brandSection: {
    height: "35%", // Top 35%
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },

  logo: {
    width: 280,
    height: 80,
  },

  brandSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
  },
  actionSheetContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end", // Push to bottom
  },
  actionSheet: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    // Shadow for elevation feeling
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#111",
  },
  inactiveTabText: {
    color: "#888",
  },

  sheetTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e6e9ef",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111",
  },
  primaryButton: {
    backgroundColor: "#246bff",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#246bff",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e6e9ef",
  },
  dividerText: {
    paddingHorizontal: 16,
    color: "#888",
    fontSize: 14,
  },
  socialButton: {
    flexDirection: "row",
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e6e9ef",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
});
