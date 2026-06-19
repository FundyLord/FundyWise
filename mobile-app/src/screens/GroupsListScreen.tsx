import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/AppNavigator";
import { Group } from "../types/models";
import { getGroups } from "../services/api";

type GroupsListScreenNavigationProp =
  NativeStackNavigationProp<
    RootStackParamList,
    "GroupsList"
  >;

export default function GroupsListScreen() {
  const navigation =
    useNavigation<GroupsListScreenNavigationProp>();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGroups() {
      try {
        const data = await getGroups();
        setGroups(data);
      } catch (error) {
        console.error("Failed to load groups:", error);
      } finally {
        setLoading(false);
      }
    }

    loadGroups();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading groups...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Groups</Text>

      {groups.map((group) => (
        <View
          key={group.id}
          style={styles.groupCard}
        >
          <Text style={styles.groupName}>
            {group.name}
          </Text>

          <Button
            title="View Details"
            onPress={() =>
              navigation.navigate(
                "GroupDetails",
                {
                  groupId: group.id,
                }
              )
            }
          />
        </View>
      ))}
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

  groupCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },

  groupName: {
    fontSize: 18,
    marginBottom: 12,
  },
});