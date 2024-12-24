import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import firebase from "./config"; // Ensure you have Firebase initialized here
import Auth from "./Screens/Auth";
import NewUser from "./Screens/NewUser";
import Home from "./Screens/Home";
import Chat from "./Screens/Chat";
import ChatGroup from "./Screens/ChatGroup";
import CompleteProfile from "./Screens/CompleteProfile";
import { ColorThemeProvider } from "./hooks/ColorThemeHook";
import { ActivityIndicator, Platform, View } from "react-native";
import "./global.css";
import PositionInMap from "./Screens/PositionInMap";
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // const [userId, setUserId] = useState(
  //   Platform.OS === "ios"
  //     ? "8WHvOBIu8yXAdWlWhbxPM5SIOK12"
  //     : "SgsAeWF1Y0b05jqBYDRFSbkmrCb2",
  // );

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid); // User is logged in
      } else {
        setUserId(null); // User is not logged in
      }
      setIsLoading(false); // Firebase auth state is resolved
    });

    return unsubscribe; // Clean up the listener on unmount
  }, []);

  if (isLoading) {
    // Show a loading spinner while Firebase Auth initializes
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <ColorThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={userId ? "Home" : "Auth"} // Conditionally set initial route
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Auth" component={Auth}></Stack.Screen>
          <Stack.Screen
            name="Home"
            component={Home}
            initialParams={{ currentId: userId }} // Pass userId to Home screen
          ></Stack.Screen>
          <Stack.Screen
            name="NewUser"
            component={NewUser}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="CompleteProfile"
            component={CompleteProfile}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="ChatGroup"
            component={ChatGroup}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="Map"
            component={PositionInMap}
            options={{ headerShown: false }}
          ></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ColorThemeProvider>
  );
}
