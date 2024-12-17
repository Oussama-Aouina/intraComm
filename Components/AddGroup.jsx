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

const database = firebase.database();
const ref_table_profiles = database.ref("TableProfiles");
const ref_table_groupes = database.ref("TableGroups");

function AddGroup({ visible, onClose, currentId }) {
  const [profiles, setprofiles] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedProfiles, setSelectedProfiles] = useState([]);

  const [isAbleToSave, setIsAbleToSave] = useState(false);

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
  const handleCreateGroup = () => {
    if (!newGroupName) {
      console.log("Please enter a group name");
      return;
    }
    const key = ref_table_groupes.push().key;
    const newGroup = {
      id: key,
      nom: newGroupName,
      admin: currentId,
      members: [currentId, ...selectedProfiles], // Automatically add the current user to the group
    };

    // Add new group to the database
    ref_table_groupes.child(key).set(newGroup);

    // Reset form and close modal
    setNewGroupName("");
    setSelectedProfiles([]);
    // setModalVisible(false);
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-1 items-center justify-center pt-24">
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
              <TouchableOpacity onPress={handleCreateGroup}>
                <Text className="px-2 text-xl font-bold text-greenBlue-300">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
            {/* <View className="mb-10 flex w-full flex-col items-center">
            <Image source={{ uri: image }} className="h-32 w-32 rounded-full" />
            <Text className="mt-2 text-xl font-bold dark:text-white">
              {name}
            </Text>
          </View> */}
            <View className="mb-5 w-full px-4">
              <Text className="mb-2 text-lg font-bold text-gray-800 dark:text-white">
                Group Name
              </Text>
              <TouchableWithoutFeedback
                onPress={() => {
                  keyboard.dismiss();
                }}
              >
                <TextInput
                  value={newGroupName}
                  onChangeText={setNewGroupName}
                  className="w-full rounded-lg bg-gray-100 px-4 py-3 text-lg dark:bg-dark-200 dark:text-white"
                  placeholder="group name"
                />
              </TouchableWithoutFeedback>
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
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default AddGroup;
