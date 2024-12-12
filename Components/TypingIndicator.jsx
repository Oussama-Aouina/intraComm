import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const TypingIndicator = ({ theme, isCurrentUser }) => {
  const animation1 = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  const animation3 = useRef(new Animated.Value(0)).current;

  const startAnimation = (animation, delay) => {
    animation.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      { delay: delay },
    ).start();
  };

  useEffect(() => {
    let interval = 200;
    startAnimation(animation1, 0);
    setTimeout(() => startAnimation(animation2), interval);
    setTimeout(() => startAnimation(animation3), interval * 2);
  }, [animation1, animation2, animation3]);

  const translateY1 = animation1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10], // Move up by 10 units
  });

  const translateY2 = animation2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const translateY3 = animation3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <View
      className="my-3 mb-2 w-full flex-row"
      style={{
        justifyContent: "flex-start",
        marginVertical: 10,
        paddingHorizontal: 10,
      }}
    >
      <View
        className="mx-2 max-w-[70%] rounded-t-3xl px-2 py-2"
        style={{
          backgroundColor: isCurrentUser
            ? theme.sender_message_background_color
            : theme.receiver_message_background_color,
          borderBottomRightRadius: isCurrentUser ? 0 : 15,
          borderBottomLeftRadius: isCurrentUser ? 15 : 0,
          maxWidth: "70%",
          marginHorizontal: 10,
        }}
      >
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.circle,
              { transform: [{ translateY: translateY1 }] },
            ]}
          />
          <Animated.View
            style={[
              styles.circle,
              { transform: [{ translateY: translateY2 }] },
            ]}
          />
          <Animated.View
            style={[
              styles.circle,
              { transform: [{ translateY: translateY3 }] },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    height: 30,
    paddingHorizontal: 3, // Adjust height as needed
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 15,
    backgroundColor: "#999", // Change color as needed
    marginHorizontal: 3,
  },
});

export default TypingIndicator;
