import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Login from "./src/screens/Login";
import Home from "./src/screens/Home";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleSignInSuccess = (userData) => {
    setUser(userData);
    setIsSignedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsSignedIn(false);
  };

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          {isSignedIn ? (
            <Home user={user} onLogout={handleLogout} />
          ) : (
            <Login onSignInSuccess={handleSignInSuccess} />
          )}
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
});
