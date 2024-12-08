import React from "react";
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { shareAsync } from "expo-sharing";
import { Alert } from "react-native";

const FullScreenImageModal = ({ visible, onClose, imageUri }) => {
  console.log(imageUri);
  // download the media in the documents
  //   const downloadFromURL = async () => {
  //     const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
  //     const result = await FileSystem.downloadAsync(
  //       imageUri,
  //       FileSystem.documentDirectory + filename,
  //     );
  //     console.log(result);
  //     await save(result.uri);
  //   };
  //   const save = async (uri) => {
  //     shareAsync(uri);
  //   };

  const downloadFromURL = async () => {
    try {
      // Request permission to access media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access media library is required!");
        return;
      }

      // Get the filename from the image URI
      const filename =
        imageUri.substring(imageUri.lastIndexOf("/") + 1) + ".png";
      const fileUri = FileSystem.documentDirectory + filename;

      // Download the image
      const result = await FileSystem.downloadAsync(imageUri, fileUri);
      console.log("Finished downloading to ", result.uri);

      // Save the image to the media library
      const asset = await MediaLibrary.createAssetAsync(result.uri);
      console.log("Image saved to gallery:", asset);

      Alert.alert("Image saved!", "Your image has been saved to the gallery.");
    } catch (error) {
      console.error("Error downloading or saving image:", error);
      Alert.alert("Error", "There was an error saving the image.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={styles.modalContainer}

        // className="absolute flex h-full w-full flex-1 bg-black dark:bg-dark-500"
      >
        <StatusBar barStyle={"light-content"} />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color={"gray"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={downloadFromURL}>
          <Octicons name="download" size={24} color={"gray"} />
        </TouchableOpacity>
        <Image
          source={{ uri: imageUri }}
          className="h-full w-full"
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  saveButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
});

export default FullScreenImageModal;
