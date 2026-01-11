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
  SafeAreaView,
  ScrollView,
} from "react-native";
import { userAPI } from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

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
    if (
      !name.trim() ||
      !signUpUsername.trim() ||
      !email.trim() ||
      !signUpPassword
    ) {
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
      Alert.alert(
        "Sign Up Failed",
        error.message || "Unable to create account"
      );
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
      <LinearGradient
        colors={
          theme.type === "dark"
            ? ["#121212", "#1a1b1e", "#000000"]
            : ["#f4f6f9", "#e2e6ea", "#dbe0e6"]
        }
        style={StyleSheet.absoluteFill}
      />

      {/* Background decoration */}
      <View style={styles.decorationCircle1} />
      <View style={styles.decorationCircle2} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Brand Section */}
            <View style={styles.brandSection}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/icon.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.brandTitle, { color: theme.text }]}>
                TrendStack
              </Text>
              <Text
                style={[styles.brandSubtitle, { color: theme.textSecondary }]}
              >
                Discover what's trending now
              </Text>
            </View>

            {/* Login Form Container */}
            <BlurView
              intensity={Platform.OS === "ios" ? 30 : 0}
              tint={theme.type === "dark" ? "dark" : "light"}
              style={[
                styles.formContainer,
                {
                  backgroundColor:
                    theme.type === "dark"
                      ? "rgba(30,30,30,0.7)"
                      : "rgba(255,255,255,0.8)",
                },
              ]}
            >
              {/* Tabs */}
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tab, !isSignUp && styles.activeTab]}
                  onPress={() => setIsSignUp(false)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      !isSignUp
                        ? { color: theme.primary }
                        : { color: theme.textSecondary },
                    ]}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, isSignUp && styles.activeTab]}
                  onPress={() => setIsSignUp(true)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isSignUp
                        ? { color: theme.primary }
                        : { color: theme.textSecondary },
                    ]}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.formTitle, { color: theme.text }]}>
                {isSignUp ? "Create an Account" : "Welcome Back"}
              </Text>

              {isSignUp ? (
                <>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.inputBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={theme.iconSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.text }]}
                      placeholder="Full Name"
                      placeholderTextColor={theme.textSecondary}
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.inputBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name="at-outline"
                      size={20}
                      color={theme.iconSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.text }]}
                      placeholder="Username"
                      placeholderTextColor={theme.textSecondary}
                      value={signUpUsername}
                      onChangeText={setSignUpUsername}
                      autoCapitalize="none"
                    />
                  </View>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.inputBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={theme.iconSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.text }]}
                      placeholder="Email Address"
                      placeholderTextColor={theme.textSecondary}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.inputBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={theme.iconSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.text }]}
                      placeholder="Password"
                      placeholderTextColor={theme.textSecondary}
                      value={signUpPassword}
                      onChangeText={setSignUpPassword}
                      secureTextEntry
                    />
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      { backgroundColor: theme.primary },
                      loading && styles.buttonDisabled,
                    ]}
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
                <>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.inputBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name="at-outline"
                      size={20}
                      color={theme.iconSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.text }]}
                      placeholder="Username"
                      placeholderTextColor={theme.textSecondary}
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                    />
                  </View>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.inputBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={theme.iconSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.text }]}
                      placeholder="Password"
                      placeholderTextColor={theme.textSecondary}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      { backgroundColor: theme.primary },
                      loading && styles.buttonDisabled,
                    ]}
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
                    <View
                      style={[
                        styles.dividerLine,
                        { backgroundColor: theme.border },
                      ]}
                    />
                    <Text
                      style={[
                        styles.dividerText,
                        { color: theme.textSecondary },
                      ]}
                    >
                      or continue with
                    </Text>
                    <View
                      style={[
                        styles.dividerLine,
                        { backgroundColor: theme.border },
                      ]}
                    />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.socialButton,
                      {
                        borderColor: theme.border,
                        backgroundColor: theme.surface,
                      },
                    ]}
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
                    <Text
                      style={[styles.socialButtonText, { color: theme.text }]}
                    >
                      Google
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </BlurView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "center",
  },

  // Decorative Elements
  decorationCircle1: {
    position: "absolute",
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(36, 107, 255, 0.15)",
  },
  decorationCircle2: {
    position: "absolute",
    bottom: -50,
    left: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "rgba(108, 92, 231, 0.1)",
  },

  brandSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 16,
    shadowColor: "#246bff",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 24,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  brandSubtitle: {
    fontSize: 16,
    fontWeight: "500",
  },

  formContainer: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },

  tabContainer: {
    flexDirection: "row",
    marginBottom: 24,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    padding: 4,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },

  formTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
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
    height: "100%",
  },
  primaryButton: {
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#246bff",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
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
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: "row",
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
