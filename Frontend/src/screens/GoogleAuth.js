import { useState } from "react";
import { Text, View, StyleSheet, Button, Image } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  User,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  iosClientId:
    "597436326919-1e131906c87e6dkkesmcee2sdgta90lb.apps.googleusercontent.com",
});

const GoogleAuth = ({ onSignInSuccess }) => {
  const [auth, setAuth] = useState(null);

  async function handleGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        setAuth(response.data);
        if (onSignInSuccess) {
          onSignInSuccess(response.data);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View style={styles.container}>
      {auth ? (
        {/* <View style={styles.content}>
          <Image source={{ uri: auth.user.photo }} style={styles.photo} />
          <Text style={styles.name}>{auth.user.name}</Text>
          <Text style={styles.email}>{auth.user.email}</Text>
          <Text style={styles.successText}>Sign in successful! Loading...</Text>
        </View> */}
      ) : (
        <View style={styles.signInContainer}>
          <Text style={styles.welcomeText}>Welcome to TrendStack</Text>
          <Text style={styles.subtitle}>Please sign in to continue</Text>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            onPress={handleGoogleSignin}
          />
        </View>
      )}
    </View>
  );
};

export default GoogleAuth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  signInContainer: {
    alignItems: "center",
    width: "100%",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    fontFamily:"Cochin"
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 25,
    textAlign: "center",
  },
  content: {
    alignItems: "center",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  successText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "500",
  },
});
