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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import firebase from "../config";
import { colorScheme } from "nativewind";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { supabase } from "../config";
import { Keyboard } from "react-native";

const database = firebase.database();
const ref_table_profiles = database.ref("TableProfiles");
const ref_table_groupes = database.ref("TableGroups");

function AddGroup({ visible, onClose, currentId }) {
  const [profiles, setprofiles] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [image, setImage] = useState(
    "https://jiygkxqynazwzitdwrsn.supabase.co/storage/v1/object/public/profileImages/placeholder-image-gray-16x9-1.png.webp?t=2024-12-17T10%3A14%3A19.678Z",
  );
  const [uriImage, setUriImage] = useState();

  const [isAbleToSave, setIsAbleToSave] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      setUriImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    const response = await fetch(uriImage);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    // const blob = await response.blob();
    const base64 = await FileSystem.readAsStringAsync(uriImage, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const contentType = "image/png";
    const imageId = currentId + Date.now();
    await supabase.storage
      .from("profileImages")
      .upload(imageId, decode(base64), {
        contentType,
      });

    const { data } = supabase.storage
      .from("profileImages")
      .getPublicUrl(imageId);
    console.log("new url: " + data.publicUrl);

    return data.publicUrl;
  };

  //recuperation des profiles
  useEffect(() => {
    ref_table_profiles.on("value", (snapshot) => {
      const d = [];
      snapshot.forEach((element) => {
        if (element.val().id != currentId) {
          d.push(element.val());
        }
      });
      setprofiles(d);
    });

    return () => {
      ref_table_profiles.off();
    };
  }, []);
  const filteredProfiles = profiles.filter(
    (profile) => profile.id !== currentId,
  );

  const toggleProfileSelection = (profileId) => {
    setSelectedProfiles((prevSelected) =>
      prevSelected.includes(profileId)
        ? prevSelected.filter((id) => id !== profileId)
        : [...prevSelected, profileId],
    );
  };
  const handleCreateGroup = async () => {
    if (!newGroupName || selectedProfiles.length === 0 || !uriImage) {
      return;
    }
    const key = ref_table_groupes.push().key;
    const newGroup = {
      id: key,
      nom: newGroupName,
      linkImage: await uploadImage(),
      admin: currentId,
      members: [currentId, ...selectedProfiles], // Automatically add the current user to the group
    };

    // Add new group to the database
    ref_table_groupes.child(key).set(newGroup);

    // Reset form and close modal
    setNewGroupName("");
    setSelectedProfiles([]);
    setUriImage(null);
    // setModalVisible(false);
    onClose();
  };

  const handleReset = () => {
    setNewGroupName("");
    setSelectedProfiles([]);
    setUriImage(null);
  };
  const Item = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => toggleProfileSelection(item.id)}>
        <View
          className={`m-2 flex w-[90%] flex-row items-center justify-start rounded-xl ${
            selectedProfiles.includes(item.id)
              ? "border-2 border-greenBlue-300 bg-greenBlue-100"
              : ""
          }`}
        >
          <Image
            source={{ uri: item.linkImage }}
            className="h-12 w-12 rounded-full"
          />
          <Text className="ml-2 text-lg font-bold dark:text-white">
            {item.nom}
          </Text>
          <Text className="ml-2 text-lg font-bold dark:text-white">
            {item.pseudo}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // const handleAddGroup = () => {
  //   const ref_discussion = database.ref("Discussions").child(discussionId);
  //   ref_discussion.update({
  //     //   nickname: nickname,
  //     theme: selectedTheme,
  //   });
  //   onClose();
  // };

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      transparent={true}
      animationType="fade"
    >
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      > */}
      <View className="flex-1 items-center justify-center pt-24">
        <View className="flex h-screen w-screen flex-col items-center rounded-2xl bg-white dark:bg-dark-500">
          <View className="flex h-16 w-full flex-row items-center justify-between px-2">
            <TouchableOpacity
              onPress={() => {
                handleReset();
                onClose();
              }}
            >
              <AntDesign
                name="left"
                size={24}
                className="mr-2"
                color="#0F97A6"
              />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={handleReset}>
              <Text className="px-2 text-xl font-bold text-greenBlue-300">
                Reset
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={handleCreateGroup}>
              <Text className="px-2 text-xl font-bold text-greenBlue-300">
                Save
              </Text>
            </TouchableOpacity>
          </View>
          {/* Image */}

          <View className="mb-4 flex flex-col items-center">
            <TouchableOpacity
              onPress={async () => {
                await pickImage();
              }}
            >
              <View className="relative">
                <Image
                  source={{ uri: uriImage ? uriImage : image }}
                  className="mb-5 h-40 w-40 rounded-full"
                />
                <View className="absolute bottom-4 right-2 rounded-full border-2 border-white bg-gray-100 p-2 dark:bg-dark-500">
                  <AntDesign name="camera" size={18} color={"black"} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View className="mb-5 w-full px-4">
            <Text className="mb-2 text-lg font-bold text-gray-800 dark:text-white">
              Group Name
            </Text>

            <TextInput
              value={newGroupName}
              onChangeText={setNewGroupName}
              className="w-full rounded-lg bg-gray-100 px-4 py-3 text-lg dark:bg-dark-200 dark:text-white"
              placeholder="group name"
            />
          </View>
          {/* Themes Gallery */}
          <View className="mb-5 w-full px-4">
            <Text className="mb-2 text-lg font-bold text-gray-800 dark:text-white">
              Profiles
            </Text>
            <FlatList
              data={filteredProfiles}
              renderItem={Item}
              keyExtractor={(item) => item.id}
              //   numColumns={3}
              //   columnWrapperStyle={{
              //     justifyContent: "space-between",
              //     marginBottom: 10,
              //   }}
            />
          </View>
        </View>
      </View>
      {/* </KeyboardAvoidingView> */}
    </Modal>
  );
}

export default AddGroup;
