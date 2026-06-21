import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
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
  getUserByAuthId,
} from "../services/api";

import { supabase } from "../services/supabase";

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

  const [users, setUsers] =
    useState<User[]>([]);

  const [selectedUsers, setSelectedUsers] =
    useState<number[]>([]);

  const [currentUserId, setCurrentUserId] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          return;
        }

        const currentUser =
          await getUserByAuthId(
            session.user.id
          );

        setCurrentUserId(
          currentUser.id
        );

        const data =
          await getUsers();

        setUsers(data);

        setSelectedUsers([
          currentUser.id,
        ]);
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

  function toggleUser(
    userId: number
  ) {
    if (
      userId === currentUserId
    ) {
      return;
    }

    setSelectedUsers(
      (previous) => {
        if (
          previous.includes(userId)
        ) {
          return previous.filter(
            (id) => id !== userId
          );
        }

        return [
          ...previous,
          userId,
        ];
      }
    );
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
      <View style={styles.loadingContainer}>
        <Text>
          Loading users...
        </Text>
      </View>
    );
  }

  const currentUser =
    users.find(
      (user) =>
        user.id ===
        currentUserId
    );

  const otherUsers =
    users.filter(
      (user) =>
        user.id !==
        currentUserId
    );

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
      <Text style={styles.title}>
        Select Members
      </Text>

      <Text style={styles.groupId}>
        Group ID: {groupId}
      </Text>

      {currentUser && (
        <>
          <Text
            style={styles.sectionTitle}
          >
            Creator
          </Text>

          <View
            style={styles.userButton}
          >
            <Button
              title={`✓ ${currentUser.username}`}
              disabled
              onPress={() => {}}
            />
          </View>
        </>
      )}

      <Text
        style={styles.sectionTitle}
      >
        Add Members
      </Text>

      {otherUsers.map(
        (user) => (
          <View
            key={user.id}
            style={
              styles.userButton
            }
          >
            <Button
              title={
                selectedUsers.includes(
                  user.id
                )
                  ? `✓ ${user.username}`
                  : user.username
              }
              onPress={() =>
                toggleUser(
                  user.id
                )
              }
            />
          </View>
        )
      )}

      <View
        style={
          styles.continueButton
        }
      >
        <Button
          title="Continue"
          onPress={
            handleContinue
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    padding: 16,
  },

  container: {
    flexGrow: 1,
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  groupId: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
  },

  userButton: {
    marginBottom: 10,
  },

  continueButton: {
    marginTop: 20,
    marginBottom: 20,
  },
});