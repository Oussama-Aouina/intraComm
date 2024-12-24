import React from "react";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import firebase from "../config";
import TypingOutsideIndicator from "./TypingOutsideIndicator";

const database = firebase.database();

function formatMessageTime(dateString) {
  // Parse the date string manually
  const [datePart, timePart] = dateString.split(", ");
  const [month, day, year] = datePart.split("/").map(Number);
  //   console.log("day: ", day, "month: ", month, " year: ", year); // Debugging log
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  // Create a valid Date object
  const messageDate = new Date(year, month - 1, day, hours, minutes);
  //   console.log("messageDate: ", messageDate.toString()); // Debugging log

  const today = new Date();

  // Check if the message date is today
  const isToday =
    messageDate.getDate() === today.getDate() &&
    messageDate.getMonth() === today.getMonth() &&
    messageDate.getFullYear() === today.getFullYear();

  if (isToday) {
    // Return time in HH:MM format
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  } else {
    // Return abbreviated day name
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysOfWeek[messageDate.getDay()];
  }
}

function OneChatComponent(props) {
  //logic to know how many unread messages
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);
  const [nickname, setNickname] = useState("");
  const [otherTyping, setOtherTyping] = useState(false);

  const data = [];

  // id de la discussion
  const id =
    props.currentId > props.secondId
      ? props.currentId + props.secondId
      : props.secondId + props.currentId;
  const ref_la_discussion = database.ref("Discussions").child(id);

  // Check how many unread messages and the last message
  useEffect(() => {
    // Listener for the last 10 messages
    const listener = ref_la_discussion
      .limitToLast(10)
      .on("value", (snapshot) => {
        let messages = [];
        let unreadCount = 0;
        let lastMessage = null;

        // Iterate over each message in the snapshot
        snapshot.forEach((element) => {
          if (
            element.key !== "nicknames" &&
            element.key !== "typing" &&
            element.key !== "theme" &&
            element.key !== "last_interaction"
          ) {
            const message = element.val();
            messages.push(message);

            // Count unread messages for the current user
            if (
              message.sender !== props.currentId && // Receiver is the current user
              message.seen?.status === false // Message is not seen
            ) {
              unreadCount += 1;
            }
          }
        });

        // Get the last message
        if (messages.length > 0) {
          lastMessage = messages[messages.length - 1]; // Last message in the array
        }

        // Update states
        setUnreadMessages(unreadCount);
        if (lastMessage) {
          setLastMessage(lastMessage); // Save the last message text
          console.log("Last message: ", lastMessage);
          //   console.log("Last message: ", formatMessageTime(lastMessage.time));
        }
      });

    // Cleanup the listener on unmount
    return () => {
      ref_la_discussion.off("value", listener);
    };
  }, [props.currentId]); // Dependency array includes currentId

  useEffect(() => {
    const ref_nickname = ref_la_discussion
      .child("nicknames")
      .child(props.secondId);
    ref_nickname.on("value", (snapshot) => {
      const nickname = snapshot.val();
      if (nickname) {
        setNickname(nickname);
      }
    });
  }, []);

  // Watch the other user's typing status
  useEffect(() => {
    const typingRef = ref_la_discussion.child("typing").child(props.secondId);
    typingRef.on("value", (snapshot) => {
      setOtherTyping(snapshot.val()); // Update otherTyping state
    });
    return () => typingRef.off();
  }, []);

  return (
    <View className="flex min-h-12 w-full flex-row items-center justify-between border-b border-gray-300 py-3 dark:border-gray-500">
      <View className="flex flex-row items-start">
        <Image
          source={{ uri: props.item.item.linkImage }}
          className="h-14 w-14 rounded-full border-2 border-greenBlue-300"
        ></Image>
        <View className="ml-3 flex flex-col">
          <Text
            className="text-xl dark:text-white"
            style={{
              fontWeight:
                unreadMessages > 0 || !lastMessage ? "bold" : "normal",
            }}
          >
            {nickname
              ? nickname
              : props.item.item.nom + " " + props.item.item.pseudo}
          </Text>
          {otherTyping ? (
            <TypingOutsideIndicator />
          ) : (
            <View className="flex flex-row items-center">
              <Text
                className={`align-bottom text-base text-gray-500 dark:text-gray-400 ${unreadMessages > 0 ? "font-bold required:text-black required:dark:text-white" : "font-normal"} ${!lastMessage && "font-extrabold required:text-black required:dark:text-white"}`}
                // style={{
                //   fontWeight: unreadMessages > 0 ? "bold" : "normal",
                // }}
              >
                {lastMessage?.sender === props.currentId ? "You: " : ""}
                {(() => {
                  switch (lastMessage?.type) {
                    case "text":
                    case "emoji":
                      return "";
                    case "image":
                      return "📷 Image: ";
                    case "audio":
                      return "🎵 Audio: ";
                    case "video":
                      return "🎥 Video: ";
                    case "location:":
                      return "📍 Location: ";
                    case "file":
                      return "📄 File: ";
                    default:
                      return "Say Hello! 👋🏻 to your new friend";
                  }
                })()}
                {lastMessage?.message && lastMessage?.message.length > 20
                  ? lastMessage?.message.substring(0, 20) + "..."
                  : lastMessage?.message}
                {/* {!lastMessage?.message && "Say Hello! 👋🏻 to your new freind"} */}
              </Text>
              <Text className="h-full align-bottom text-base text-gray-500 dark:text-gray-400">
                {/* {lastMessage?.time} */}
                {lastMessage?.time &&
                  " . " + formatMessageTime("" + lastMessage?.time)}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View className="flex flex-col items-end">
        {/* <Text className="text-base dark:text-white">UnreadMessages</Text> */}
        {unreadMessages > 0 && (
          <View className="flex h-7 w-7 items-center justify-center rounded-full bg-greenBlue-300">
            <Text className="text-white">{unreadMessages}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default OneChatComponent;
