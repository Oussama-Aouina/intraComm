import React from "react";
import Auth from "./Screens/Auth";
import NewUser from "./Screens/NewUser";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Screens/Home";
import Chat from "./Screens/Chat";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={Auth}></Stack.Screen>
        <Stack.Screen name="Home" component={Home}></Stack.Screen>
        <Stack.Screen
          name="NewUser"
          component={NewUser}
          options={{ headerShown: true }}></Stack.Screen>
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ headerShown: true }}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
