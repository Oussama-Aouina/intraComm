import { useState, useRef } from "react";
import { View, StyleSheet, Button, Platform } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { TouchableHighlight } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function VideoMessage({ source }) {
  const video = useRef(null);
  const [status, setStatus] = useState({});
  return (
    <View className="mx-2 items-center rounded-lg">
      <Video
        ref={video}
        style={styles.video}
        className="self-center rounded-xl"
        source={{
          uri: source,
        }}
        useNativeControls
        resizeMode={ResizeMode.COVER}
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      {/* <View style={styles.buttons}>
        <Button
          title={status.isPlaying ? "Pause" : "Play"}
          onPress={() =>
            status.isPlaying
              ? video.current.pauseAsync()
              : video.current.playAsync()
          }
        />
      </View> */}
      {Platform.OS !== "ios" && (
        <TouchableHighlight className="absolute h-full w-full items-center justify-center rounded-full">
          {!status.isPlaying ? (
            <AntDesign
              name="play"
              size={40}
              color={"#D7D7D9"}
              onPress={() =>
                status.isPlaying
                  ? video.current.pauseAsync()
                  : video.current.playAsync()
              }
            />
          ) : (
            <AntDesign
              name="pausecircle"
              size={40}
              color="#D7D7D9"
              onPress={() =>
                status.isPlaying
                  ? video.current.pauseAsync()
                  : video.current.playAsync()
              }
            />
          )}
        </TouchableHighlight>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  video: {
    alignSelf: "center",
    width: 150,
    height: 200,
    borderRadius: 15,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
