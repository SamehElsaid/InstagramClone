import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useEffect, useRef } from "react";
import Logo from "../assets/Img/Login/Logo.png";
import { TouchableWithoutFeedback } from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import Toast from "react-native-toast-message";
import { useState } from "react";

const SingUp = () => {
  const navigation = useNavigation();
  const [emailFound, setEmailFound] = useState(false);
  const TextfadeAnim = useRef(new Animated.Value(0)).current;
  const DefaultImg =
    "https://firebasestorage.googleapis.com/v0/b/insta-clone-a69a5.appspot.com/o/png-transparent-user-profile-computer-icons-profile-heroes-black-silhouette-thumbnail.png?alt=media&token=5920577d-c6e1-4ca2-a848-994acedaca34";
  const loginSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is required"),
    userName: Yup.string()
      .required()
      .min(4, "your userName has to have at least 4 characters")
      .test(
        "No Erro ",
        "Number id erro",
        (value) => isNaN(value) && !value.includes(" ")
      ),
    password: Yup.string()
      .required()
      .min(8, "your password has to have at least 8 characters"),
  });
  const animationStartTextReturn = () => {
    Animated.timing(TextfadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    animationStartTextReturn();
  }, []);
  const initialValues = { email: "", userName: "", password: "" };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <SafeAreaView className="bg-black || flex-1 || flex-row || justify-center || items-center">
        <Animated.View
          style={{ opacity: TextfadeAnim }}
          className="px-5 flex-1"
        >
          <Image source={Logo} className="w-[100px] h-[100px] mx-auto mb-16" />
          <Formik
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => {
              getDoc(doc(db, "users", values.email)).then((res) => {
                if (res.data()) {
                  Toast.show({
                    autoHide: true,
                    text1: "This Email is already Used",
                    position: "top",
                    visibilityTime: 3000,
                    type: "error",
                  });
                  setEmailFound(true);
                } else {
                  setDoc(doc(db, "users", values.email), {
                    ...values,
                    urlImg: DefaultImg,
                  })
                    .then((_) => {
                      resetForm();
                      Keyboard.dismiss();
                      Toast.show({
                        autoHide: true,
                        text1: "Sing up success Login now",
                        position: "top",
                        visibilityTime: 3000,
                        type: "success",
                      });
                      setTimeout(() => {
                        navigation.navigate("Login");
                      }, 3000);
                    })
                    .catch((err) => {
                      console.log(err.message);
                    });
                }
              });
            }}
            validationSchema={loginSchema}
            validateOnMount={true}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isValid,
              errors,
            }) => (
              <>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  className={`${
                    values.email.length > 1
                      ? errors.email
                        ? ` border-red-400 `
                        : ` border-green-400 `
                      : ` border-gray-400 `
                  }${
                    emailFound && ` border-red-400 `
                  } text-white || rounded-md || border || px-4 || py-2 || mb-3`}
                  onChangeText={handleChange("email")}
                  onChange={() => {
                    setEmailFound(false);
                  }}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                <TextInput
                  placeholder="Username"
                  placeholderTextColor="#9ca3af"
                  keyboardType="default"
                  textContentType="username"
                  maxLength={20}
                  className={`${
                    values.userName.length > 1
                      ? errors.userName
                        ? ` border-red-400 `
                        : ` border-green-400 `
                      : ` border-gray-400 `
                  }text-white || rounded-md || border || px-4 || py-2 || mb-3`}
                  onChangeText={handleChange("userName")}
                  onBlur={handleBlur("userName")}
                  value={values.userName}
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#9ca3af"
                  textContentType="password"
                  secureTextEntry={true}
                  autoCorrect={false}
                  autoCapitalize="none"
                  className={`${
                    values.password.length > 1
                      ? errors.password
                        ? ` border-red-400 `
                        : ` border-green-400 `
                      : ` border-gray-400 `
                  }text-white || rounded-md || border || mb-14 || px-4 || py-2`}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                />

                {isValid ? (
                  <TouchableOpacity onPress={() => handleSubmit()}>
                    <Text className="bg-blue-700 || px-4 || py-2 || text-lg || font-semibold || text-center || rounded-md || text-white">
                      Login in
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text className="bg-blue-400 || px-4 || py-2 || text-lg || font-semibold || text-center || rounded-md || text-white">
                    Login in
                  </Text>
                )}
                <View className="flex-row || justify-center || items-center || mt-10">
                  <Text className="text-gray-400">
                    Already have an account?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text className="text-blue-500">Log in</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </Animated.View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SingUp;
