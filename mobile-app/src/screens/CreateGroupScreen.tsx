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
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/AppNavigator";
import { createGroup } from "../services/api";

type CreateGroupScreenNavigationProp =
  NativeStackNavigationProp<
    RootStackParamList,
    "CreateGroup"
  >;

export default function CreateGroupScreen() {
  const navigation =
    useNavigation<CreateGroupScreenNavigationProp>();

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

      const newGroup = await createGroup({
        name: groupName,
        created_by: 1,
      });

      Alert.alert(
        "Success",
        "Group created successfully."
      );

      navigation.navigate(
        "SelectMembers",
        {
          groupId: newGroup.id,
        }
      );
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