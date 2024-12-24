import { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Audio } from "expo-av";

export default function AudioMessage({ source, theme, isCurrentUser }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundDuration, setSoundDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const soundSource = {
    uri: source,
  };

  // Function to play the sound
  async function playSound() {
    try {
      if (sound) {
        await sound.playAsync();
        setIsPlaying(true);
        return;
      }

      console.log("Loading Sound");
      const { sound } = await Audio.Sound.createAsync(soundSource);

      // Get the duration of the audio
      const status = await sound.getStatusAsync();
      setSoundDuration(status.durationMillis);

      // Set up playback status listener
      sound.setOnPlaybackStatusUpdate(
        (status) => {
          // if (status.isLoaded) {
          if (status.didJustFinish) {
            setIsPlaying(false);
            console.log("Finished Playing Sound");
            setCurrentPosition(0); // Reset position when the sound finishes
            Animated.timing(animatedWidth, {
              toValue: 0,
              duration: 200, // Smooth reset
              useNativeDriver: false,
            }).start();
          } else if (status.isPlaying) {
            setCurrentPosition(status.positionMillis);
            const percentage =
              (status.positionMillis / status.durationMillis) * 100;
            Animated.timing(animatedWidth, {
              toValue: percentage,
              duration: 300, // Smooth animation
              useNativeDriver: false,
            }).start();
          }
        },
        // }
      );

      setSound(sound);
      setIsPlaying(true);

      console.log("Playing Sound");
      await sound.playAsync();
    } catch (error) {
      console.error("Error loading or playing sound:", error);
    }
  }

  // Function to pause the sound
  async function pauseSound() {
    try {
      if (sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
        console.log("Paused Sound");
      }
    } catch (error) {
      console.error("Error pausing sound:", error);
    }
  }

  // Cleanup sound resource when the component unmounts
  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View
      style={{
        borderRadius: 20,
        padding: 2,
        height: 40,
        margin: 5,
        maxWidth: 200,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        color: isCurrentUser
          ? theme.sender_message_text_color
          : theme.receiver_message_text_color,
      }}
    >
      {isPlaying ? (
        <FontAwesome6
          name="pause"
          size={24}
          onPress={pauseSound}
          color={
            isCurrentUser
              ? theme.sender_message_text_color
              : theme.receiver_message_text_color
          }
        />
      ) : (
        <FontAwesome6
          name="play"
          size={24}
          onPress={playSound}
          color={
            isCurrentUser
              ? theme.sender_message_text_color
              : theme.receiver_message_text_color
          }
        />
      )}
      <View
        style={{
          backgroundColor: "gray",
          borderTopColor: theme.border_color,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          height: 10,
          width: "80%",
          paddingHorizontal: 0,
          paddingVertical: 2,
          borderRadius: 20,
        }}
      >
        <Animated.View
          style={{
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"], // Convert animated value to percentage
            }),
            backgroundColor: isCurrentUser
              ? theme.sender_message_text_color
              : theme.receiver_message_text_color,
            borderRadius: 100,
            height: 10,
          }}
        ></Animated.View>
      </View>
    </View>
  );
}
