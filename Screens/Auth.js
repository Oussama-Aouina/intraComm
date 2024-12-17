import React from "react";

import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  StatusBar,
  ImageBackground,
  BackHandler,
  TouchableOpacity,
  Image,
  Appearance,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from "react-native";
import Animated, {
  FadeInRight,
  FadeInLeft,
  FadeInDown,
  FadeInUp,
  BounceInUp,
  SlideInRight,
  SlideInLeft,
  BounceInDown,
  Easing,
} from "react-native-reanimated";
import firebase from "../config";
import "../global.css";
import { useColorScheme } from "nativewind";
import "../hooks/ColorThemeHook";
import { toggleColorScheme } from "../hooks/ColorThemeHook";

const auth = firebase.auth();

export default function Auth(props) {
  //handle logout
  const logout = () => {
    auth.signOut();
  };

  var email, pass;
  //create a function that verify the email is valid
  const checkEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  const checkPassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async () => {
    if (!email || !pass) {
      alert("Please fill in both fields.");
      return;
    } else if (!checkEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    } else if (!checkPassword(pass)) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    await auth
      .signInWithEmailAndPassword(email, pass)
      .then(async () => {
        const currentId = auth.currentUser.uid;
        console.log("Current User ID from Auth:", currentId);
        props.navigation.replace("Home", { currentId: currentId });
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex h-full w-full flex-col items-center bg-greenBlue-500 pt-10">
          <StatusBar barStyle="light-content" />
          <View className="flex h-40 flex-row items-center justify-center">
            <Animated.Image
              entering={FadeInUp.duration(1000).easing(
                Easing.inOut(Easing.back(4)),
              )}
              className="absolute left-0 h-20 w-24"
              source={require("../assets/logos/logo_single_part.png")}
            />
            <Animated.Image
              entering={FadeInUp.duration(1000).easing(
                Easing.inOut(Easing.back(4)),
              )}
              className="absolute right-0 h-20 w-24"
              source={require("../assets/logos/logo_single_part.png")}
            />
            <Animated.Image
              entering={BounceInUp.duration(1000).springify()}
              className="absolute z-10 h-32 w-40"
              source={require("../assets/logos/logo_single_part.png")}
            />
          </View>
          <View className="flex flex-row items-center">
            <Animated.Text
              entering={FadeInLeft.duration(1000)
                .easing(Easing.inOut(Easing.back(4)))
                .springify()}
              className="text-3xl font-bold tracking-wider text-slate-100"
            >
              Intra
            </Animated.Text>
            <Animated.Text
              entering={FadeInRight.duration(1000)
                .easing(Easing.inOut(Easing.back(4)))
                .springify()}
              className="text-3xl font-bold tracking-wider text-greenBlue-300"
            >
              Comm
            </Animated.Text>
          </View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(1000).springify()}
            exiting={FadeInRight}
            className="flex flex-1 items-center justify-end"
          >
            <View className="h-[80%] w-full rounded-t-3xl bg-white bg-opacity-30 px-8 shadow-lg dark:bg-dark-500">
              <Text className="mb-10 mt-10 py-3 pl-4 text-center text-5xl font-bold text-greenBlue-300">
                Sign in
              </Text>
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <TextInput
                  keyboardType="email-address"
                  placeholder="Email"
                  onChangeText={(txt) => {
                    email = txt;
                  }}
                  className="my-2 w-full min-w-full rounded-lg border-greenBlue-300 bg-gray-200 py-3 pl-4 text-lg dark:bg-dark-200 dark:text-gray-300 dark:placeholder:text-gray-400"
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <TextInput
                  secureTextEntry
                  placeholder="Password"
                  onChangeText={(txt) => {
                    pass = txt;
                  }}
                  className="my-2 w-full min-w-full rounded-lg border-greenBlue-300 bg-gray-200 py-3 pl-4 text-lg dark:bg-dark-200 dark:text-gray-300 dark:placeholder:text-gray-400"
                />
              </TouchableWithoutFeedback>

              <TouchableOpacity className="min-w-full" onPress={handleSubmit}>
                <Text className="w-full rounded-xl bg-greenBlue-300 py-4 text-center text-xl font-bold text-slate-100">
                  Login
                </Text>
              </TouchableOpacity>
              <View className="mt-3 flex min-w-full flex-row items-center justify-center">
                <Text className="text-lg font-normal text-dark-500 dark:text-gray-400">
                  Don't have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => props.navigation.replace("NewUser")}
                >
                  <Text className="text-lg font-bold text-greenBlue-300">
                    {" "}
                    SignUP
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
