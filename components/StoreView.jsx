import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import second from "../assets/Img/Post/post.jpg";
import LinearPng from "../assets/Img/Post/post.jpg";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { CLOSE_STORY } from "../Redux/storeSlice/storeSlice";
import { useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
const StoreView = () => {
  const openStory = useSelector((e) => e.story);
  const dispatch = useDispatch();
  const [time, setTime] = useState(false);
  const [profileInfo,setProfileInfo]=useState(false)
  const animWidth = useRef(
    new Animated.Value(-Dimensions.get("window").width)
  ).current;
  useEffect(() => {
    openStory && setTime(openStory.data.time);
  }, [openStory]);
  const animView = () => {
    Animated.timing(animWidth, {
      toValue: 0,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    if(openStory){
      if(openStory.data.email){
        getDoc(doc(db, "users", openStory.data.email)).then((res) => {
          setProfileInfo(res.data());
        });
      }
    }
  }, [openStory]);
 
  useEffect(() => {
    if (openStory?.open) {
      animView();
      const timeOutFn = setTimeout(() => {
        dispatch(CLOSE_STORY());
      }, 5000);
      return () => clearTimeout(timeOutFn);
    }
  }, [openStory?.open]);
  const [date, setDate] = useState(new Date());
  let day = date.getDate();
  let mon = date.getMonth() + 1;
  let year = date.getFullYear();
  let hours = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();
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
  useEffect(() => {
    setInterval(() => {
      setDate(new Date());
    }, 1000);
  }, []);
  return (
    <View className="absolute || top-0 || left-0 || h-full || w-full || bg-red-400 || z-10">
      <View className="absolute || top-0 || left-0 || z-10 || w-full || bg-black/50">
        <View className="w-full || h-[2px] || bg-gray-500 ">
          <Animated.View
            style={{ transform: [{ translateX: animWidth }] }}
            className="w-[100%] || h-[2px] || bg-white"
          ></Animated.View>
        </View>
        <View className=" w-full || h-full || mt-3">
          <View className="flex-row || items-center || justify-between || px-5 || mb-2">
            <View className="relative || w-[42px] || h-[42px] || justify-center || items-center">
              <Image
                className="w-[42px] || h-[42px] || rounded-full || absolute"
                resizeMode="cover"
                source={{uri:profileInfo.urlImg}}
              />
              <Image
                className="w-[40px] || h-[40px] || rounded-full || relative"
                resizeMode="cover"
                source={{uri:profileInfo.urlImg}}
              />
            </View>
            <View className="flex-1">
              <Text className="text-white  || ml-3 || font-semibold || text-base">
                {/* {dataUserPost.userName} */}
                {profileInfo && profileInfo.userName}
              </Text>
              <Text className="text-white  || ml-3 || font-semibold || text-xs">
                {time && time.year === year ? (
                  time.mon === mon ? (
                    time.day == day ? (
                      <Text className="text-white  || ml-3 || font-semibold || text-xs">
                        {hours - time.hours === 0
                          ? `${min - time.min === 0 ? "1" : min - time.min }M`
                          : `${hours - time.hours} H`}
                      </Text>
                    ) : (
                      <Text className="text-white  || ml-3 || font-semibold || text-xs">
                        {time.day}.{time.mon}.{time.year}
                      </Text>
                    )
                  ) : (
                    <Text className="text-white  || ml-3 || font-semibold || text-xs">
                      {time.day}.{time.mon}.{time.year}
                    </Text>
                  )
                ) : (
                  <Text className="text-white  || ml-3 || font-semibold || text-xs">
                    {time.day}.{time.mon}.{time.year}
                  </Text>
                )}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                dispatch(CLOSE_STORY());
              }}
            >
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Image
        source={{ uri: openStory?.data.img }}
        className="h-full || w-full "
        resizeMode="cover"
      />
    </View>
  );
};

export default StoreView;
