import React,{useRef} from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Marker } from "react-native-maps";

function PositionInMap(propps) {
  const longitude = propps.route.params.longitude;
  const latitude = propps.route.params.latitude;
  console.log("longitude: " + Number(longitude) + " latitude: " + Number(latitude));
  const region = {
          latitude: Number(latitude),
          longitude: Number(longitude),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0921,
  }
  const mapRef = useRef(null);
  const focusLocation = () => {
    // mapRef.current.animateCamera({center: region, zoom: 10}, {duration: 1000});
    mapRef.current.animateToRegion(region, 10000);
  }
  return (
    <View className="flex flex-1 pt-10">
      {/* <View className="absolute left-0 right-0 top-10 z-10">
        <Text className="text-2xl text-black">Location</Text>
      </View> */}
      <TouchableOpacity className="p-2 rounded-xl" onPress={
        focusLocation
      }>
        <Text className="text-greenBlue-100 bg-greenBlue-500 p-2  rounded-lg">Focus Location</Text>

      </TouchableOpacity>
      <MapView
        //
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        loadingEnabled={true}
        showsUserLocation={true}
        showsMyLocationButton={true}
        ref={mapRef}
        
      >
        <Marker coordinate={region}/>
        </MapView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default PositionInMap;
