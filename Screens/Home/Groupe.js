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
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import firebase from "../../config";
import { colorScheme } from "nativewind";
import { toggleColorScheme } from "../../hooks/ColorThemeHook";
import AntDesign from "react-native-vector-icons/AntDesign";
import OneChatComponent from "../../Components/OneChatComponent";
import Ionicons from "@expo/vector-icons/Ionicons";
import AddGroup from "../../Components/AddGroup";
import OneChatGroup from "../../Components/OneChatGroup";

const database = firebase.database();
const ref_table_profiles = database.ref("TableProfiles");
const ref_table_groupes = database.ref("TableGroups");

export default function Group(props) {
  const currentId = props.route.params.currentId;
  // const currentId = "SgsAeWF1Y0b05jqBYDRFSbkmrCb2";
  const [profiles, setprofiles] = useState([]);
  const [data, setdata] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [themeColor, setThemeColor] = useState(colorScheme.get());
  const [modalVisible, setModalVisible] = useState(false);

  //recuperation des profiles
  useEffect(() => {
    ref_table_profiles.on("value", (snapshot) => {
      const d = [];
      snapshot.forEach((element) => {
        if (element.val().id != currentId) {
          d.push(element.val());
        }
      });
      setprofiles(d);
    });

    return () => {
      ref_table_profiles.off();
    };
  }, []);

  //recuperation des groupes
  // useEffect(() => {
  //   ref_table_groupes.on("value", (snapshot) => {
  //     const d = [];
  //     snapshot.forEach((element) => {
  //       if (
  //         (element.val().members &&
  //           element.val().members.includes(currentId)) ||
  //         element.val().admin == currentId
  //       ) {
  //         d.push(element.val());
  //       }
  //       // console.log("element id", element.val().id);
  //     });
  //     setdata(d);
  //   });

  //   return () => {
  //     ref_table_groupes.off();
  //   };
  // }, []);
  // console.log("data", data);
  useEffect(() => {
    const groupsRef = database.ref("TableGroups");
    const discussionsRef = database.ref("Discussions");

    const fetchGroupsWithLastInteraction = async () => {
      try {
        const snapshot = await groupsRef.once("value");
        const groups = [];
        const fetchPromises = [];

        snapshot.forEach((group) => {
          const groupData = group.val();

          // Check if the current user is an admin or a member of the group
          if (
            (groupData.members && groupData.members.includes(currentId)) ||
            groupData.admin === currentId
          ) {
            const groupId = groupData.id;

            const discussionPromise = discussionsRef
              .child(groupId)
              .child("last_interaction")
              .once("value")
              .then((discussionSnapshot) => ({
                ...groupData,
                lastInteraction: discussionSnapshot.val() || 0, // Default to 0 if not found
              }));

            fetchPromises.push(discussionPromise);
          }
        });

        const groupsWithInteractions = await Promise.all(fetchPromises);

        // Sort groups by 'last interaction' timestamp
        groupsWithInteractions.sort((a, b) => {
          const dateA = new Date(a.lastInteraction);
          const dateB = new Date(b.lastInteraction);
          return dateB - dateA; // Descending order
        });

        setdata(groupsWithInteractions);
      } catch (error) {
        console.error("Error fetching groups or discussions:", error);
      }
    };

    // Listen for changes in both groups and discussions
    const groupsListener = groupsRef.on(
      "value",
      fetchGroupsWithLastInteraction,
    );

    const discussionsListener = discussionsRef.on(
      "child_changed",
      fetchGroupsWithLastInteraction,
    );

    return () => {
      groupsRef.off("value", groupsListener);
      discussionsRef.off("child_changed", discussionsListener);
    };
  }, [currentId]);

  const backgroundColor = colorScheme.get() == "light" ? "#ffff" : "#2B2B2B";

  useEffect(() => {
    // Filter the data based on the search input
    const filtered = data.filter(
      (group) =>
        // console.log("group", group) ||
        group &&
        group.nom &&
        group.nom.toLowerCase().includes(search.toLowerCase()),
      // group.nom.includes(search),
    );
    setFilteredData(filtered);
  }, [search, data]);
  console.log("data", data);
  return (
    // <ImageBackground
    //   source={require("../../assets/imgbleu.jpg")}
    //   style={styles.container}
    // >
    <View className="flex h-full w-full items-start justify-center bg-white px-5 pt-10 dark:bg-dark-500">
      <StatusBar style="auto" />
      <View className="flex w-full flex-row items-center justify-between">
        <View></View>
        <Text className="text-center text-3xl font-bold tracking-wider text-black dark:text-white">
          Groups
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={24} color={"#0F97A6"} />
        </TouchableOpacity>
      </View>
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
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                props.navigation.navigate("ChatGroup", {
                  currentId: currentId,
                  idGroup: item.id,
                });
              }}
            >
              <OneChatGroup
                item={item}
                navigation={props.navigation}
                currentId={currentId}
                idGroup={item.id}
              />
            </TouchableOpacity>
          );
        }}
      ></FlatList>
      <AddGroup
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        currentId={currentId}
      />

      {/* <TouchableOpacity
        className="flex h-8 w-full items-center justify-center rounded-t-full bg-greenBlue-400"
        onPress={() => {
          toggleColorScheme();
          setThemeColor((prev) => (prev === "light" ? "dark" : "light"));
        }}
      ></TouchableOpacity> */}
    </View>
    // </ImageBackground>
  );
}

const styles = StyleSheet.create({
  textinputstyle: {
    fontWeight: "bold",
    backgroundColor: "#0004",
    fontSize: 20,
    color: "#fff",
    width: "75%",
    height: 50,
    borderRadius: 10,
    margin: 5,
  },
  textstyle: {
    fontSize: 40,
    fontFamily: "serif",
    color: "white",
    fontWeight: "bold",
    paddingTop: 45,
  },
  container: {
    color: "blue",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
