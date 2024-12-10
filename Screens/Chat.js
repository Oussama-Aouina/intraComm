import React from "react";
import firebase from "../config";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { supabase } from "../config";
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
  TouchableOpacity,
} from "react-native";

import { set } from "firebase/database";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Message, AudioRecorder } from "../Components";

const database = firebase.database();

export default function Chat(props) {
  //retreive the users ids
  const currentId = props.route.params.currentId;
  const secondId = props.route.params.secondId;
  // animation du champ text
  const [inputFocus, setInputFocus] = useState(false);
  const animatedWidth = useRef(new Animated.Value(40)).current; // Start width at 40%
  const flatListRef = useRef();
  //input animation
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
  // recuperation de deuxieme profile
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

  // reglage des messages
  const [data, setData] = useState([]);
  // reference sur tout les discussions
  const ref_discussions = database.ref("Discussions");
  // id de la discussion
  const id = currentId > secondId ? currentId + secondId : secondId + currentId;
  //reference de la discussion courante
  const ref_une_discussion = ref_discussions.child(id);
  // recuperation de theme á partir de la discussion

  useEffect(() => {
    ref_une_discussion.on("value", (snapshot) => {
      let d = [];
      snapshot.forEach((msg) => {
        //recuperation du theme de discussion
        if (msg.key === "theme") {
          // If the key is 'theme', retrieve its value
          setDiscussionTheme(msg.val());
        } else if (msg.val().id != currentId) {
          d.push(msg.val());
        }
      });
      setData(d);
    });

    return () => {
      ref_une_discussion.off();
    };
  }, []);

  // le nom initiale du theme de discussion
  const [discussionTheme, setDiscussionTheme] = useState("default");
  //theme initale
  const [theme, setTheme] = useState({
    sides_background_color: "#0A3A40",
    icons_color: "#05F2DB",
    background_image: "dark_green_bg.jpg",
    sender_message_text_color: "#DCF8C6",
    sender_message_background_color: "#DCF8C6",
    receiver_message_text_color: "#000",
    receiver_message_background_color: "#FFF",
    emoji: "👍",
  });
  // recupration des informations du theme
  useEffect(() => {
    ref_theme = database.ref("DiscussionsThemes").child(discussionTheme);
    ref_theme.on("value", (snapshot) => {
      setTheme(snapshot.val());
    });

    return () => {
      ref_theme.off();
    };
  }, [discussionTheme]);

  // reglage des messages
  const [msg, setMsg] = useState("");
  //la fonction pour envoyer un message
  const sendMessage = (msg, typeMsg) => {
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
      type: typeMsg !== undefined ? typeMsg : "text",
    };
    console.log("Message Data:", messageData);

    ref_un_message.set(messageData).catch((error) => {
      console.error("Firebase Set Error:", error);
    });
    setMsg("");
  };
  // pour le bon display de clavier sur ios
  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setInputFocus(false);
  };

  // reglage de l'evoie des documents

  const uploadImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      cameraType: ImagePicker.CameraType.front,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });

    if (pickerResult.cancelled === true) {
      return;
    }
    const uriImage = pickerResult.assets[0].uri;

    const response = await fetch(uriImage);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    // const blob = await response.blob();
    const base64 = await FileSystem.readAsStringAsync(uriImage, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("image type", uriImage.type);
    const contentType =
      pickerResult.assets[0].type === "image" ? "image/png" : "image/jpeg";

    await supabase.storage
      .from("discussionsFiles")
      .upload("image" + currentId, decode(base64), {
        contentType,
      });

    const { data } = supabase.storage
      .from("discussionsFiles")
      .getPublicUrl("image" + currentId);
    console.log("showdata" + data);

    return data.publicUrl;
  };

  const uploadFile = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const pickerResult = await ImagePicker.launchDocumentLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }
    const response = await fetch(pickerResult.uri);
    const blob = await response.blob();
    const ref = firebase
      .storage()
      .ref()
      .child("files/" + currentId);
    ref.put(blob).then((snapshot) => {
      console.log("Uploaded a blob or file!", snapshot);
    });
    return ref.getDownloadURL();
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      cameraType: ImagePicker.CameraType.front,
      quality: 0.3,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });

    if (pickerResult.cancelled === true) {
      return;
    }

    // the uri of the photo or the video
    const uriImage = pickerResult.assets[0].uri;
    // the id of the new image/video to upload
    const docId = currentId + Date.now();
    try {
      // Read the image as a Base64 string
      const base64 = await FileSystem.readAsStringAsync(uriImage, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log("file type: " + pickerResult.assets[0].type);
      const mediaType = pickerResult.assets[0].type;
      // Determine the content type
      const contentType =
        pickerResult.assets[0].type === "image" ? "image/png" : "video/mp4"; // Default to JPEG if type is not available
      console.log("Content Type:", contentType);
      // Upload the image to Supabase storage
      const { data, error } = await supabase.storage
        .from("discussionsFiles")
        .upload(docId, decode(base64), {
          contentType: contentType,
          upsert: true, // Update the file if it already exists
        });

      if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
      }

      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from("discussionsFiles")
        .getPublicUrl(docId);

      if (!publicUrlData) {
        throw new Error("Failed to retrieve the public URL.");
      }

      console.log(
        "File uploaded successfully. Public URL:",
        publicUrlData.publicUrl,
      );
      return [publicUrlData.publicUrl, mediaType];
    } catch (error) {
      console.error("Error uploading the file:", error);
      alert("Something went wrong while uploading the file.");
      return null;
    }
  };
  const [photo, setPhoto] = useState(null);
  const hadleTakePhoto = async () => {
    const [photo, type] = await takePhoto();
    setPhoto(photo);

    sendMessage(photo, type);
  };

  const [recorderVisible, setRecorderVisible] = useState(false);

  return (
    //sectionList tnajem tafichilek 7asb parametre enti 3inek bih (exemple : par jour)
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View className="h-full w-full flex-col">
        <StatusBar
          barStyle={theme.barStyle ? "light-content" : "dark-content"}
        />

        <ImageBackground
          source={{ uri: theme.background_image }}
          // style={styles.container}
          className="w-full flex-1"
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View
            className="flex h-16 w-full flex-row items-center justify-start px-2"
            style={{
              marginTop: Platform.OS === "ios" ? 20 : 30,
              backgroundColor: theme.sides_background_color,
            }}
          >
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <AntDesign
                name="left"
                size={24}
                className="mr-2"
                color={theme.icons_color}
              />
            </TouchableOpacity>
            <Image
              className="h-12 w-12 rounded-full"
              source={{
                uri: secondProfile.linkImage,
              }}
            />
            <Text
              className="ml-2 text-xl font-bold"
              style={{
                color: theme.user_name_color ? theme.user_name_color : "#FFF",
              }}
            >
              {secondProfile.nom} {secondProfile.pseudo}
            </Text>
            <TouchableOpacity className="ml-auto">
              <FontAwesome name="phone" size={28} color={theme.icons_color} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="videocam"
                size={28}
                color={theme.icons_color}
                className="mx-6"
              />
            </TouchableOpacity>
          </View>
          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={data}
            scrollEnabled={true} // Explicitly enable scrolling
            nestedScrollEnabled={true}
            keyExtractor={(item, index) => item.id || index.toString()}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            renderItem={(item) => {
              const isCurrentUser = item.item.sender === currentId;
              return (
                <Message
                  item={item}
                  isCurrentUser={isCurrentUser}
                  theme={theme}
                />
              );
            }}
          />
          {/* Files inputs */}

          {recorderVisible ? (
            <AudioRecorder
              visible={recorderVisible}
              setRecordVisible={setRecorderVisible}
              sendMessage={sendMessage}
              theme={theme}
            />
          ) : (
            <View
              // style={{ flexDirection: "row", width: "100%", borderColor: "#ff00" }}
              className="w-full flex-row items-center justify-between px-4 py-2"
              style={{
                backgroundColor: theme.sides_background_color,
              }}
            >
              {inputFocus ? (
                <TouchableOpacity onPress={() => setInputFocus(false)}>
                  <AntDesign name="right" size={26} color={theme.icons_color} />
                </TouchableOpacity>
              ) : (
                <View
                  className="flex flex-row"
                  style={{
                    width: inputFocus ? "0%" : "auto",
                  }}
                >
                  <TouchableOpacity>
                    <MaterialIcons
                      name="add-circle"
                      size={30}
                      color={theme.icons_color}
                      className="mr-3"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      hadleTakePhoto();
                    }}
                  >
                    <FontAwesome
                      name="camera"
                      size={26}
                      color={theme.icons_color}
                      className="mx-3"
                      onPress={() => {
                        hadleTakePhoto();
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setRecorderVisible(true);
                    }}
                  >
                    <FontAwesome
                      name="microphone"
                      size={28}
                      color={theme.icons_color}
                      className="mx-3"
                    />
                  </TouchableOpacity>
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
                    className="h-full w-full px-3 text-xl"
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
              {msg.length > 0 ? (
                <Ionicons
                  name="send"
                  className=""
                  size={26}
                  color={theme.icons_color}
                  onPress={() => {
                    sendMessage(msg);
                  }}
                />
              ) : (
                <Text
                  className="text-3xl"
                  onPress={() => {
                    sendMessage(theme.emoji, "emoji");
                  }}
                >
                  {theme.emoji}
                </Text>
              )}
            </View>
          )}
        </ImageBackground>
      </View>
    </KeyboardAvoidingView>
  );
}
