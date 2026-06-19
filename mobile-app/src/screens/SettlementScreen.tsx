import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

import {
  SettlementTransaction,
} from "../types/models";

import {
  getSettlements,
} from "../services/api";

export default function SettlementScreen() {
  const route = useRoute();

  const { groupId } = route.params as {
    groupId: number;
  };

  const [transactions, setTransactions] = useState<
    SettlementTransaction[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettlements() {
      try {
        const data =
          await getSettlements(groupId);

        setTransactions(data.transactions);
      } catch (error) {
        console.error(
          "Failed to load settlements:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettlements();
  }, [groupId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading settlements...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Settlements
      </Text>

      {transactions.map((transaction, index) => (
        <View
          key={index}
          style={styles.card}
        >
          <Text style={styles.transactionText}>
            User {transaction.from_user_id}
            {" "}pays{" "}
            User {transaction.to_user_id}
          </Text>

          <Text style={styles.amount}>
            ₹{transaction.amount}
          </Text>
        </View>
      ))}
    </SafeAreaView>
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