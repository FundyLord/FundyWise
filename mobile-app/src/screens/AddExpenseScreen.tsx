import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createExpense } from "../services/api";

export default function AddExpenseScreen() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  async function handleAddExpense() {
    try {
      const amountValue = Number(amount);
      const paidByValue = Number(paidBy);

      await createExpense({
        group_id: 2,
        paid_by: paidByValue,
        amount: amountValue,
        description,
        participants: [
          {
            user_id: 1,
            share_amount: amountValue / 2,
          },
          {
            user_id: 2,
            share_amount: amountValue / 2,
          },
        ],
      });

      Alert.alert(
        "Success",
        "Expense added successfully"
      );

      setDescription("");
      setAmount("");
      setPaidBy("");
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Error",
        "Failed to add expense"
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>

      <TextInput
        style={styles.input}
        placeholder="Expense Description"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="Paid By User ID"
        value={paidBy}
        onChangeText={setPaidBy}
      />

      <Button
        title="Add Expense"
        onPress={handleAddExpense}
      />
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

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});