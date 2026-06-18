import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import GroupsListScreen from "../screens/GroupsListScreen";
import GroupDetailsScreen from "../screens/GroupDetailsScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import SettlementScreen from "../screens/SettlementScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />

      <Stack.Screen
        name="GroupsList"
        component={GroupsListScreen}
      />

      <Stack.Screen
        name="GroupDetails"
        component={GroupDetailsScreen}
      />

      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
      />

      <Stack.Screen
        name="Settlements"
        component={SettlementScreen}
      />
    </Stack.Navigator>
  );
}