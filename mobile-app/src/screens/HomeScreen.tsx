import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import {
  useNavigation,
} from "@react-navigation/native";
import {
  useLayoutEffect,
  useEffect,
  useState,
} from "react";

import { supabase } from "../services/supabase";

import {
  getUserByAuthId,
} from "../services/api";

export default function HomeScreen() {
  const navigation = useNavigation();

  const [username, setUsername] =
    useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Logout"
          onPress={handleLogout}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  async function loadCurrentUser() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      const user =
        await getUserByAuthId(
          session.user.id
        );

      setUsername(user.username);
    } catch (error) {
      console.error(
        "Failed to load user:",
        error
      );
    }
  }

  async function handleLogout() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      Alert.alert(
        "Logout Failed",
        error.message
      );

      return;
    }

    Alert.alert(
      "Success",
      "Logged out successfully"
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Hello {username} 👋
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Open Group"
          onPress={() =>
            navigation.navigate(
              "GroupsList" as never
            )
          }
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Create Group"
          onPress={() =>
            navigation.navigate(
              "CreateGroup" as never
            )
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  greeting: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },

  buttonContainer: {
    marginTop: 24,
    width: 220,
  },
});