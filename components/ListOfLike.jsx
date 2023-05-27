import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import LinearPng from "../assets/Img/Store/LinearPng.png";
import { Image } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { Skeleton } from "@rneui/base";

const ListOfLike = ({ item }) => {
  const [dataUserPost, setDataUserPost] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getDoc(doc(db, "users", item))
      .then((res) => {
        setDataUserPost(res.data());
      })
      .then((res) => {
        setLoading(true);
      });
  }, [item]);
  return (
    <View className={`mt-5 flex-row || px-5 || items-center`}>
      <View>
        <View className="relative || w-[50px] || h-[50px] || justify-center || items-center">
          {loading ? (
            <>
              <Image
                className="w-[50px] || h-[50px] || rounded-full || absolute"
                resizeMode="cover"
                source={LinearPng}
              />
              <Image
                className="w-[48px] || h-[48px] || rounded-full || relative"
                resizeMode="cover"
                source={{ uri: dataUserPost.urlImg }}
              />
            </>
          ) : (
            <Text>
              <Skeleton
                width={50}
                circle
                height={50}
                animation="pulse"
                skeletonStyle={{ backgroundColor: "gray" }}
              />
            </Text>
          )}
        </View>
      </View>
      <View className="flex-1 || ml-3">
        {loading ? (
          <Text className="text-white || font-semibold || text-base">
            {dataUserPost.userName}
          </Text>
        ) : (
          <Skeleton
            className="flex-1"
            height={20}
            animation="wave"
            skeletonStyle={{ backgroundColor: "gray" }}
          />
        )}
      </View>
    </View>
  );
};

export default ListOfLike;
