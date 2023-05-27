import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Logo from "../assets/Img/Login/Logo.png";
import { TouchableWithoutFeedback } from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { SET_ACTICE_USER } from "../Redux/authSlice/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [emailVaild, setEmailVaild] = useState(false);
  const [passwordVaild, setPasswordVaild] = useState(false);
  const TextfadeAnim = useRef(new Animated.Value(0)).current;
  const isLoading = useSelector(e=>e.auth)
  const route = useRoute()
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  useEffect(()=>{
    if(isLoading.email){
      navigation.navigate("Home")
    }
  },[navigation ,isFocused ,isLoading.email])
  const loginSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is required"),
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
            initialValues={{ email: "", password: "" }}
            onSubmit={(values, { resetForm }) => {
              setLoading(true);
              getDoc(doc(db, "users", values.email))
                .then((res) => {
                  if (res.data()) {
                    if (res.data().password === values.password) {
                      Keyboard.dismiss();
                      Toast.show({
                        autoHide: true,
                        text1: `Welcome ${res.data().userName}`,
                        position: "top",
                        visibilityTime: 3000,
                        type: "success",
                      });
                      dispatch(
                        SET_ACTICE_USER({
                          ...res.data(),
                          userID: res.data().email,
                        })
                      );
                      AsyncStorage.setItem("login", res.data().email).then(res=>{

                      }).catch(err=>{

                      });
                      setTimeout(() => {
                        navigation.navigate("Home");
                      }, 1000);
                      resetForm();
                    } else {
                      Toast.show({
                        autoHide: true,
                        text1: "Password is Wrong",
                        position: "top",
                        visibilityTime: 3000,
                        type: "error",
                      });
                      setPasswordVaild(true);
                    }
                    // if(v)
                  } else {
                    Toast.show({
                      autoHide: true,
                      text1: "Can't Find This Email",
                      position: "top",
                      visibilityTime: 3000,
                      type: "error",
                    });
                    setEmailVaild(true);
                  }
                  setLoading(false);
                })
                .catch((err) => {
                  setLoading(false);
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
                  } ${
                    emailVaild && ` border-red-400 `
                  } text-white || rounded-md || border || px-4 || py-2 || mb-3`}
                  onChangeText={handleChange("email")}
                  onChange={() => {
                    setEmailVaild(false);
                  }}
                  onBlur={handleBlur("email")}
                  value={values.email}
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
                  } ${
                    passwordVaild && ` border-red-400 `
                  } text-white || rounded-md || border || px-4 || py-2`}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  onChange={() => {
                    setPasswordVaild(false);
                  }}
                  value={values.password}
                />

                <TouchableOpacity>
                  <Text className="text-blue-500 || mt-2 || mb-10 || text-right">
                    Forget a Password
                  </Text>
                </TouchableOpacity>
                {isValid ? (
                  <TouchableOpacity onPress={() => handleSubmit()}>
                    <View className="bg-blue-700 || relative || flex-row || justify-center || items-center || px-4 || py-2.5 || text-center || rounded-md ">
                      {loading ? (
                        <>
                          <Text className="text-lg || text-blue-700 || font-semibold">
                            <Text className="text-blue-700">Login in</Text>
                          </Text>
                          <Text className="absolute  inset-0 ">
                            <ActivityIndicator
                              className=""
                              size="large"
                              color="white"
                            />
                          </Text>
                        </>
                      ) : (
                        <Text className="text-lg || text-white || font-semibold">
                          Login in
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Text className="bg-blue-400 || px-4 || py-2 || text-lg || font-semibold || text-center || rounded-md || text-white">
                    Login in
                  </Text>
                )}
                <View className="flex-row || justify-center || items-center || mt-10">
                  <Text className="text-gray-400">Don't have an account? </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SingUp")}
                  >
                    <Text className="text-blue-500">Sing up</Text>
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

export default LoginScreen;
