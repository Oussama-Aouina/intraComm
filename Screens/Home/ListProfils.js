import { StatusBar } from "expo-status-bar";
import React from "react";
import { useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import firebase from "../../config";
import { colorScheme } from "nativewind";
import { toggleColorScheme } from "../../hooks/ColorThemeHook";
import AntDesign from "react-native-vector-icons/AntDesign";
import OneChatComponent from "../../Components/OneChatComponent";

const database = firebase.database();
const ref_table_profiles = database.ref("TableProfiles");

export default function ListProfils(props) {
  const currentId = props.route.params.currentId;
  // const currentId = "SgsAeWF1Y0b05jqBYDRFSbkmrCb2";
  console.log("currentId from list profile", currentId);
  const [data, setdata] = useState([]);
  const [themeColor, setThemeColor] = useState(null);

  // useEffect(() => {
  //   ref_table_profiles.on("value", (snapshot) => {
  //     const d = [];
  //     snapshot.forEach((element) => {
  //       if (element.val()?.id != currentId) {
  //         d.push(element.val());
  //       }
  //     });
  //     setdata(d);
  //   });

  //   return () => {
  //     ref_table_profiles.off();
  //   };
  // }, []);

  useEffect(() => {
    const discussionsRef = database.ref("Discussions");
    const profilesRef = ref_table_profiles;

    // Function to fetch and update profiles with lastInteraction
    const fetchProfilesWithLastInteraction = async () => {
      try {
        const snapshot = await profilesRef.once("value");
        const profiles = [];
        const fetchPromises = [];

        snapshot.forEach((profile) => {
          const profileData = profile.val();

          if (profileData?.id !== currentId) {
            const discussionId =
              currentId > profileData.id
                ? currentId + profileData.id
                : profileData.id + currentId;

            const discussionPromise = discussionsRef
              .child(discussionId)
              .child("last_interaction")
              .once("value")
              .then((discussionSnapshot) => ({
                ...profileData,
                lastInteraction: discussionSnapshot.val() || 0,
              }));

            fetchPromises.push(discussionPromise);
          }
        });

        const profilesWithInteractions = await Promise.all(fetchPromises);

        // Sort profiles by 'last interaction' timestamp
        profilesWithInteractions.sort((a, b) => {
          const dateA = new Date(a.lastInteraction);
          const dateB = new Date(b.lastInteraction);
          return dateB - dateA; // Descending order
        });

        setdata(profilesWithInteractions);
      } catch (error) {
        console.error("Error fetching profiles or discussions:", error);
      }
    };

    // Listen for changes in both profiles and discussions
    const profilesListener = profilesRef.on(
      "value",
      fetchProfilesWithLastInteraction,
    );

    const discussionsListener = discussionsRef.on(
      "child_changed",
      fetchProfilesWithLastInteraction,
    );

    return () => {
      profilesRef.off("value", profilesListener);
      discussionsRef.off("child_changed", discussionsListener);
    };
  }, [currentId]);

  // useEffect(() => {
  //   const discussionsRef = database.ref("Discussions");
  //   const profilesRef = ref_table_profiles;

  //   // Function to fetch and update profiles with lastInteraction
  //   const fetchProfilesWithLastInteraction = async () => {
  //     try {
  //       const snapshot = await profilesRef.once("value");
  //       const profiles = [];
  //       const fetchPromises = [];

  //       snapshot.forEach((profile) => {
  //         const profileData = profile.val();

  //         if (profileData?.id !== currentId) {
  //           const discussionId =
  //             currentId > profileData.id
  //               ? currentId + profileData.id
  //               : profileData.id + currentId;

  //           const discussionPromise = discussionsRef
  //             .child(discussionId)
  //             .child("last_interaction")
  //             .once("value")
  //             .then((discussionSnapshot) => ({
  //               ...profileData,
  //               lastInteraction: discussionSnapshot.val() || 0,
  //             }));

  //           fetchPromises.push(discussionPromise);
  //         }
  //       });

  //       const profilesWithInteractions = await Promise.all(fetchPromises);

  //       // Sort profiles by 'last interaction' timestamp
  //       profilesWithInteractions.sort((a, b) => {
  //         const dateA = new Date(a.lastInteraction);
  //         const dateB = new Date(b.lastInteraction);
  //         return dateB - dateA; // Descending order
  //       });

  //       setdata(profilesWithInteractions);
  //     } catch (error) {
  //       console.error("Error fetching profiles or discussions:", error);
  //     }
  //   };

  //   // Listen for changes in both profiles and discussions
  //   const profilesListener = profilesRef.on(
  //     "value",
  //     fetchProfilesWithLastInteraction,
  //   );

  //   const discussionsListener = discussionsRef.on(
  //     "child_changed",
  //     fetchProfilesWithLastInteraction,
  //   );

  //   return () => {
  //     profilesRef.off("value", profilesListener);
  //     discussionsRef.off("child_changed", discussionsListener);
  //   };
  // }, [currentId]);

  const backgroundColor = colorScheme.get() == "light" ? "#ffff" : "#2B2B2B";
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    // Filter the data based on the search input
    const filtered = data.filter(
      (profile) =>
        profile.nom.toLowerCase().includes(search.toLowerCase()) ||
        profile.pseudo.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredData(filtered);
  }, [search, data]);

  return (
    // <ImageBackground
    //   source={require("../../assets/imgbleu.jpg")}
    //   style={styles.container}
    // >
    <View className="flex h-full w-full items-start justify-center bg-white px-5 pt-10 dark:bg-dark-500">
      <StatusBar style={themeColor === "light" ? "dark" : "light"} />
      <Text className="w-full text-center text-3xl font-bold tracking-wider text-black dark:text-white">
        Chats
      </Text>
      <View className="relative w-full">
        <TextInput
          className="my-2 w-full min-w-full rounded-lg border-greenBlue-300 bg-gray-200 py-2 pl-8 text-lg placeholder:text-gray-500 dark:bg-dark-200 dark:text-gray-300 dark:placeholder:text-gray-400"
          placeholder="Search"
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
        <AntDesign
          name="search1"
          size={18}
          color={themeColor === "light" ? "#6B7280" : "#D1D5DB"}
          className="absolute left-2 top-5"
        />
      </View>

      <FlatList
        data={filteredData}
        renderItem={(item) => {
          return (
            <TouchableOpacity
              key={item.item.id}
              onPress={() => {
                props.navigation.navigate("Chat", {
                  currentId: currentId,
                  secondId: item.item.id,
                });
              }}
            >
              {/* <View className="flex min-h-12 w-full items-center justify-center bg-white px-5 py-3 dark:bg-dark-500">
                <Image
                  source={{ uri: item.item.photo }}
                  style={styles.logo}
                ></Image>
                <Text className="text-xl font-bold dark:text-white">
                  {item.item.pseudo}
                </Text>
              </View> */}
              <OneChatComponent
                item={item}
                navigation={props.navigation}
                currentId={currentId}
                secondId={item.item.id}
              />
            </TouchableOpacity>
          );
        }}
      ></FlatList>

      <TouchableOpacity
        className="flex h-8 w-full items-center justify-center rounded-t-full bg-greenBlue-400"
        onPress={() => {
          toggleColorScheme();
          setThemeColor((prev) => (prev === "light" ? "dark" : "light"));
        }}
      ></TouchableOpacity>
    </View>
    // </ImageBackground>
  );
}

// const styles = StyleSheet.create({
//   textinputstyle: {
//     fontWeight: "bold",
//     backgroundColor: "#0004",
//     fontSize: 20,
//     color: "#fff",
//     width: "75%",
//     height: 50,
//     borderRadius: 10,
//     margin: 5,
//   },
//   textstyle: {
//     fontSize: 40,
//     fontFamily: "serif",
//     color: "white",
//     fontWeight: "bold",
//     paddingTop: 45,
//   },
//   container: {
//     color: "blue",
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "flex-start",
//   },
//   logo: {
//     width: 50,
//     height: 50,
//     borderRadius: 50,
//   },
// });
