import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Login from "./src/screens/Login";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignInSuccess = () => {
    setIsSignedIn(true);
  };

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          <Login onSignInSuccess={handleSignInSuccess} />
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
