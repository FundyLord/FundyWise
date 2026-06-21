import { useState, useCallback } from "react";
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
} from "../services/api";

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

  const [loading, setLoading] = useState(true);

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
      ? user.name
      : `User ${userId}`;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading group...</Text>
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Members
        </Text>

        {members.map((member) => (
          <Text key={member.id}>
            {member.name}
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
              Amount: ₹{expense.amount}
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

  groupName: {
    fontSize: 24,
    fontWeight: "bold",
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