import React, { useRef, useEffect, useState } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { Marker } from "react-native-maps";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Location from "expo-location";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

function PositionInMap(props) {
  const longitude = props.route.params.longitude;
  const latitude = props.route.params.latitude;
  const theme = props.route.params.theme;
  console.log(
    "longitude: " + Number(longitude) + " latitude: " + Number(latitude),
  );

  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const region = {
    latitude: Number(latitude),
    longitude: Number(longitude),
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0921,
  };

  const mapRef = useRef(null);
  const focusLocation = () => {
    // mapRef.current.animateCamera({center: region, zoom: 10}, {duration: 1000});
    mapRef.current.animateToRegion(region, 4000);
  };

  const focusCurrentPosition = () => {
    console.log("current position: ", currentRegion);
    mapRef.current.animateToRegion(currentRegion, 4000);
  };

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

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        let currentLocation = await getCurrentLocation();
        setCurrentLocation(currentLocation);
        console.log("current location:", currentLocation);
        setCurrentRegion({
          longitude: currentLocation.coords.longitude,
          latitude: currentLocation.coords.latitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0921,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchCurrentLocation();
  }, []);

  return (
    <View className="flex flex-1 pt-10">
      {/* <View className="absolute left-0 right-0 top-10 z-10">
        <Text className="text-2xl text-black">Location</Text>
      </View> */}
      <View className="flex flex-row items-center justify-around bg-gray-200 dark:bg-dark-500">
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <AntDesign name="left" size={24} className="mr-2" color={"#05F2DB"} />
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-xl p-2"
          onPress={focusCurrentPosition}
        >
          <FontAwesome6
            name="location-crosshairs"
            size={24}
            color={"#05F2DB"}
          />
        </TouchableOpacity>
        <TouchableOpacity className="rounded-xl p-2" onPress={focusLocation}>
          <FontAwesome6
            name="magnifying-glass-location"
            size={24}
            color={"#05F2DB"}
          />
        </TouchableOpacity>
      </View>
      <MapView
        //
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        loadingEnabled={true}
        // showsUserLocation={true}
        // showsMyLocationButton={true}
        ref={mapRef}
      >
        <Marker coordinate={region}>
          <Image
            source={require("../assets/icons/marker.png")}
            style={{ height: 35, width: 35 }}
          />
        </Marker>
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
    height: "95%",
  },
});

export default PositionInMap;
