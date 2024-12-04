import React from "react";
import firebase from "../config";
import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StatusBar,
  ImageBackground,
  FlatList,
  Image,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { set } from "firebase/database";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const database = firebase.database();

export default function Chat(props) {
  //retreive the users ids
  const currentId = props.route.params.currentId;
  const secondId = props.route.params.secondId;

  const theme = {
    sides_background_color: "#0A3A40",
    icons_color: "#05F2DB",
    background_image: "dark_green_bg.jpg",
    sender_message_text_color: "#DCF8C6",
    sender_message_background_color: "#DCF8C6",
    receiver_message_text_color: "#000",
    receiver_message_background_color: "#FFF",
    emoji: "👍",
  };
  const [inputFocus, setInputFocus] = useState(false);
  const animatedWidth = useRef(new Animated.Value(40)).current; // Start width at 40%
  const flatListRef = useRef();
  useEffect(() => {
    // Animate width when inputFocus changes
    Animated.timing(animatedWidth, {
      toValue: inputFocus ? 70 : 45, // Target width percentage
      duration: 300, // Animation duration in ms
      useNativeDriver: false, // Required for layout properties like width
    }).start();
  }, [inputFocus]);

  const ref_profiles = database.ref("TableProfiles");
  const ref_current_profile = ref_profiles.child("unprofil" + currentId);
  const ref_second_profile = ref_profiles.child("unprofil" + secondId);
  // i want to retreive the data of the second user
  const [secondProfile, setSecondProfile] = useState({});

  useEffect(() => {
    ref_second_profile.on("value", (snapshot) => {
      setSecondProfile(snapshot.val());
      newProfile = snapshot.val();
      console.log("Second Profile:", newProfile);
    });

    return () => {
      ref_second_profile.off();
    };
  }, []);

  const [data, setData] = useState([]);
  // les params de discussion
  const ref_discussions = database.ref("Discussions");
  const id = currentId > secondId ? currentId + secondId : secondId + currentId;
  const ref_une_discussion = ref_discussions.child(id);

  useEffect(() => {
    ref_une_discussion.on("value", (snapshot) => {
      let d = [];
      snapshot.forEach((msg) => {
        if (msg.val().id != currentId) {
          d.push(msg.val());
        }
      });
      setData(d);
    });

    return () => {
      ref_une_discussion.off();
    };
  }, []);

  //les champs changeable

  const [msg, setMsg] = useState("");
  //la fonction pour envoyer un message
  const sendMessage = () => {
    if (!msg) return;
    const base_ref = database.ref();
    const ref_discussions = base_ref.child("Discussions");
    const id =
      currentId > secondId ? currentId + secondId : secondId + currentId;
    if (!currentId || !secondId) {
      console.error("Invalid IDs provided:", { currentId, secondId });
      return;
    }
    const ref_une_discussion = ref_discussions.child(id);
    const key = ref_une_discussion.push().key;
    const ref_un_message = ref_une_discussion.child(key);
    const messageData = {
      message: msg,
      time: new Date().toLocaleString(),
      sender: currentId,
      receiver: secondId,
    };
    console.log("Message Data:", messageData);

    ref_un_message.set(messageData).catch((error) => {
      console.error("Firebase Set Error:", error);
    });
    setMsg("");
  };
  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setInputFocus(false);
  };

  return (
    //sectionList tnajem tafichilek 7asb parametre enti 3inek bih (exemple : par jour)
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View className="h-full w-full flex-col">
        {Platform.OS !== "ios" && <StatusBar barStyle="dark-content" />}
        {/* Header */}
        <View
          className="flex h-16 w-full flex-row items-center justify-start px-2"
          style={{
            marginTop: Platform.OS === "ios" ? 20 : 30,
            backgroundColor: theme.sides_background_color,
          }}
        >
          <AntDesign
            name="left"
            size={24}
            className="mr-2"
            color={theme.icons_color}
            onPress={() => props.navigation.goBack()}
          />
          <Image
            className="h-12 w-12 rounded-full"
            source={{
              uri: secondProfile.linkImage,
            }}
          />
          <Text className="ml-2 text-xl font-bold text-white">
            {secondProfile.nom} {secondProfile.pseudo}
          </Text>
          <FontAwesome
            name="phone"
            size={28}
            color={theme.icons_color}
            className="ml-auto"
          />
          <Ionicons
            name="videocam"
            size={28}
            color={theme.icons_color}
            className="mx-6"
          />
        </View>
        {/* Messages */}
        <ImageBackground
          source={require("../assets/images/dark_green_bg.jpg")}
          // style={styles.container}
          className="w-full flex-1"
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <FlatList
            ref={flatListRef}
            data={data}
            scrollEnabled={true} // Explicitly enable scrolling
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            renderItem={(item) => {
              const isCurrentUser = item.item.sender === currentId;
              return (
                <View
                  className="my-3 w-full flex-row"
                  style={{
                    justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                  }}
                >
                  <View
                    className="mx-2 max-w-[70%] rounded-xl p-2"
                    style={{
                      backgroundColor: isCurrentUser
                        ? theme.sender_message_background_color
                        : theme.receiver_message_background_color,
                    }}
                  >
                    <Text
                      className="text-xl"
                      style={{ color: isCurrentUser ? "#000" : "#555" }}
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
            }}
          />

          <View
            // style={{ flexDirection: "row", width: "100%", borderColor: "#ff00" }}
            className="w-full flex-row items-center justify-between px-4 py-2"
            style={{
              backgroundColor: theme.sides_background_color,
            }}
          >
            {inputFocus ? (
              <AntDesign
                name="right"
                size={26}
                color={theme.icons_color}
                onPress={() => setInputFocus(false)}
              />
            ) : (
              <View
                className="flex flex-row"
                style={{
                  width: inputFocus ? "0%" : "auto",
                }}
              >
                <MaterialIcons
                  name="add-circle"
                  size={30}
                  color={theme.icons_color}
                  className="mr-3"
                />
                <FontAwesome
                  name="camera"
                  size={26}
                  color={theme.icons_color}
                  className="mx-3"
                />

                <FontAwesome
                  name="microphone"
                  size={28}
                  color={theme.icons_color}
                  className="mx-3"
                />
              </View>
            )}
            {/* Input section */}
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
              <Animated.View
                className="mx-3 h-12 flex-1 rounded-full bg-white"
                style={[
                  {
                    width: animatedWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"], // Convert animated value to percentage
                    }),
                  },
                ]}
              >
                <TextInput
                  className="h-full w-full pl-3 text-xl"
                  placeholder="Aa"
                  onFocus={() => setInputFocus(true)}
                  onBlur={() => setInputFocus(false)}
                  onChangeText={(text) => {
                    setMsg(text);
                    setInputFocus(true);
                  }}
                  onPress={() => setInputFocus(true)}
                  value={msg.length > 0 ? msg : ""}
                />
              </Animated.View>
            </TouchableWithoutFeedback>
            <Ionicons
              name="send"
              className=""
              size={26}
              color={theme.icons_color}
              onPress={() => {
                sendMessage();
              }}
            />
          </View>
        </ImageBackground>
      </View>
    </KeyboardAvoidingView>
  );
}
