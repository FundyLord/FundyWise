import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../services/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  async function handleLogin() {
    if (
      !email.trim() ||
      !password.trim()
    ) {
      Alert.alert(
        "Error",
        "Please fill all fields"
      );
      return;
    }

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      Alert.alert(
        "Login Failed",
        error.message
      );
      return;
    }

    Alert.alert(
      "Success",
      "Logged in successfully"
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Login
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title="Login"
        onPress={handleLogin}
      />

      <View style={styles.buttonSpacing} />

      <Button
        title="Create Account"
        onPress={() =>
          navigation.navigate(
            "Register" as never
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  buttonSpacing: {
    height: 12,
  },
});