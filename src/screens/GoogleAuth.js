import { useState } from "react";
import { Text, View, StyleSheet, Button,Image } from "react-native";
import {
  GoogleSignin,
  User,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  iosClientId:
    "597436326919-1e131906c87e6dkkesmcee2sdgta90lb.apps.googleusercontent.com",
});

const GoogleAuth = () => {
  const [auth, setAuth] = useState(null);

  async function handleGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        setAuth(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View>
      {auth ? (
        <View style={styles.content}>
          <Image source={{ uri: auth.user.photo }} style={styles.photo} />
          <Text>{auth.user.name}</Text>
          <Text>{auth.user.email}</Text>
        </View>
      ) : (
        <Button title="login" onPress={handleGoogleSignin} />
      )}
    </View>
  );
};

export default GoogleAuth;

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
  },
  photo: {
    width: 100,
    height: 100,
  },
});
