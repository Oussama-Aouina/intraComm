import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import VideoMessage from "./VideoMessage";
import AudioMessage from "./AudioMessage";
import { ImageBackground } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FullScreenImageModal from "./FullScreenImageModal";
import { StyleSheet } from "react-native";
import LocationMessage from "./LocationMessage";

const Message = React.memo(({ item, isCurrentUser, theme }) => {
  // these parameters to open the image in full screen when clicking it
  const [modalVisible, setModalVisible] = useState(false);
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const handleImagePress = () => {
    setModalVisible(true);
  };
  switch (item.item.type) {
    case "emoji":
      return (
        <View
          className="my-3 mb-2 w-full flex-row"
          style={{
            justifyContent: isCurrentUser ? "flex-end" : "flex-start",
            marginVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          <View className="rounded-xl">
            <Text
              className="text-3xl"
              style={{
                color: isCurrentUser ? "#000" : "#555",
                textAlign: isCurrentUser ? "right" : "left",

                // maxWidth: "70%",
              }}
            >
              {item.item.message}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: "#999",
                textAlign: isCurrentUser ? "right" : "left",
                marginTop: 5,
              }}
            >
              {item.item.time}
            </Text>
          </View>
        </View>
      );
    case "text":
      return (
        <View
          className="my-3 mb-2 w-full flex-row"
          style={{
            justifyContent: isCurrentUser ? "flex-end" : "flex-start",
            marginVertical: 10,
          }}
        >
          <View
            className="mx-2 max-w-[70%] rounded-t-3xl px-2 py-2"
            style={{
              backgroundColor: isCurrentUser
                ? theme.sender_message_background_color
                : theme.receiver_message_background_color,
              borderBottomRightRadius: isCurrentUser ? 0 : 15,
              borderBottomLeftRadius: isCurrentUser ? 15 : 0,
              maxWidth: "70%",
              marginHorizontal: 10,
            }}
          >
            <Text
              className="text-xl"
              style={{
                color: isCurrentUser
                  ? theme.sender_message_text_color
                  : theme.receiver_message_text_color,
              }}
            >
              {item.item.message}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: "#999",
                textAlign: isCurrentUser ? "right" : "left",
                marginTop: 5,
              }}
            >
              {item.item.time}
            </Text>
          </View>
        </View>
      );
    case "image":
      return (
        <>
          <View
            className="my-3 mb-2 w-full flex-row"
            style={{
              justifyContent: isCurrentUser ? "flex-end" : "flex-start",
              marginTop: 10,
              marginBottom: 30,
              paddingHorizontal: 10,
            }}
            onPress={handleImagePress}
          >
            <View
              className="mx-2 rounded-xl"
              style={{
                alignSelf: "center",
                width: 150,
                height: 200,
                borderRadius: 15,
              }}
            >
              <TouchableOpacity onPress={handleImagePress}>
                <Image
                  source={{ uri: item.item.message }}
                  style={{ width: 150, height: 200, borderRadius: 15 }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 10,
                  color: "#999",
                  textAlign: isCurrentUser ? "right" : "left",
                  marginTop: 5,
                }}
              >
                {item.item.time}
              </Text>
            </View>
          </View>
          <FullScreenImageModal
            visible={modalVisible}
            onClose={handleCloseModal}
            imageUri={item.item.message}
          />
        </>
      );
    case "video":
      return (
        <View
          className="my-3 mb-2 w-full flex-row"
          style={{
            justifyContent: isCurrentUser ? "flex-end" : "flex-start",
            marginVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          <View className="flex flex-col">
            <VideoMessage source={item.item.message} />
            <Text
              style={{
                fontSize: 10,
                color: "#999",
                textAlign: isCurrentUser ? "right" : "left",
                marginTop: 5,
              }}
            >
              {item.item.time}
            </Text>
          </View>
        </View>
      );
    case "audio":
      return (
        <View
          className="my-3 mb-2 w-full flex-row"
          style={{
            justifyContent: isCurrentUser ? "flex-end" : "flex-start",
            marginVertical: 10,
          }}
        >
          <View
            className="mx-2 max-w-[70%] rounded-t-3xl"
            style={{
              backgroundColor: isCurrentUser
                ? theme.sender_message_background_color
                : theme.receiver_message_background_color,
              borderBottomRightRadius: isCurrentUser ? 0 : 15,
              borderBottomLeftRadius: isCurrentUser ? 15 : 0,
              maxWidth: "70%",
              marginHorizontal: 10,
            }}
          >
            <AudioMessage
              source={item.item.message}
              theme={theme}
              isCurrentUser={isCurrentUser}
            />
          </View>
        </View>
      );
    case "location":
      return (
        <TouchableOpacity
          className="my-3 mb-2 w-full flex-row"
          style={{
            justifyContent: isCurrentUser ? "flex-end" : "flex-start",
            marginVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          <LocationMessage
            location={item.item.message}
            theme={theme}
            isCurrentUser={isCurrentUser}
          />
        </TouchableOpacity>
      );
    default:
      return null; // or some fallback UI
  }
});

export default Message;
