import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function GroupDetailsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.groupName}>Trip Expenses</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Members</Text>
        <Text>Yash</Text>
        <Text>Test User</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expenses</Text>
        <Text>Dinner - ₹1000</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Add Expense"
          onPress={() => navigation.navigate("AddExpense" as never)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="View Settlements"
          onPress={() => navigation.navigate("Settlements" as never)}
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