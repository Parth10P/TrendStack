import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Button,
  TextInput,
} from "react-native";

const Login = () => {
  const [text, setText] = useState(" ");
  const [pass, setPass] = useState(" ");
  const handlePress = () => {
    alert("Button Pressed!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        placeholder="enter your username"
        onChangeText={(newText) => setText(newText)}
        value={text}
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="enter your password"
        onChangeText={(newText) => setPass(newText)}
        value={pass}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={2}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  displayText: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default Login;
