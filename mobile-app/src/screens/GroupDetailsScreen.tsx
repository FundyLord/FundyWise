import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
} from "react-native";

import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/AppNavigator";

import {
  Expense,
  GroupDetails,
  User,
} from "../types/models";

import {
  getGroup,
  getGroupExpenses,
  getGroupMembers,
  deleteGroup,
  getUserByAuthId,
} from "../services/api";

import { supabase } from "../services/supabase";

type GroupDetailsScreenNavigationProp =
  NativeStackNavigationProp<
    RootStackParamList,
    "GroupDetails"
  >;

export default function GroupDetailsScreen() {
  const navigation =
    useNavigation<GroupDetailsScreenNavigationProp>();

  const route = useRoute();

  const { groupId } = route.params as {
    groupId: number;
  };

  const [group, setGroup] =
    useState<GroupDetails | null>(null);

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [members, setMembers] =
    useState<User[]>([]);

  const [currentUser, setCurrentUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadGroup() {
        try {
          setLoading(true);

          const groupData =
            await getGroup(groupId);

          const expenseData =
            await getGroupExpenses(groupId);

          const memberData =
            await getGroupMembers(groupId);

          const {
            data: { session },
          } =
            await supabase.auth.getSession();

          if (session) {
            const userData =
              await getUserByAuthId(
                session.user.id
              );

            setCurrentUser(userData);
          }

          setGroup(groupData);
          setExpenses(expenseData);
          setMembers(memberData);
        } catch (error) {
          console.error(
            "Failed to load group:",
            error
          );
        } finally {
          setLoading(false);
        }
      }

      loadGroup();
    }, [groupId])
  );

  function getUserName(
    userId: number
  ): string {
    const user = members.find(
      (member) =>
        Number(member.id) ===
        Number(userId)
    );

    return user
      ? user.username
      : `User ${userId}`;
  }

  async function handleDeleteGroup() {
    Alert.alert(
      "Delete Group",
      "This will permanently delete the group, members, expenses and settlements.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const {
                data: { session },
              } =
                await supabase.auth.getSession();

              if (!session) {
                throw new Error(
                  "No active session"
                );
              }

              await deleteGroup(
                groupId,
                session.user.id
              );

              Alert.alert(
                "Success",
                "Group deleted successfully"
              );

              navigation.reset({
                index: 0,
                routes: [
                  {
                    name:
                      "GroupsList",
                  },
                ],
              });
            } catch (error) {
              console.error(
                "Failed to delete group:",
                error
              );

              Alert.alert(
                "Error",
                "Failed to delete group"
              );
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <Text>
          Loading group...
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
      <Text style={styles.groupName}>
        {group?.name}
      </Text>

      <Text style={styles.creatorText}>
        Created By:{" "}
        {group
          ? getUserName(
              group.created_by
            )
          : ""}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Members
        </Text>

        {members.map((member) => (
          <Text key={member.id}>
            {member.username}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Expenses
        </Text>

        {expenses.map((expense) => (
          <View
            key={expense.id}
            style={styles.expenseCard}
          >
            <Text
              style={
                styles.expenseDescription
              }
            >
              {expense.description}
            </Text>

            <Text>
              Amount: ₹
              {expense.amount}
            </Text>

            <Text>
              Paid By:{" "}
              {getUserName(
                expense.paid_by
              )}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Add Expense"
          onPress={() =>
            navigation.navigate(
              "AddExpense",
              {
                groupId,
              }
            )
          }
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="View Settlements"
          onPress={() =>
            navigation.navigate(
              "Settlements",
              {
                groupId,
              }
            )
          }
        />
      </View>

      {currentUser?.id ===
        group?.created_by && (
        <View
          style={
            styles.buttonContainer
          }
        >
          <Button
            title="Delete Group"
            onPress={
              handleDeleteGroup
            }
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      padding: 16,
    },

    container: {
      flexGrow: 1,
      padding: 16,
    },

    groupName: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 8,
    },

    creatorText: {
      fontSize: 16,
      marginBottom: 20,
    },

    section: {
      marginBottom: 24,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 8,
    },

    expenseCard: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
    },

    expenseDescription: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },

    buttonContainer: {
      marginBottom: 12,
    },
  });