import React from "react";
import MapView from "react-native-maps";
import { StyleSheet, View } from "react-native";

function PositionInMap({ location }) {
  console.log(location);
  return (
    <View className="flex flex-1">
      <MapView className="h-full w-full" />
    </View>
  );
}

export default PositionInMap;
