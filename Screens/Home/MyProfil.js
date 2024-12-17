import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { supabase } from "../../config";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import firebase from "../../config";
import UserProfile from "../../Components/UserProfile";

export default function MyProfil(props) {
  // Recuperation de l'id de compte courant
  const currentId = props.route.params.currentId;

  const handleLogout = () => {
    console.log("User logged out.");
    console.log();
    // Add your logout logic here
  };

  const handleDeleteAccount = () => {
    console.log("Account deleted.");
    // Add your delete account logic here
  };

  return (
    <UserProfile
      currentId={currentId}
      isDark={props.route.params.isDark}
      setIsDark={props.route.params.setIsDark}
      navigation={props.navigation}
    />
  );
}

const styles = StyleSheet.create({
  textinputstyle: {
    fontWeight: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    fontSize: 20,
    color: "#fff",
    width: "75%",
    height: 50,
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  textstyle: {
    fontSize: 40,
    fontFamily: "serif",
    color: "#07f",
    fontWeight: "bold",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    marginBottom: 10,
    borderColor: "#00f",
    borderWidth: 2,
    backgroundColor: "#08f6",
    height: 60,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 24,
  },
});
