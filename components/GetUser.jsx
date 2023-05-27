import { View, Text } from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { db } from "../Firebase/firebase";
import { SET_ACTICE_USER } from "../Redux/authSlice/authSlice";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute } from "@react-navigation/native";

const GetUser = ({ loading, setLoading }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    setLoading(true);
    const value = AsyncStorage.getItem("login")
      .then((res) => {
        getDoc(doc(db, "users", res))
          .then((res) => {
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
          })
          .then((res) => {
            navigation.navigate("Home");
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          }).catch(err=>{
            setLoading(false);
          });
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);
  return null;
};

export default GetUser;
