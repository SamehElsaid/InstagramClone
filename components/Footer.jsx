import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign, Feather, Foundation, Octicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
const Footer = () => {
  const router = useRoute();
  const user = useSelector((myUser) => myUser.auth.img);
  const navigator = useNavigation();
  return (
    <View className="px-5 || bg-black || py-0.5 || mt-0.5 || flex-row || justify-around">
      <TouchableOpacity onPress={()=>navigator.navigate("Home")}>
        <Foundation
          name="home"
          size={30}
          color={router.name === "Home" ? "white" : "#71717a"}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <AntDesign name="search1" size={30} color="#71717a" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Octicons name="video" size={30} color="#71717a" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Feather name="shopping-bag" size={30} color="#71717a" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigator.navigate("AccountUser")}>
        <View>
          <View
            className={`${
              router.name === "AccountUser"
                ? ` w-[37px] || h-[37px] || bg-white`
                : ` w-[35px] || h-[35px] || bg-neutral-700`
            } relative ||  ||  rounded-full || justify-center || items-center`}
          >
            <Image
              className="w-[35px] || h-[35px] || rounded-full || relative"
              resizeMode="cover"
              source={{ uri: user }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const ActiveIcon = ({ clildren }) => {};
export default Footer;
