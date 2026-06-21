import {
  useState,
  useCallback,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
} from "react-native";

import {
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/AppNavigator";

import { Group } from "../types/models";

import {
  getGroups,
} from "../services/api";

import { supabase } from "../services/supabase";

type GroupsListScreenNavigationProp =
  NativeStackNavigationProp<
    RootStackParamList,
    "GroupsList"
  >;

export default function GroupsListScreen() {
  const navigation =
    useNavigation<GroupsListScreenNavigationProp>();

  const [groups, setGroups] =
    useState<Group[]>([]);

  const [loading, setLoading] =
    useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadGroups() {
        try {
          setLoading(true);

          const {
            data: { session },
          } =
            await supabase.auth.getSession();

          if (!session) {
            return;
          }

          const data =
            await getGroups(
              session.user.id
            );

          setGroups(data);
        } catch (error) {
          console.error(
            "Failed to load groups:",
            error
          );
        } finally {
          setLoading(false);
        }
      }

      loadGroups();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>
          Loading groups...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
      <Text style={styles.title}>
        Your Groups
      </Text>

      {groups.length === 0 ? (
        <Text>
          No groups found.
        </Text>
      ) : (
        groups.map((group) => (
          <View
            key={group.id}
            style={styles.groupCard}
          >
            <Text
              style={styles.groupName}
            >
              {group.name}
            </Text>

            <Button
              title="View Details"
              onPress={() =>
                navigation.navigate(
                  "GroupDetails",
                  {
                    groupId:
                      group.id,
                  }
                )
              }
            />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
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