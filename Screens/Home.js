import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import React from "react";
import { Button } from "react-native-paper";
import ListProfils from "./Home/ListProfils";
import Groupe from "./Home/Groupe";
import MyProfil from "./Home/MyProfil";
import firebase from "../config";
import { decode } from "base64-arraybuffer";
import { colorScheme } from "nativewind";
import { toggleColorScheme } from "../hooks/ColorThemeHook";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableHighlight } from "react-native";
import { useState } from "react";

const Tab = createMaterialBottomTabNavigator();
export default function Home(props) {
  const currentId =
    props.route.initialParams?.currentId ||
    props.route.params?.currentId ||
    firebase.auth().currentUser?.uid;

  // const iconsColor = colorScheme.get() == "light" ? "#000" : "#fff";
  const [isDark, setIsDark] = useState(colorScheme.get() === "dark");
  const iconsActiveColor = "#0F97A6";
  const iconsInActiveColor = "#5C5C5C";
  const backgroundColor = !isDark ? "#ffff" : "#2B2B2B";
  console.log(`User ID: ${currentId}`);

  // const currentId = "SgsAeWF1Y0b05jqBYDRFSbkmrCb2";
  return (
    <Tab.Navigator
      activeColor={iconsActiveColor}
      inactiveColor={iconsInActiveColor}
      barStyle={{
        // backgroundColor: colorScheme.get() == "light" ? "#ffff" : "#2B2B2B",
        backgroundColor: !isDark ? "#ffff" : "#2B2B2B",
        height: 70,
      }}
      activeIndicatorStyle={{
        backgroundColor: "transparent",
      }}
    >
      <Tab.Screen
        name="ListProfils"
        component={ListProfils}
        initialParams={{ currentId: currentId }}
        options={{
          tabBarLabel: "Chats",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="wechat" color={color} size={30} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Groups"
        component={Groupe}
        options={{
          tabBarLabel: "Groups",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-group"
              color={color}
              size={30}
            />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="MyProfil"
        component={MyProfil}
        initialParams={{
          currentId: currentId,
          isDark: isDark,
          setIsDark: setIsDark,
        }}
        options={{
          tabBarLabel: "Account",

          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={30} />
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}
