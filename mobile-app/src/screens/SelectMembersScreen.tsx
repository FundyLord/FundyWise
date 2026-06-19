import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
} from "react-native";
import { useRoute } from "@react-navigation/native";

import { User } from "../types/models";
import { getUsers } from "../services/api";

export default function SelectMembersScreen() {
  const route = useRoute();

  const { groupId } = route.params as {
    groupId: number;
  };

  const [users, setUsers] = useState<User[]>([]);
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
        <Text key={user.id}>
          {user.name}
        </Text>
      ))}

      <Button
        title="Continue"
        onPress={() => {}}
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