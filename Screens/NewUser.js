import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import Animated, {
  BounceInUp,
  SlideInLeft,
  SlideInRight,
  BounceInDown,
  Easing,
} from "react-native-reanimated";
import firebase from "../config";

const auth = firebase.auth();

export default function NewUser(props) {
  var email, pwd, confirmPwd;

  const checkEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const checkPassword = (password) => password.length >= 6;

  const handleSubmit = () => {
    if (!email || !pwd || !confirmPwd) {
      alert("Please fill in all fields.");
      return;
    }
    if (!checkEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!checkPassword(pwd)) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (pwd !== confirmPwd) {
      alert("Passwords do not match.");
      return;
    }

    auth
      .createUserWithEmailAndPassword(email, pwd)
      .then(() => {
        const currentId = auth.currentUser.uid;
        props.navigation.navigate("Home", { currentId: currentId });
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View className="flex h-full w-full items-center bg-greenBlue-500 pt-10">
      <StatusBar barStyle="light-content" />

      {/* Animated Logo Section */}
      <View className="flex h-40 flex-row items-center justify-center">
        <Animated.Image
          entering={SlideInLeft.duration(1000).easing(
            Easing.inOut(Easing.back(4)),
          )}
          className="absolute left-0 h-20 w-24"
          source={require("../assets/logos/logo_single_part.png")}
        />
        <Animated.Image
          entering={BounceInUp.duration(1000)}
          className="absolute z-10 h-32 w-40"
          source={require("../assets/logos/logo_single_part.png")}
        />
        <Animated.Image
          entering={SlideInRight.duration(1000).easing(
            Easing.inOut(Easing.back(4)),
          )}
          className="absolute right-0 h-20 w-24"
          source={require("../assets/logos/logo_single_part.png")}
        />
      </View>

      {/* Title */}
      <View className="flex flex-row items-center">
        <Animated.Text
          entering={SlideInLeft.duration(1000).easing(
            Easing.inOut(Easing.back(4)),
          )}
          className="text-3xl font-bold tracking-wider text-slate-100"
        >
          Intra
        </Animated.Text>
        <Animated.Text
          entering={SlideInRight.duration(1000).easing(
            Easing.inOut(Easing.back(4)),
          )}
          className="text-3xl font-bold tracking-wider text-greenBlue-300"
        >
          Comm
        </Animated.Text>
      </View>

      {/* Sign Up Form */}
      <Animated.View
        entering={BounceInDown.delay(400).duration(1000)}
        className="flex flex-1 items-center justify-end"
      >
        <View className="h-[80%] w-full rounded-t-3xl bg-white bg-opacity-30 px-8 shadow-lg">
          <Text className="mt-5 py-3 text-center text-5xl font-bold text-greenBlue-300">
            Sign Up
          </Text>

          <TextInput
            keyboardType="email-address"
            placeholder="Email"
            onChangeText={(txt) => {
              email = txt;
            }}
            className="my-2 min-w-full rounded-lg bg-gray-200 py-3 pl-4 text-lg"
          />
          <TextInput
            secureTextEntry
            placeholder="Password"
            onChangeText={(txt) => {
              pwd = txt;
            }}
            className="my-2 min-w-full rounded-lg bg-gray-200 py-3 pl-4 text-lg"
          />
          <TextInput
            secureTextEntry
            placeholder="Confirm Password"
            onChangeText={(txt) => {
              confirmPwd = txt;
            }}
            className="my-2 min-w-full rounded-lg bg-gray-200 py-3 pl-4 text-lg"
          />
          <TouchableOpacity className="min-w-full" onPress={handleSubmit}>
            <Text className="w-full rounded-xl bg-greenBlue-300 py-4 text-center text-xl font-bold text-slate-100">
              Sign Up
            </Text>
          </TouchableOpacity>
          <View className="mt-3 flex flex-row items-center justify-center">
            <Text className="text-lg font-normal text-dark-500">
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => props.navigation.replace("Auth")}>
              <Text className="text-lg font-bold text-greenBlue-300">
                {" "}
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
