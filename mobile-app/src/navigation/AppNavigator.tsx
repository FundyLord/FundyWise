import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text } from "react-native";

const Stack = createNativeStackNavigator();

function HomeScreen() {
  return (
    <View>
      <Text>FundyWise Home Screen</Text>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
    </Stack.Navigator>
  );
}