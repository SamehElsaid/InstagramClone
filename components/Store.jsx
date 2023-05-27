import { View, FlatList } from "react-native";
import React from "react";
import StoreSlice from "./StoreSlice";
import { Divider } from "react-native-elements";
const Store = ({dataStore}) => {

  return (
    <View className="">
      <FlatList
        data={dataStore}
        horizontal
        contentContainerStyle={{flexDirection:"row",gap:10,paddingHorizontal:20}}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <StoreSlice key={item.id} item={item}/> }
      />
      <Divider
            width={1}
            className="opacity-50 my-3"
            orientation="vertical"
          />
    </View>
  );
};

export default Store;
