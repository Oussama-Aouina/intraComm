import React from "react";

import { Modal, View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { colorScheme } from "nativewind";

function Loading({ text }) {
  return (
    <Modal
      visible={true}
      transparent={false}
      animationType="fade"
      //   onRequestClose={onClose}
    >
      <View className="bg-[rgba(0, 0, 0, 0.5)] flex-1 items-center justify-center bg-opacity-50 dark:bg-dark-500">
        <View className="flex h-40 w-40 items-center justify-center rounded-2xl bg-white dark:bg-dark-200">
          <Text className="font-bold tracking-wider text-greenBlue-400 dark:text-greenBlue-100">
            {text}
          </Text>
          <ActivityIndicator
            size="large"
            color={colorScheme.get() === "light" ? "#0E6973" : "#05F2DB"}
          />
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: 100,
    height: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default Loading;
