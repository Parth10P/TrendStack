import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import Login from "./src/screens/Login";
import GoogleAuth from "./src/screens/GoogleAuth";
import { PaperProvider } from "react-native-paper";
import Home from "./src/screens/Home";
import { SafeAreaView } from "react-native";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignInSuccess = () => {
    setIsSignedIn(true);
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        {isSignedIn ? (
          <Home />
        ) : (
          <GoogleAuth onSignInSuccess={handleSignInSuccess} />
        )}
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
