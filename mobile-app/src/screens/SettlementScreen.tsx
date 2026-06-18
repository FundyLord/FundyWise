import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettlementScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settlements</Text>

      <View style={styles.card}>
        <Text style={styles.transactionText}>
          User 2 pays User 1
        </Text>

        <Text style={styles.amount}>
          ₹500
        </Text>
      </View>
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