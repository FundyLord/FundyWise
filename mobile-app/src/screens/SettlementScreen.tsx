import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

import {
  SettlementTransaction,
  User,
} from "../types/models";

import {
  getSettlements,
  getUsers,
} from "../services/api";

export default function SettlementScreen() {
  const route = useRoute();

  const { groupId } = route.params as {
    groupId: number;
  };

  const [transactions, setTransactions] =
    useState<SettlementTransaction[]>([]);

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const settlementData =
          await getSettlements(groupId);

        const usersData =
          await getUsers();

        setTransactions(
          settlementData.transactions
        );

        setUsers(usersData);
      } catch (error) {
        console.error(
          "Failed to load settlements:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [groupId]);

  function getUserName(
    userId: number
  ): string {
    const user = users.find(
      (u) =>
        Number(u.id) ===
        Number(userId)
    );

    return user
      ? user.name
      : `User ${userId}`;
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Loading settlements...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={
          styles.container
        }
      >
        <Text style={styles.title}>
          Settlements
        </Text>

        {transactions.map(
          (transaction, index) => (
            <View
              key={index}
              style={styles.card}
            >
              <Text
                style={
                  styles.transactionText
                }
              >
                {getUserName(
                  transaction.from_user_id
                )}
                {" "}pays{" "}
                {getUserName(
                  transaction.to_user_id
                )}
              </Text>

              <Text style={styles.amount}>
                ₹{transaction.amount}
              </Text>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

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

  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },

  transactionText: {
    fontSize: 18,
    marginBottom: 8,
  },

  amount: {
    fontSize: 20,
    fontWeight: "bold",
  },
});