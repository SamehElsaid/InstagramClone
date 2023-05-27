import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import { Divider } from "react-native-elements";
import { useSelector } from "react-redux";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../Firebase/firebase";
import Toast from "react-native-toast-message";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRef } from "react";
import { Animated } from "react-native";
import { RadioButton } from "react-native-paper";
import { useEffect } from "react";
import { BackHandler } from "react-native";
const NewPostScreen = () => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView className="bg-black || flex-1">
        <HeaderNewPost />
        <FormikPostUpliad />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const HeaderNewPost = () => {
  const navigation = useNavigation();
  return (
    <View className="flex-row || justify-between || items-center || px-5">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back-ios" size={25} color="white" />
      </TouchableOpacity>
      <Text className="text-white || text-lg || font-semibold">New Post</Text>
      <View className="opacity-0 || invisible">
        <MaterialIcons name="arrow-back-ios" size={25} color="white" />
      </View>
    </View>
  );
};
const FormikPostUpliad = () => {
  const navigation = useNavigation();
  const user = useSelector((data) => data.auth);
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState("post");
  const openLikesAnimation = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;
  const openNowWithAnimation = () => {
    Animated.spring(openLikesAnimation, {
      toValue: 0,
      friction: 5,
      tension: 20,
      useNativeDriver: true,
    }).start();
  };
  const closeNowWithAnimation = () => {
    Animated.spring(openLikesAnimation, {
      toValue: Dimensions.get("window").height,
      friction: 5,
      tension: 20,
      useNativeDriver: true,
    }).start();
  };
  const uploadSchema = Yup.object().shape({
    caption: Yup.string()
      .max(130, "Caption has reached")
      .min(5, "write your caption"),
  });
  const selectImg = () => {
    let result = ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    }).then((res) => {
      setImage(res.assets[0].uri);
    });
  };
  useEffect(() => {
    if (open) {
      const backAction = () => {
        closeNowWithAnimation();
        setOpen(false);
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }
  }, [open]);
  return (
    <View className="px-5 || mt-5">
      <Formik
        initialValues={{ caption: "" }}
        onSubmit={(values, { resetForm }) => {
          const date = new Date();
          let day = date.getDate();
          let mon = date.getMonth() + 1;
          let year = date.getFullYear();
          let hours = date.getHours();
          let min = date.getMinutes();
          let mode = "AM";
          if (min < 10) {
            min = "0" + min;
          }
          if (hours > 12) {
            hours = hours - 12;
            mode = "PM";
          } else {
            mode = "AM";
          }
          fetch(image).then((url) => {
            url.blob().then((finalUrl) => {
              const time = Date.now();
              const storageRef = ref(storage, "time " + time);
              const uploadTask = uploadBytesResumable(storageRef, finalUrl);
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (err) => {
                  console.log(err);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then(
                    (downloadUrl) => {
                      addDoc(collection(db, checked), {
                        email: user.email,
                        textPost: values.caption,
                        imgPost: downloadUrl,
                        time: { day, mon, year, hours, min, mode },
                        timestamp: serverTimestamp(),
                        commentLength: 0,
                        likeLength: 0,
                        comment: [],
                        like: [],
                      })
                        .then((_) => {
                          resetForm();
                          setImage(null);
                          Keyboard.dismiss();
                          Toast.show({
                            autoHide: true,
                            text1: `Added ${checked} Success`,
                            position: "top",
                            visibilityTime: 3000,
                            type: "success",
                          });
                          setTimeout(() => {
                            navigation.navigate("Home");
                          }, 1000);
                        })
                        .catch((err) => {
                          console.log(err.message);
                        });
                    }
                  );
                }
              );
            });
          });
        }}
        validationSchema={uploadSchema}
      >
        {({ handleSubmit, handleChange, values, errors }) => (
          <>
            <View className="flex-row || items-start || gap-x-3">
              <TouchableOpacity onPress={selectImg}>
                <View className="bg-neutral-300 || w-[100px] || h-[100px] || rounded-md || justify-center || items-center">
                  {image ? (
                    <View className="bg-neutral-300 || w-[100px] || h-[100px] || rounded-md || justify-center || items-center">
                      <Image
                        source={{ uri: image }}
                        className="w-[100px] || h-[100px] || rounded-md"
                      />
                    </View>
                  ) : (
                    <Entypo name="image" size={24} color="gray" />
                  )}
                </View>
              </TouchableOpacity>
              <TextInput
                placeholder="Write a caption"
                multiline={true}
                placeholderTextColor={"gray"}
                className="text-lg || text-white flex-1"
                onChangeText={handleChange("caption")}
                value={values.caption}
                maxLength={80}
              />
            </View>
            <Divider
              width={1}
              className="opacity-50 mt-4 mb-2"
              orientation="vertical"
            />

            {!errors.caption && image && values.caption.length !== 0 ? (
              <TouchableOpacity
                onPress={() => {
                  openNowWithAnimation();
                  setOpen(true);
                }}
              >
                <Text className="text-blue-700 || text-lg || font-semibold || mx-auto">
                  Share
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-red-700 || text-lg || font-semibold || mx-auto">
                Share
              </Text>
            )}
            <Animated.View
              style={{
                transform: [{ translateY: openLikesAnimation }],
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
              }}
              className={`${
                open ? `bg-black/60` : ``
              } absolute || top-0 || left-0 || z-10 || flex-col || justify-center || items-center`}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  closeNowWithAnimation();
                  setOpen(false);
                }}
              >
                <View
                  className="absolute"
                  style={{
                    width: Dimensions.get("window").width,
                    height: Dimensions.get("window").height,
                  }}
                ></View>
              </TouchableWithoutFeedback>
              <View className="bg-black || relative || z-10 || p-5 || w-[90%] || h-[80%] || rounded-3xl">
                <View className="flex-col || justify-center || items-center || h-full">
                  <TouchableOpacity
                    className="flex-row || items-center"
                    onPress={() => setChecked("post")}
                  >
                    <RadioButton
                      value="post"
                      color="#2563eb"
                      status={checked === "post" ? "checked" : "unchecked"}
                    />
                    <Text className="text-white || w-[50px]">Post</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-row || items-center"
                    onPress={() => setChecked("store")}
                  >
                    <RadioButton
                      value="store"
                      color="#2563eb"
                      status={checked === "store" ? "checked" : "unchecked"}
                    />
                    <Text className="text-white || w-[50px]">Store</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSubmit} className="mt-5">
                    <Text className="text-blue-700 || text-lg || font-semibold || mx-auto">
                      Share
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </>
        )}
      </Formik>
    </View>
  );
};
export default NewPostScreen;
