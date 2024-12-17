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
  StatusBar,
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

const auth = firebase.auth();

export default function CompleteProfile(props) {
  const database = firebase.database();
  const currentId = props.currentId || auth.currentUser.uid; // Get the current user's ID
  const navigation = props.navigation;
  console.log("currentId", currentId);

  const [nom, setNom] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [telephone, setTelephone] = useState("");
  const [uriImage, setUriImage] = useState(null);
  const defaultImage =
    "https://jiygkxqynazwzitdwrsn.supabase.co/storage/v1/object/public/profileImages/placeholder-image-gray-16x9-1.png.webp";
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDark, setIsDark] = useState(colorScheme.get() === "dark");

  // Function to pick an image from the gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUriImage(result.assets[0].uri);
    }
  };

  // Function to upload the selected image to Supabase
  const uploadImage = async () => {
    const response = await fetch(uriImage);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
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
    return data.publicUrl; // Return the public URL of the uploaded image
  };

  // Function to save the profile data
  const handleSaveChanges = async () => {
    if (!nom || !pseudo || !telephone) {
      return Alert.alert("Error", "Please fill in all the fields!");
    }

    setIsUpdating(true);
    let newImage = uriImage;

    // Upload the image if one is selected
    if (newImage) {
      newImage = await uploadImage();
    }

    // Save the profile data to the database
    database
      .ref("TableProfiles/unprofil" + currentId)
      .set({
        id: currentId,
        nom,
        pseudo,
        telephone,
        linkImage: newImage,
      })
      .then(() => {
        setIsUpdating(false);
        Alert.alert("Success", "Your profile has been created!");
        navigation.replace("Home"); // Navigate to the home screen after profile creation
      })
      .catch((error) => {
        setIsUpdating(false);
        console.error("Error updating document: ", error);
        Alert.alert("Error", "There was an error creating your profile.");
      });
  };

  const handleCancelChanges = async () => {
    let user = auth.currentUser;
    if (user) {
      await user
        .delete()
        .then(function () {
          console.log("User deleted");
        })
        .catch(function (error) {
          console.log("Error deleting user:", error);
        });
    }
    navigation.navigate("NewUser");
  };
  // Function to toggle dark mode
  const toggleSwitch = () => {
    toggleColorScheme();
    setIsDark((prev) => !prev);
  };

  return (
    <View className="h-full w-full bg-gray-100 px-5 pt-10 dark:bg-dark-500">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="my-2 flex w-full flex-row items-center justify-between">
        <TouchableOpacity onPress={handleCancelChanges}>
          <Text className="text-lg font-bold text-greenBlue-300">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-center text-2xl font-bold text-black dark:text-white">
          Create Profile
        </Text>
        <TouchableOpacity onPress={handleSaveChanges}>
          <Text className="text-lg font-bold text-greenBlue-300">Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="w-full py-10"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {/* Profile Picture Section */}
        <View className="mb-10 flex flex-col items-center">
          <TouchableOpacity onPress={pickImage}>
            <View className="relative">
              <Image
                source={{
                  uri: uriImage ? uriImage : defaultImage,
                }} // Use a default image if none is selected
                className="mb-5 h-40 w-40 rounded-full"
              />
              <View className="absolute bottom-4 right-2 rounded-full border-2 border-white bg-gray-100 p-2 dark:bg-dark-500">
                <AntDesign
                  name="camera"
                  size={18}
                  color={isDark ? "white" : "black"}
                />
              </View>
            </View>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800 dark:text-white">
            {nom
              ? `${nom.charAt(0).toUpperCase() + nom.slice(1)}`
              : "Your Name"}
          </Text>
        </View>

        {/* Input Fields for Profile Information */}
        <View className="mb-10 flex w-full flex-col items-center rounded-xl bg-white p-4 dark:bg-dark-200">
          {/* Name Input */}
          <View className="w-full">
            <Text className="mb-2 text-lg font-bold text-gray-800 dark:text-white">
              Name
            </Text>
            <TextInput
              value={nom}
              onChangeText={setNom}
              className="mb-6 w-full rounded-lg bg-gray-100 px-4 py-3 text-lg dark:bg-dark-500 dark:text-white"
              placeholder="Enter your name"
            />
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

          {/* Phone Number Input */}
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

        {/* Dark Mode Toggle */}
        <View className="mb-10 flex w-full flex-col items-center rounded-xl bg-white px-4 py-3 dark:bg-dark-200">
          <View className="flex w-full flex-row items-center justify-between">
            <Ionicons
              name="moon"
              size={24}
              color={isDark ? "white" : "black"}
            />
            <Text className="text-lg font-bold text-gray-800 dark:text-white">
              Dark Mode
            </Text>
            <Switch
              trackColor={{ false: "#0A3A40", true: "#1ED9D9" }}
              thumbColor={isDark ? "#05F2DB" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isDark}
            />
          </View>
        </View>

        {/* Loading Indicator */}
        {isUpdating && <Loading text={"Creating profile..."} />}
      </ScrollView>
    </View>
  );
}
