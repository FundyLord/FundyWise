import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FundyWise</Text>

      <Text style={styles.subtitle}>
        Smart Expense Splitting & Debt Optimization
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Open Group"
          onPress={() => navigation.navigate("GroupsList" as never)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },

  buttonContainer: {
    marginTop: 24,
    width: 200,
  },
});