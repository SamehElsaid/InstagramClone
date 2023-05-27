import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import HeaderMessage from "../components/HeaderMessage";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const Messages = () => {
  const myUser = useSelector((me) => me.auth);
  const [datamessage, setDataMessage] = useState([]);
  const getMessage = () => {
    let sub = onSnapshot(
      query(collection(db, "message"), orderBy("timestamp", "desc")),
      (snapshot) => {
        let fetch = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        const newData = fetch.filter((e) => e.name.includes(myUser.email));
        setDataMessage(newData);
      }
    );
    return sub;
  };
  useEffect(() => {
    getMessage();
  }, []);
  return (
    <SafeAreaView className="bg-black || flex-1">
      <HeaderMessage />
      <ScrollView className="flex-1 || px-5 || py-10">
        {datamessage.length !== 0 &&
          datamessage.map((message) => (
            <ProfileOfMassage message={message} key={message.id} />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};
const ProfileOfMassage = ({ message }) => {
  const myUser = useSelector((me) => me.auth);
  const navigation = useNavigation();
  const [profileInfo, setProfileInfo] = useState(false);
  const goToPageMessages = () => {
    navigation.navigate("CustomMessage", { message, profileInfo });
  };
  useEffect(() => {
    const withAccount = message.name.find((e) => e !== myUser.email);
    getDoc(doc(db, "users", withAccount)).then((res) => {
      setProfileInfo(res.data());
    });
  }, []);
 
  return (
    <>
      {profileInfo && (
        <TouchableOpacity className="mb-3 || px-5" onPress={goToPageMessages}>
          <View className="flex-row  || items-center ">
            <Image
              source={{ uri: profileInfo.urlImg }}
              className="w-[65px] || h-[65px] || mr-3 || rounded-full"
            />
            <View>
              <Text className="text-white || text-lg || capitalize">
                {profileInfo.userName}
              </Text>
              <Text className="text-gray-400 || capitalize">{message.massages[message.massages.length-1]?.message ?
               <>{message.massages[message.massages.length-1].by === myUser.email ? `You: ${message.massages[message.massages.length-1].message}` : `${profileInfo.userName}: ${message.massages[message.massages.length-1].message}`}</> : "Start Message Now 😁"}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};
export default Messages;
