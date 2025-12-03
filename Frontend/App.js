import { StatusBar } from "./node_modules/expo-status-bar/build/StatusBar";
import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "./node_modules/@react-navigation/native/lib/typescript/src";
import { createNativeStackNavigator } from "./node_modules/@react-navigation/native-stack/lib/typescript/src";
import { ThemeProvider } from "./src/context/ThemeContext";

import Login from "./src/screens/Login";
import Home from "./src/screens/Home";
import ProfileScreen from "./src/screens/ProfileScreen";
import Search from "./src/screens/Search";

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
      <ThemeProvider>
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
                      <Home {...props} user={user} onLogout={handleLogout} />
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
                  <Stack.Screen name="Search" component={Search} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
});
