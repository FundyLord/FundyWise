import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ScrollView,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";

import {
  useRoute,
  useNavigation,
} from "@react-navigation/native";

import {
  createExpense,
  getGroupMembers,
} from "../services/api";

import { User } from "../types/models";

export default function AddExpenseScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { groupId } = route.params as {
    groupId: number;
  };

  const [description, setDescription] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [paidBy, setPaidBy] =
    useState<number | null>(null);

  const [members, setMembers] =
    useState<User[]>([]);

  const [
    selectedParticipants,
    setSelectedParticipants,
  ] = useState<number[]>([]);

  useEffect(() => {
    async function loadMembers() {
      try {
        const data =
          await getGroupMembers(groupId);

        setMembers(data);

        if (data.length > 0) {
          setPaidBy(data[0].id);

          setSelectedParticipants(
            data.map(
              (member) => member.id
            )
          );
        }
      } catch (error) {
        console.error(
          "Failed to load members:",
          error
        );
      }
    }

    loadMembers();
  }, [groupId]);

  function toggleParticipant(
    userId: number
  ) {
    setSelectedParticipants(
      (current) => {
        if (
          current.includes(userId)
        ) {
          return current.filter(
            (id) => id !== userId
          );
        }

        return [
          ...current,
          userId,
        ];
      }
    );
  }

  async function handleAddExpense() {
    try {
      const amountValue =
        Number(amount);

      if (members.length === 0) {
        Alert.alert(
          "Error",
          "No members found in group."
        );

        return;
      }

      if (paidBy === null) {
        Alert.alert(
          "Error",
          "Please select who paid."
        );

        return;
      }

      if (
        selectedParticipants.length ===
        0
      ) {
        Alert.alert(
          "Error",
          "Please select at least one participant."
        );

        return;
      }

      const shareAmount =
        amountValue /
        selectedParticipants.length;

      await createExpense({
        group_id: groupId,
        paid_by: paidBy,
        amount: amountValue,
        description,
        participants:
          selectedParticipants.map(
            (userId) => ({
              user_id: userId,
              share_amount:
                shareAmount,
            })
          ),
      });

      Alert.alert(
        "Success",
        "Expense added successfully",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );

      setDescription("");
      setAmount("");

      if (members.length > 0) {
        setPaidBy(
          members[0].id
        );

        setSelectedParticipants(
          members.map(
            (member) =>
              member.id
          )
        );
      }
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Error",
        "Failed to add expense"
      );
    }
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ScrollView
        contentContainerStyle={
          styles.container
        }
      >
        <Text style={styles.title}>
          Add Expense
        </Text>

        <Text>
          Members: {members.length}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Expense Description"
          value={description}
          onChangeText={
            setDescription
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>
          Paid By
        </Text>

        <Picker
          selectedValue={paidBy}
          onValueChange={(value) =>
            setPaidBy(value)
          }
          style={styles.picker}
        >
          {members.map(
            (member) => (
              <Picker.Item
                key={member.id}
                label={
                  member.name
                }
                value={
                  member.id
                }
              />
            )
          )}
        </Picker>

        <Text style={styles.label}>
          Participants
        </Text>

        {members.map(
          (member) => (
            <View
              key={member.id}
              style={
                styles.participantRow
              }
            >
              <Checkbox
                value={selectedParticipants.includes(
                  member.id
                )}
                onValueChange={() =>
                  toggleParticipant(
                    member.id
                  )
                }
              />

              <Text
                style={
                  styles.participantName
                }
              >
                {member.name}
              </Text>
            </View>
          )
        )}

        <View
          style={
            styles.buttonContainer
          }
        >
          <Button
            title="Add Expense"
            onPress={
              handleAddExpense
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
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

    input: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },

    label: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
    },

    picker: {
      marginBottom: 16,
    },

    participantRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },

    participantName: {
      marginLeft: 12,
      fontSize: 16,
    },

    buttonContainer: {
      marginTop: 20,
    },
  });