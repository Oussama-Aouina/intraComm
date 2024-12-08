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

const FullScreenImageModal = ({ visible, onClose, imageUri }) => {
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
  closeIcon: {
    width: 30,
    height: 30,
  },
});

export default FullScreenImageModal;
