import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function GroupsListScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Groups</Text>

      <View style={styles.groupCard}>
        <Text style={styles.groupName}>Trip Expenses</Text>

        <Button
          title="View Details"
          onPress={() => navigation.navigate("GroupDetails" as never)}
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

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  groupCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },

  groupName: {
    fontSize: 18,
    marginBottom: 12,
  },
});