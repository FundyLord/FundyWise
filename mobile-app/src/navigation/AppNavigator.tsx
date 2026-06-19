import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import GroupsListScreen from "../screens/GroupsListScreen";
import GroupDetailsScreen from "../screens/GroupDetailsScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import SettlementScreen from "../screens/SettlementScreen";
import CreateGroupScreen from "../screens/CreateGroupScreen";

export type RootStackParamList = {
  Home: undefined;
  GroupsList: undefined;
  GroupDetails: {
    groupId: number;
  };
  AddExpense: {
    groupId: number;
  };
  Settlements: {
    groupId: number;
  };
  CreateGroup: undefined;
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

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

      <Stack.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
      />
    </Stack.Navigator>
  );
}