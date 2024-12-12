import React, { useState, useEffect } from "react";
import { Modal } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View, TouchableOpacity } from "react-native";
import * as Location from "expo-location";

function InfoSharingOptions({
  visible,
  onClose,
  theme,
  handleUploadImage,
  handleUploadFile,
  sendMessage,
}) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    return location;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      onDismiss={onClose}
    >
      <View className="z-10 flex h-full flex-col items-start justify-end gap-5 rounded-full px-4 pb-16">
        <TouchableOpacity
          onPress={async () => {
            handleUploadImage().then(onClose());
          }}
        >
          <MaterialIcons name="image" size={30} color={theme.icons_color} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            handleUploadFile().then(onClose());
          }}
        >
          <MaterialIcons
            name="attach-file"
            size={30}
            color={theme.icons_color}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            const location = await getCurrentLocation()
              .then((location) => {
                console.log(location);
                sendMessage(
                  "latitude: " +
                    location.coords.latitude +
                    "#longitude: " +
                    location.coords.longitude,
                  "location",
                );
              })
              .then(onClose());
          }}
        >
          <MaterialIcons
            name="my-location"
            size={30}
            color={theme.icons_color}
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export default InfoSharingOptions;
