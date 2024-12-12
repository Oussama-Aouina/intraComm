import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ImageBackground,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

function LocationMessage({ location, isCurrentUser, theme }) {
  const navigation = useNavigation();
  const longitude = location.split("#")[0].split(" ")[1];
  const latitude = location.split("#")[1].split(" ")[1];
  console.log("longitude: " + longitude + " latitude: " + latitude);
  return (
    <TouchableOpacity
      className="felx flex-col items-center"
      onPress={() => {
        console.log("Location message clicked");
        navigation.navigate("Map", {
          longitude: longitude,
          latitude: latitude,
        });
      }}
    >
      <Image
        source={require("../assets/images/plansimage.png")}
        className="h-[110px] w-[200px] rounded-t-3xl"
      ></Image>
      <View
        className="h-[60px] w-[200px] flex-col items-start justify-center rounded-b-3xl px-3"
        style={{
          backgroundColor: isCurrentUser
            ? theme.sender_message_background_color
            : theme.receiver_message_background_color,
          borderBottomRightRadius: isCurrentUser ? 0 : 15,
          borderBottomLeftRadius: isCurrentUser ? 15 : 0,
        }}
      >
        <Text
          style={{
            color: isCurrentUser
              ? theme.sender_message_color
              : theme.receiver_message_color,
            textAlign: isCurrentUser ? "right" : "left",
            marginTop: 5,
          }}
          className="text-xl font-medium tracking-wide"
        >
          Pinned Location
        </Text>
        <View className="flex flex-row items-center justify-between gap-2">
          <Text
            className="text-xs font-light tracking-wide"
            style={{
              color: isCurrentUser
                ? theme.sender_message_color
                : theme.receiver_message_color,
              textAlign: isCurrentUser ? "right" : "left",
              marginBottom: 5,
            }}
          >
            Long: {longitude}
          </Text>
          <Text
            className="text-xs font-light tracking-wide"
            style={{
              color: isCurrentUser
                ? theme.sender_message_color
                : theme.receiver_message_color,
              textAlign: isCurrentUser ? "right" : "left",
              marginBottom: 5,
            }}
          >
            Lat: {latitude}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default LocationMessage;
