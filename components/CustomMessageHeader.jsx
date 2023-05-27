import { View, Text ,TouchableOpacity,Image} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'

const CustomMessageHeader = ({profileInfo}) => {
    const navigation = useNavigation()
  return (
    <View className="flex-row || justify-between || items-center || px-5">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back-ios" size={25} color="white" />
      </TouchableOpacity>
      <View className="flex-row || items-center ">
            <Image
              source={{ uri: profileInfo.urlImg }}
              className="w-[40px] || h-[40px] || mr-3 || rounded-full"
            />
            <Text className="text-white || text-lg || capitalize">
              {profileInfo.userName}
            </Text>
          </View>
      <View className="opacity-0 || invisible">
        <MaterialIcons name="arrow-back-ios" size={25} color="white" />
      </View>
    </View>
  );
}

export default CustomMessageHeader