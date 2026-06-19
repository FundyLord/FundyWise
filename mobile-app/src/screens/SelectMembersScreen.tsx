import { useEffect, useState } from "react";
import {
  View,
 Text,
  StyleSheet,
  Button,
} from "react-native";

import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/AppNavigator";

import { User } from "../types/models";

import {
  getUsers,
  addGroupMember,
} from "../services/api";

type SelectMembersScreenNavigationProp =
  NativeStackNavigationProp<
    RootStackParamList,
    "SelectMembers"
  >;

export default function SelectMembersScreen() {
  const navigation =
    useNavigation<SelectMembersScreenNavigationProp>();

  const route = useRoute();

  const { groupId } = route.params as {
    groupId: number;
  };

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] =
    useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error(
          "Failed to load users:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  function toggleUser(userId: number) {
    setSelectedUsers((previous) => {
      if (previous.includes(userId)) {
        return previous.filter(
          (id) => id !== userId
        );
      }

      return [...previous, userId];
    });
  }

  async function handleContinue() {
    try {
      for (const userId of selectedUsers) {
        await addGroupMember(
          groupId,
          userId
        );
      }

      navigation.navigate(
        "GroupDetails",
        {
          groupId,
        }
      );
    } catch (error) {
      console.error(
        "Failed to add members:",
        error
      );
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Select Members
      </Text>

      <Text>
        Group ID: {groupId}
      </Text>

      {users.map((user) => (
        <Button
          key={user.id}
          title={
            selectedUsers.includes(user.id)
              ? `✓ ${user.name}`
              : user.name
          }
          onPress={() =>
            toggleUser(user.id)
          }
        />
      ))}

      <Button
        title="Continue"
        onPress={handleContinue}
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
});