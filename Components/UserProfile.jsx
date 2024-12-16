import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Switch,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "react-native-vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Loading from "../Components/Loading";
import { toggleColorScheme } from "../hooks/ColorThemeHook";
import { colorScheme } from "nativewind";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { supabase } from "../config";
import firebase from "../config";
// import Loading from "./Loading";

export default function UserProfile({
  navigation,
  onDeleteAccount,
  currentId,
  isDark,
  setIsDark,
}) {
  const database = firebase.database();
  const auth = firebase.auth();
  const email = "o@g.co";

  const [nom, setNom] = useState();
  const [pseudo, setPseudo] = useState();
  const [telephone, setTelephone] = useState();
  const [isDefaultImage, setIsDefaultImage] = useState(true);
  const [uriImage, setUriImage] = useState();
  const [profile, setProfile] = useState(null);
  const [isupdating, setIsupdating] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
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
    const contentType = uriImage.type === "image/png";
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

  useEffect(() => {
    const ref_profile = database.ref("TableProfiles/unprofil" + currentId);
    ref_profile.on("value", (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      setNom(data.nom);
      setPseudo(data.pseudo);
      setTelephone(data.telephone);
      setUriImage(data.linkImage);
      setProfile(data);
    });
    return () => {
      ref_profile.off("value");
    };
  }, []);
  const [isEnabled, setIsEnabled] = useState(isDark);

  const toggleSwitch = () => {
    toggleColorScheme();
    setIsEnabled((previousState) => !previousState);
    setIsDark((previousState) => !previousState);
  };

  const handleSaveChanges = async () => {
    // Logic to save the updated user data
    if (!pseudo || !telephone) {
      return Alert.alert("Error", "Please fill in all the fields!");
    }
    let newImage = uriImage;
    if (newImage != profile.linkImage) {
      setIsupdating(true);
      //upload the image to the storage
      newImage = await uploadImage();
      console.log("newImage", newImage);
    }
    console.log("newImage", newImage);
    database
      .ref("TableProfiles/unprofil" + currentId)
      .update({
        pseudo,
        telephone,
        linkImage: newImage,
      })
      .then(() => {
        setIsupdating(false);
        Alert.alert("Success", "Your changes have been saved!");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });

    // Update the user data in the database

    // Update the user data in the state
  };

  const onLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  const cancelChanges = () => {
    // Logic to cancel the changes
    setPseudo(profile.pseudo);
    setTelephone(profile.telephone);
    setUriImage(profile.linkImage);
  };
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action is irreversible.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDeleteAccount },
      ],
    );
  };

  return (
    <View className="h-full w-full bg-gray-100 px-5 pt-10 dark:bg-dark-500">
      {/* Header section */}
      <View className="my-2 flex w-full flex-row items-center justify-between">
        <TouchableOpacity className="" onPress={cancelChanges}>
          <Text className="text-lg font-bold text-greenBlue-300">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-center text-2xl font-bold text-black dark:text-white">
          Settings
        </Text>
        <TouchableOpacity
          className=""
          onPress={async () => {
            await handleSaveChanges();
          }}
        >
          <Text className="text-lg font-bold text-greenBlue-300">Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="w-full py-10"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {/* Profile Picture and the Name */}
        <View className="mb-10 flex flex-col items-center">
          <TouchableOpacity
            onPress={async () => {
              await pickImage();
              setIsDefaultImage(false);
            }}
          >
            <View className="relative">
              <Image
                source={{ uri: uriImage }}
                className="mb-5 h-40 w-40 rounded-full"
              />
              <View className="absolute bottom-4 right-2 rounded-full border-2 border-white bg-gray-100 p-2 dark:bg-dark-500">
                <AntDesign
                  name="camera"
                  size={18}
                  color={!isEnabled ? "black" : "white"}
                />
              </View>
            </View>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800 dark:text-white">
            {"" +
              nom?.charAt(0).toUpperCase() +
              nom?.slice(1).toLowerCase() +
              " " +
              pseudo?.charAt(0).toUpperCase() +
              pseudo?.slice(1)}
          </Text>
        </View>
        {/* Email , Pseudo and Phone number modifiers */}
        <View className="mb-10 flex w-full flex-col items-center rounded-xl bg-white p-4 dark:bg-dark-200">
          {/* email Input */}
          <View className="w-full">
            <Text className="mb-2 text-lg font-bold text-gray-800 dark:text-white">
              Email
            </Text>
            <Text className="mb-6 w-full rounded-lg bg-gray-100 px-4 py-3 text-lg text-dark-200 dark:bg-dark-500 dark:text-dark-200">
              {email?.toLowerCase()}
            </Text>
          </View>
          {/* Pseudo Input */}
          <View className="w-full">
            <Text className="mb-2 text-lg font-bold text-gray-800 dark:text-white">
              Pseudo
            </Text>
            <TextInput
              value={pseudo}
              onChangeText={setPseudo}
              className="mb-6 w-full rounded-lg bg-gray-100 px-4 py-3 text-lg dark:bg-dark-500 dark:text-white"
              placeholder="Enter your pseudo"
            />
          </View>

          {/* Numero Input */}
          <View className="w-full">
            <Text className="mb-2 text-lg font-bold text-gray-800 dark:text-white">
              Phone Number
            </Text>
            <TextInput
              value={telephone}
              onChangeText={setTelephone}
              keyboardType="phone-pad"
              className="mb-6 w-full rounded-lg bg-gray-100 px-4 py-3 text-lg dark:bg-dark-500 dark:text-white"
              placeholder="Enter your phone number"
            />
          </View>
        </View>

        {/* Blocked Persons */}
        {/* <Text className="mb-2 text-lg font-bold text-gray-800 dark:text-white">
          Blocked Persons
        </Text>
        <View className="mb-6 w-full rounded-lg bg-gray-200 px-4 py-3 dark:bg-dark-200 dark:text-white">
          {blockedPersons.length > 0 ? (
            blockedPersons.map((person, index) => (
              <Text
                key={index}
                className="text-lg text-gray-700 dark:text-white"
              >
                {person}
              </Text>
            ))
          ) : (
            <Text className="text-lg text-gray-500 dark:text-gray-400">
              No blocked persons.
            </Text>
          )}
        </View> */}
        <View className="mb-10 flex w-full flex-col items-center rounded-xl bg-white px-4 py-3 dark:bg-dark-200">
          {/* Theme Toggle */}
          <View className="flex w-full flex-row items-center justify-between">
            <Ionicons
              name="moon"
              size={24}
              color={isEnabled ? "white" : "black"}
            />
            <Text className="text-lg font-bold text-gray-800 dark:text-white">
              Dark Mode
            </Text>

            <Switch
              trackColor={{ false: "#0A3A40", true: "#1ED9D9" }}
              thumbColor={isEnabled ? "#05F2DB" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
        <View className="mb-10 flex w-full flex-col items-center gap-4 rounded-xl bg-white px-4 py-3 dark:bg-dark-200">
          {/* Logout Button */}
          <TouchableOpacity
            onPress={onLogout}
            className="flex w-full flex-row items-center justify-around rounded-lg border-2 border-red-400 py-3"
          >
            <Text className="text-center text-lg text-red-400">Logout</Text>
            <AntDesign name="logout" size={24} color="#F87171" />
          </TouchableOpacity>
        </View>
        {isupdating && <Loading text={"Updating ..."} />}
        <View className="h-10"></View>
        {/* Delete Account Button */}
        {/* <View className="mb-10 flex w-full flex-col items-center rounded-xl bg-white px-4 py-3 dark:bg-dark-200">
          <TouchableOpacity
            onPress={handleDeleteAccount}
            className="flex w-full flex-row items-center justify-around rounded-lg border-2 border-red-400 bg-red-400 py-3"
          >
            <Text className="text-center text-lg text-white">
              Delete Account
            </Text>
            <AntDesign name="delete" size={24} color="white" />
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </View>
  );
}
