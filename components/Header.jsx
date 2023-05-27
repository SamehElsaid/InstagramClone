import { View, Text, Image } from "react-native";
import React from "react";
import logo from "../assets/Img/Home/logo.png";
import { TouchableOpacity } from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const Header = () => {
  const navigation = useNavigation();
  return (
    <View className="flex-row || justify-between || items-center || relative || px-5">
      <TouchableOpacity>
        <Image
          className="h-[60px] w-[110px]"
          resizeMode="contain"
          source={logo}
        />
      </TouchableOpacity>
      <View>
        <View className="flex-row || gap-x-2 || items-center">
          <TouchableOpacity
            onPress={() => navigation.navigate("NewPostScreen")}
          >
            <Feather name="plus-square" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
            <AntDesign name="message1" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="absolute || right-[10px] || top-[10%]">
        <Text className="bg-red-600 || text-white || px-1.5 || rounded-lg">
          11
        </Text>
      </View>
    </View>
  );
};

export default Header;
