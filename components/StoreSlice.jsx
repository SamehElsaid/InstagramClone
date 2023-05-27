import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import LinearPng from "../assets/Img/Store/LinearPng.png";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useDispatch } from "react-redux";
import { OPEN_STORY } from "../Redux/storeSlice/storeSlice";
const StoreSlice = ({ item }) => {
  const dispatch = useDispatch();
  const [dataUserPost, setDataUserPost] = useState(false);
  useEffect(() => {
    getDoc(doc(db, "users", item.email)).then((res) => {
      setDataUserPost(res.data());
    });
  }, []);
  const handleView = () => {
    dispatch(
      OPEN_STORY({
        dataUserPost,
        img:item.imgPost,
        time:item.time,
        email:dataUserPost.email
      })
    );
  };
  return (
    <TouchableOpacity onPress={handleView} className="">
      <View className="relative || w-[73px] || h-[73px] || justify-center || items-center">
        <Image
          className="w-[73px] || h-[73px] || rounded-full || absolute"
          resizeMode="cover"
          source={LinearPng}
        />
        <Image
          className="w-[70px] || h-[70px] || rounded-full || relative"
          resizeMode="cover"
          source={{ uri: item.imgPost }}
        />
      </View>
      <Text className="text-white || text-center || mt-1 || lowercase">
        {dataUserPost.length && dataUserPost.userName.length > 10
          ? dataUserPost.userName.slice(0, 10) + "..."
          : dataUserPost.userName}
      </Text>
    </TouchableOpacity>
  );
};

export default StoreSlice;
