import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { createGroup } from "../services/api";

export default function CreateGroupScreen() {
  const navigation = useNavigation();

  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateGroup() {
    if (!groupName.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter a group name."
      );
      return;
    }

    try {
      setLoading(true);

      await createGroup({
        name: groupName,
        created_by: 1,
      });

      Alert.alert(
        "Success",
        "Group created successfully."
      );

      navigation.navigate("GroupsList" as never);
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Error",
        "Failed to create group."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Create Group
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter group name"
        value={groupName}
        onChangeText={setGroupName}
      />

      <Button
        title={
          loading
            ? "Creating..."
            : "Create Group"
        }
        onPress={handleCreateGroup}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});