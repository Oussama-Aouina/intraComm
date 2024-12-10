import React, { useRef, useState, useEffect, use } from "react";
import { View, StyleSheet, Button, Modal, Animated } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { supabase } from "../config";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function AudioRecorder({
  visible,
  onClose,
  setRecordVisible,
  sendMessage,
  theme,
}) {
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const RecordingAnimatedWidth = useRef(new Animated.Value(0)).current; // Start width at 0%
  const animatedWidth = useRef(new Animated.Value(0)).current; // Start width at 40%
  async function startRecording() {
    try {
      if (!permissionResponse || permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recording);
      setIsRecording(true);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored ");
    return uri;
  }

  const saveRecording = async () => {
    const uri = await stopRecording();
    console.log("recording type" + typeof uri);
    console.log("Recording stopped and stored at", uri);
    const docId = "recording_" + Date.now();
    try {
      // Read the image as a Base64 string
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const mediaType = "audio";
      // Determine the content type
      const contentType = "audio/mpeg";
      // Default to JPEG if type is not available
      console.log("Content Type:", contentType);
      // Upload the image to Supabase storage
      const { data, error } = await supabase.storage
        .from("discussionsAudios")
        .upload(docId, decode(base64), {
          contentType: contentType,
          upsert: true, // Update the file if it already exists
        });

      if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
      }

      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from("discussionsAudios")
        .getPublicUrl(docId);

      if (!publicUrlData) {
        throw new Error("Failed to retrieve the public URL.");
      }

      console.log(
        "File uploaded successfully. Public URL:",
        publicUrlData.publicUrl,
      );
      return [publicUrlData.publicUrl, "audio"];
    } catch (error) {
      console.error("Error uploading the file:", error);
      alert("Something went wrong while uploading the file.");
      return null;
    }
  };

  useEffect(() => {
    // Animate width when inputFocus changes
    Animated.timing(animatedWidth, {
      toValue: visible ? 100 : 0, // Target width percentage
      duration: 500, // Animation duration in ms
      useNativeDriver: false, // Required for layout properties like width
    }).start();
  }, [visible]);

  useEffect(() => {
    if (visible) {
      startRecording();
    }
    // else {
    //   stopRecording();
    // }
  }, [visible]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(async () => {
        const { durationMillis } = await recording.getStatusAsync();
        console.log("Recording duration:", durationMillis);
        setRecordingDuration(durationMillis);
        if (durationMillis >= 10000) {
          await stopRecording().then(() => {
            setRecordVisible(false);
          });
        }
        // Update the animated width based on the recording duration
        const percentage = (durationMillis / 10000) * 100; // Assuming max duration is 10 seconds
        Animated.timing(RecordingAnimatedWidth, {
          toValue: percentage,
          duration: 100, // Update every 100ms
          useNativeDriver: false,
        }).start();
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording, recording]);
  return (
    <View
      // className="absolute bottom-0 z-20 flex h-14 w-full flex-row items-center justify-between bg-black px-6"
      style={{
        // backgroundColor: "black",
        // borderTopWidth: 1,
        // borderTopColor: theme.border_color,
        // position: "absolute",
        bottom: 0,
        zIndex: 20,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "flex-start",
        padding: 14,
      }}
    >
      <MaterialIcons
        name="delete"
        size={30}
        color={theme.icons_color}
        onPress={async () => {
          if (recording) {
            await stopRecording().then(() => {
              setRecordVisible(false);
            });
          } else {
            setRecordVisible(false);
          }
        }}
      />
      <View
        // className="min-w-[90%]"
        style={{
          maxWidth: "80%",
          flexDirection: "row",
          backgroundColor: "white",
          borderRadius: 100,
        }}
      >
        {/* recording animation */}
        <Animated.View
          // className="h-12 w-full rounded-full bg-white p-4"
          //   style={{ transform: [{ scale: scaleAnim }] }}
          style={[
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"], // Convert animated value to percentage
              }),
              backgroundColor: "white",
              borderRadius: 100,
              padding: 0,
              // marginHorizontal: 10,
              maxHeight: 30,
            },
          ]}
        >
          <Animated.View
            // className="h-4 bg-black rounded-full"
            style={{
              width: RecordingAnimatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"], // Convert animated value to percentage
              }),
              backgroundColor: theme.icons_color,
              borderRadius: 100,
              height: "100%",
            }}
          ></Animated.View>
        </Animated.View>
      </View>
      <Ionicons
        name="send"
        style={{ marginLeft: 20 }}
        size={26}
        color={theme.icons_color}
        onPress={async () => {
          if (recording) {
            await saveRecording().then((url) => {
              sendMessage(url);
              setRecordVisible(false);
            });
          } else {
            setRecordVisible(false);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
});
