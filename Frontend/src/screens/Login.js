import React, { useState, useEffect } from "react";
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
} from "react-native";
import { userAPI } from "../services/api";

// Note: @react-native-google-signin/google-signin is native and may not be
// available in an Expo managed workflow. For now we use a simple placeholder
// Google button that simulates sign-in. If you want real Google auth, see
// the instructions below (expo-auth-session or eject to the bare workflow).

export default function Login({ onSignInSuccess }) {
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

  // (optional) you can check persisted auth state here

  async function handleLocalSignIn() {
    // Validation
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

      // Clear form fields
      setUsername("");
      setPassword("");

      // Success - pass user data to callback
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
    // Basic validation
    if (
      !name.trim() ||
      !signUpUsername.trim() ||
      !email.trim() ||
      !signUpPassword
    ) {
      Alert.alert("Validation", "Please fill all sign up fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Validation", "Please enter a valid email address");
      return;
    }

    // Password validation (minimum 6 characters)
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

      // Clear form fields
      setName("");
      setSignUpUsername("");
      setEmail("");
      setSignUpPassword("");

      // Success - pass user data to callback
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
    // Placeholder implementation: simulate a successful Google sign-in.
    // Replace this with a real implementation using `expo-auth-session`
    // or `@react-native-google-signin/google-signin` (native) as desired.
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setIsSignUp(false)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, !isSignUp && styles.tabTextActive]}>
              Login
            </Text>
            {!isSignUp && <View style={styles.tabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setIsSignUp(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isSignUp && styles.tabTextActive]}>
              Sign Up
            </Text>
            {isSignUp && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>

        {isSignUp ? (
          <>
            <Text style={styles.title}>Create an Account</Text>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="johndoe"
              value={signUpUsername}
              onChangeText={setSignUpUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a strong password"
              secureTextEntry
              value={signUpPassword}
              onChangeText={setSignUpPassword}
            />

            <TouchableOpacity
              style={[
                styles.primaryButton,
                loading && styles.primaryButtonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Welcome Back!</Text>

            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="your_username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[
                styles.primaryButton,
                loading && styles.primaryButtonDisabled,
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

            <View style={styles.orRow}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity
              style={[
                styles.googleButton,
                loading ? styles.googleButtonDisabled : null,
              ]}
              onPress={handleGoogleSignIn}
              activeOpacity={0.85}
              disabled={loading}
            >
              <View style={styles.googleInner}>
                <Image
                  source={{
                    uri: "https://developers.google.com/identity/images/g-logo.png",
                  }}
                  style={styles.googleLogo}
                  resizeMode="contain"
                />
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f6f7fb",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    // subtle shadow
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 18,
    color: "#111",
  },
  label: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e6e9ef",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: "#246bff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  orText: {
    textAlign: "center",
    marginVertical: 12,
    color: "#666",
  },
  googleButton: {
    width: "100%",
    height: 48,
  },
  googleButtonText: {
    textAlign: "center",
    color: "#111",
    fontWeight: "600",
  },
  googleButton: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#e6e9ef",
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  googleIconOuter: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginRight: 14,
    overflow: "hidden",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  googleLogo: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  segment: {
    width: 18,
    height: 18,
  },
  red: { backgroundColor: "#EA4335" },
  yellow: { backgroundColor: "#FBBC05" },
  green: { backgroundColor: "#34A853" },
  blue: { backgroundColor: "#4285F4" },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 14,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#e6e9ef",
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#246bff",
  },
  tabUnderline: {
    height: 2,
    backgroundColor: "#246bff",
    width: 80,
    marginTop: 8,
    borderRadius: 2,
  },
});
