import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./src/screens/Login";
import Home from "./src/screens/Home";
import ProfileScreen from "./src/screens/ProfileScreen";

const Stack = createNativeStackNavigator();

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
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isSignedIn ? (
              <Stack.Screen name="Login">
                {(props) => (
                  <Login {...props} onSignInSuccess={handleSignInSuccess} />
                )}
              </Stack.Screen>
            ) : (
              <>
                <Stack.Screen name="Home">
                  {(props) => (
                    <Home
                      {...props}
                      user={user}
                      onLogout={handleLogout}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="Profile">
                  {(props) => (
                    <ProfileScreen
                      {...props}
                      user={user}
                      onLogout={handleLogout}
                    />
                  )}
                </Stack.Screen>
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
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
