import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Login from "./src/screens/Login";
import GoogleAuth from "./src/screens/GoogleAuth";
import { PaperProvider } from "react-native-paper";
import Home from "./src/screens/Home";
import { SafeAreaView } from "react-native";

export default function App() {
  return (
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          <Home />
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
