import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import {
  Expense,
  GroupDetails,
} from "../types/models";

import {
  getGroup,
  getGroupExpenses,
} from "../services/api";

export default function GroupDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { groupId } = route.params as {
    groupId: number;
  };

  const [group, setGroup] =
    useState<GroupDetails | null>(null);

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGroup() {
      try {
        const groupData =
          await getGroup(groupId);

        const expenseData =
          await getGroupExpenses(groupId);

        setGroup(groupData);
        setExpenses(expenseData);
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
  }, [groupId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading group...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.groupName}>
        {group?.name}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Members
        </Text>

        <Text>Yash</Text>
        <Text>Test User</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Expenses
        </Text>

        {expenses.map((expense) => (
          <Text key={expense.id}>
            {expense.description} - ₹
            {expense.amount}
          </Text>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Add Expense"
          onPress={() =>
            navigation.navigate(
              "AddExpense" as never
            )
          }
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="View Settlements"
          onPress={() =>
            navigation.navigate(
              "Settlements" as never
            )
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  buttonContainer: {
    marginBottom: 12,
  },
});