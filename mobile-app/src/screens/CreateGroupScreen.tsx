import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/AppNavigator";
import { supabase } from "../services/supabase";
import {
  createGroup,
  getUserByAuthId,
} from "../services/api";



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

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        Alert.alert(
          "Error",
          "You must be logged in."
        );
        return;
      }

      const currentUser =
        await getUserByAuthId(
          session.user.id
        );

      const newGroup = await createGroup({
        name: groupName,
        created_by: currentUser.id,
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
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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