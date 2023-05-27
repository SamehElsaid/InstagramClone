import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  REMOVE_ACTICE_USER,
  SET_ACTICE_USER,
} from "../Redux/authSlice/authSlice";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Formik } from "formik";
import * as Yup from "yup";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../Firebase/firebase";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const AccountUser = () => {
  const user = useSelector((myUser) => myUser.auth);
  const [userName, setUserName] = useState("");
  const [vaildUser, setVaildUser] = useState(true);
  const [openUser, setOpenUser] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [vaildPassword, setVaildPassword] = useState(false);
  const [vaildEmail, setVaildEmail] = useState(false);
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const logOut = () => {
    AsyncStorage.removeItem("login")
      .then((res) => {
        dispatch(REMOVE_ACTICE_USER());
        Toast.show({
          autoHide: true,
          text1: `Logout`,
          position: "top",
          visibilityTime: 3000,
          type: "info",
        });
        navigation.navigate("Login");
      })
      .catch((err) => {});
  };
  const emailVaild = Yup.object().shape({
    email: Yup.string().email().required("Email is required"),
  });
  const passwordVaild = Yup.object().shape({
    password: Yup.string()
      .required()
      .min(8, "your password has to have at least 8 characters"),
  });
  const changeName = () => {
    setVaildUser(false);
    getDoc(doc(db, "users", user.email)).then((res) => {
      updateDoc(doc(db, "users", user.email), {
        ...res.data,
        userName: userName,
      }).then((res) => {
        getDoc(doc(db, "users", user.email)).then((finalData) => {
          dispatch(
            SET_ACTICE_USER({
              ...finalData.data(),
              userID: finalData.data().email,
            })
          );
          setOpenUser(false);
          setVaildUser(true);
        });
      });
    });
  };
  useEffect(() => {
    setUserName(user.userName);
  }, [user, openUser]);
  const selectNewImg = () => {
    let result = ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    }).then((res) => {
      setImage(res.assets[0].uri);
      // To covert To normal img like as web
      fetch(res.assets[0].uri).then((url) => {
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
              getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                updateDoc(doc(db, "users", user.email), {
                  urlImg: downloadUrl,
                }).then((_) => {
                  getDoc(doc(db, "users", user.email)).then((finalData) => {
                    dispatch(
                      SET_ACTICE_USER({
                        ...finalData.data(),
                      })
                    );
                  });
                });
              });
            }
          );
        });
      });
    });
  };
  return (
    <SafeAreaView className="bg-black || flex-1">
      <Header />
      <ScrollView className="flex-1 || px-5 || py-10">
        <View>
          <TouchableOpacity onPress={selectNewImg}>
            <Image
              source={{ uri: image ? image : user.img }}
              className="w-[200px] || h-[200px] || rounded-full || m-auto"
            />
          </TouchableOpacity>
        </View>
        <View className="flex-row || justify-between || items-center || mt-3">
          <Text className="text-white || capitalize">
            name: {user.userName}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setOpenUser(!openUser);
            }}
          >
            <Text className={`${openUser ? `text-red-600` : `text-blue-600`}`}>
              {openUser ? "Close" : "Change"}
            </Text>
          </TouchableOpacity>
        </View>
        {openUser && (
          <View className="my-3">
            <TextInput
              placeholder="Username"
              placeholderTextColor="#9ca3af"
              keyboardType="default"
              textContentType="username"
              maxLength={20}
              value={userName}
              onChangeText={(e) => {
                setUserName(e);
                if (
                  isNaN(e) &&
                  !e.includes(" ") &&
                  e.length > 4 &&
                  e.length > 1
                ) {
                  setVaildUser(true);
                } else {
                  setVaildUser(false);
                }
              }}
              className={`
                ${vaildUser ? `border-green-400` : `border-red-400`}
                ${userName === user.userName && `border-red-400`}
                    text-white || rounded-md || border || px-4 || py-2 || mb-3`}
            />
            {userName !== user.userName && vaildUser ? (
              <TouchableOpacity className="flex-row" onPress={changeName}>
                <Text className="bg-blue-600 || text-white || py-2 || capitalize || text-lg || text-center || flex-1">
                  Save
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="flex-row">
                <Text className="bg-red-600 || text-white || py-2 || capitalize || text-lg || text-center || flex-1">
                  Save
                </Text>
              </View>
            )}
          </View>
        )}
        <View className="flex-row || justify-between || items-center || mt-4">
          <Text className="text-white || capitalize">Email: {user.email}</Text>
          <TouchableOpacity onPress={() => setOpenEmail(!openEmail)}>
            <Text className={`${openEmail ? `text-red-600` : `text-blue-600`}`}>
              {openEmail ? "Close" : "Change"}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Email */}
        {openEmail && (
          <View className="my-3">
            <Formik
              initialValues={{ email: user.email }}
              onSubmit={(values) => {
                setVaildEmail(true);
                getDoc(doc(db, "users", user.email)).then((res) => {
                  updateDoc(doc(db, "users", user.email), {
                    email: values.email,
                  }).then((_) => {
                    setDoc(doc(db, "users", values.email), {
                      ...res.data(),
                      email: values.email,
                    }).then((_) => {
                      deleteDoc(doc(db, "users", res.data().email)).then(
                        (_) => {
                          dispatch(
                            SET_ACTICE_USER({
                              ...res.data(),
                              userID: values.email,
                              email: values.email,
                            })
                          );
                          AsyncStorage.setItem("login", values.email)
                            .then((res) => {
                              setVaildEmail(false);
                              setOpenEmail(false);
                            })
                            .catch((err) => {});
                        }
                      );
                    });
                  });
                });
              }}
              validationSchema={emailVaild}
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
                    value={values.email}
                    onChangeText={handleChange("email")}
                    className={`
                ${!errors.email ? `border-green-400` : `border-red-400`}
                ${vaildEmail && `border-red-400`}
                ${values.email === user.email && `border-red-400`}
                    text-white || rounded-md || border || px-4 || py-2 || mb-3`}
                  />
                  {values.email !== user.email &&
                  !errors.email &&
                  !vaildEmail ? (
                    <TouchableOpacity
                      className="flex-row"
                      onPress={() => handleSubmit()}
                    >
                      <Text className="bg-blue-600 || text-white || py-2 || capitalize || text-lg || text-center || flex-1">
                        Save
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View className="flex-row">
                      <Text className="bg-red-600 || text-white || py-2 || capitalize || text-lg || text-center || flex-1">
                        Save
                      </Text>
                    </View>
                  )}
                </>
              )}
            </Formik>
          </View>
        )}
        <View className="flex-row || justify-between || items-center || mt-4">
          <Text className="text-white || capitalize">Password</Text>
          <TouchableOpacity onPress={() => setOpenPassword(!openPassword)}>
            <Text
              className={`${openPassword ? `text-red-600` : `text-blue-600`}`}
            >
              {openPassword ? "Close" : "Change"}
            </Text>
          </TouchableOpacity>
        </View>
        {openPassword && (
          <View className="my-3">
            <Formik
              initialValues={{ password: "" }}
              onSubmit={(values) => {
                setVaildPassword(true);
                getDoc(doc(db, "users", user.email)).then((res) => {
                  updateDoc(doc(db, "users", user.email), {
                    ...res.data,
                    password: values.password,
                  }).then((_) => {
                    logOut();
                    setVaildPassword(false);
                  });
                });
              }}
              validationSchema={passwordVaild}
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
                    placeholder="Password"
                    placeholderTextColor="#9ca3af"
                    textContentType="password"
                    secureTextEntry={true}
                    autoCorrect={false}
                    autoCapitalize="none"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    className={`
                ${!errors.password ? `border-green-400` : `border-red-400`}
                ${vaildPassword && `border-red-400`}
                    text-white || rounded-md || border || px-4 || py-2 || mb-3`}
                  />
                  {!errors.password && !vaildPassword ? (
                    <TouchableOpacity
                      className="flex-row"
                      onPress={() => handleSubmit()}
                    >
                      <Text className="bg-blue-600 || text-white || py-2 || capitalize || text-lg || text-center || flex-1">
                        Save
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View className="flex-row">
                      <Text className="bg-red-600 || text-white || py-2 || capitalize || text-lg || text-center || flex-1">
                        Save
                      </Text>
                    </View>
                  )}
                </>
              )}
            </Formik>
          </View>
        )}
        <View className="flex-row || justify-between || items-center || mt-4">
          <TouchableOpacity className="flex-row" onPress={logOut}>
            <Text className="text-blue-600 || capitalize || text-lg || text-center || flex-1">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

export default AccountUser;
