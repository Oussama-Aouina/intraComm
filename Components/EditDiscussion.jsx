import React, { useState, useEffect } from "react";
import { Modal } from "react-native-paper";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ImageBackground,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import firebase from "../config";

const database = firebase.database();

function EditDiscussion({
  visible,
  onClose,
  image,
  name,
  discussionId,
  discussionTheme,
}) {
  const [nickname, setNickname] = useState("");
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(discussionTheme);
  const [isAbleToSave, setIsAbleToSave] = useState(false);

  useEffect(() => {
    const ref_themes = database.ref("DiscussionsThemes");
    ref_themes.on("value", (snapshot) => {
      const themes = snapshot.val();
      const themesList = [];
      for (let id in themes) {
        themesList.push({ id, ...themes[id] });
      }
      setThemes(themesList);
    });

    // Cleanup listener on unmount
    return () => ref_themes.off();
  }, []);

  useEffect(() => {
    // Update isAbleToSave whenever selectedTheme or discussionTheme changes
    setIsAbleToSave(selectedTheme !== discussionTheme);
  }, [selectedTheme, discussionTheme]);

  console.log("EditDiscussion", {
    selectedTheme,
    discussionTheme,
    isAbleToSave,
  });
  const Item = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => setSelectedTheme(item.id)}>
        <View
          className={`mx-2 flex flex-col items-center justify-center ${
            selectedTheme.toUpperCase() === item.id.toUpperCase()
              ? "border-2 border-blue-500"
              : ""
          }`}
        >
          <ImageBackground
            source={{ uri: item.background_image }}
            className="h-[170px] w-[100px] items-center rounded-xl"
          >
            <Text
              className="rounded-sm px-1 text-xs font-bold"
              style={{
                color: item.sender_message_text_color,
                backgroundColor: item.sender_message_background_color,
              }}
            >
              {"" + item.id.toUpperCase()}
            </Text>
            <Text>{item.emoji}</Text>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    );
  };

  const handleEditDiscussion = () => {
    const ref_discussion = database.ref("Discussions").child(discussionId);
    ref_discussion.update({
      //   nickname: nickname,
      theme: selectedTheme,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      transparent={true}
      animationType="fade"
    >
      <View className="flex-1 items-center justify-center pt-10">
        <View className="flex h-screen w-screen flex-col items-center rounded-2xl bg-white dark:bg-dark-500">
          <View className="flex h-16 w-full flex-row items-center justify-between px-2">
            <TouchableOpacity onPress={onClose}>
              <AntDesign
                name="left"
                size={24}
                className="mr-2"
                color="#0F97A6"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEditDiscussion}>
              <Text className="px-2 text-xl font-bold text-greenBlue-300">
                Save
              </Text>
            </TouchableOpacity>
          </View>
          <View className="mb-10 flex w-full flex-col items-center">
            <Image source={{ uri: image }} className="h-32 w-32 rounded-full" />
            <Text className="mt-2 text-xl font-bold dark:text-white">
              {name}
            </Text>
          </View>
          <View className="mb-5 w-full px-4">
            <Text className="mb-2 text-lg font-bold text-gray-800 dark:text-white">
              Nickname
            </Text>
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              className="w-full rounded-lg bg-gray-100 px-4 py-3 text-lg dark:bg-dark-200 dark:text-white"
              placeholder="nickname"
            />
          </View>
          {/* Themes Gallery */}
          <View className="mb-5 w-full px-4">
            <Text className="mb-2 text-lg font-bold text-gray-800 dark:text-white">
              Themes
            </Text>
            <FlatList
              data={themes}
              renderItem={Item}
              keyExtractor={(item) => item.id}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default EditDiscussion;
