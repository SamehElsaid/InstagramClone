import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const HeaderMessage = () => {
    const user = useSelector(e=>e.auth)
    const navigation = useNavigation()
  return (
    <View className="flex-row || justify-between || items-center || px-5">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back-ios" size={25} color="white" />
      </TouchableOpacity>
      <Text className="text-white || text-lg || font-semibold">{user?.userName}</Text>
      <View className="opacity-0 || invisible">
        <MaterialIcons name="arrow-back-ios" size={25} color="white" />
      </View>
    </View>
  );
};

export default HeaderMessage;
