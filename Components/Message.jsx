import React, { useState } from "react";
import { View, Text, Image, TouchableHighlight } from "react-native";
import VideoMessage from "./VideoMessage";
import { ImageBackground } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FullScreenImageModal from "./FullScreenImageModal";

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
          }}
        >
          <View className="mx-2 max-w-[70%] rounded-xl p-2">
            <Text
              className="text-3xl"
              style={{
                color: isCurrentUser ? "#000" : "#555",
                textAlign: isCurrentUser ? "right" : "left",
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
          }}
        >
          <View
            className="mx-2 max-w-[70%] rounded-2xl p-2"
            style={{
              backgroundColor: isCurrentUser
                ? theme.sender_message_background_color
                : theme.receiver_message_background_color,
              borderBottomRightRadius: isCurrentUser ? 0 : 15,
              borderBottomLeftRadius: isCurrentUser ? 15 : 0,
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
          <TouchableHighlight
            className="my-3 mb-2 w-full flex-row"
            style={{
              justifyContent: isCurrentUser ? "flex-end" : "flex-start",
            }}
            onPress={handleImagePress}
          >
            <View className="mx-2 max-w-[70%] rounded-xl p-2">
              <Image
                source={{ uri: item.item.message }}
                style={{ width: 200, height: 200 }}
              />
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
          </TouchableHighlight>
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
          }}
        >
          <VideoMessage source={item.item.message} />
        </View>
      );
    default:
      return null; // or some fallback UI
  }
});

export default Message;
