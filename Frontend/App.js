import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "./src/context/ThemeContext";

import Login from "./src/screens/Login";
import Home from "./src/screens/Home";
import ProfileScreen from "./src/screens/ProfileScreen";
import Search from "./src/screens/Search";
import UserProfileScreen from "./src/screens/UserProfileScreen";
import PostDetailsScreen from "./src/screens/PostDetailsScreen";

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
                <Stack.Screen name="UserProfile" component={UserProfileScreen} />
                <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
