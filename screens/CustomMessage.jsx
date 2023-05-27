import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Text,
  Image,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  Touchable,
} from "react-native";
import React, { useRef } from "react";
import CustomMessageHeader from "../components/CustomMessageHeader";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const CustomMessage = ({ route }) => {
  const user = useSelector((e) => e.auth);
  const [comment, setComment] = useState("");
  const { message, profileInfo } = route.params;
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);
  const getMessage = () => {
    let sub = onSnapshot(
      query(collection(db, "message"), orderBy("timestamp", "desc")),
      (snapshot) => {
        let fetch = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        const findMyData = fetch.find((e) => e.id === message.id);
        if (fetch) {
          setMessages(findMyData.massages.reverse());
          
        }
      }
    );
    return sub;
  };
  useEffect(() => {
    getMessage();
  }, []);

  const sendComm = () => {
    if (comment.length !== 0) {
      getDoc(doc(db, "message", message.id)).then((res) => {
        setComment("");
        updateDoc(doc(db, "message", message.id), {
          massages: [
            ...res.data().massages,
            { by: user.email, message: comment },
          ],
          timestamp: serverTimestamp(),
        });
      });
    }
  };

  return (
    <SafeAreaView className="bg-black || flex-1">
      <CustomMessageHeader profileInfo={profileInfo} />
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="always"

      >
        <FlatList
          ref={scrollRef}
          data={messages}
          contentContainerStyle={{
            flexDirection: "column",
            gap: 10,
            paddingVertical: 20,
          }}
          inverted={true}
          className="flex-1"
          keyExtractor={(_, i) => i}
          renderItem={({ item }) => (
            <>
              {item.by === user.email ? (
                <Text className="text-white || ml-auto || bg-[#3797f0] || px-5 || rounded-3xl || text-lg || py-2">
                  {item.message}
                </Text>
              ) : (
                <View className="flex-row || items-center">
                  <Image
                    source={{ uri: profileInfo.urlImg }}
                    className="w-[50px] || h-[50px] || rounded-full mr-2"
                  />
                  <Text className="text-white || bg-[#262626] || px-5 || rounded-3xl || text-lg || py-2">
                    {item.message}
                  </Text>
                </View>
              )}
            </>
          )}
        />
      </TouchableWithoutFeedback>
      <View className="mb-1.5 || px-5">
        <View
          className="|| px-5 || rounded-3xl || flex-row || items-center"
          style={{ borderColor: "gray", borderWidth: 1 }}
        >
          <TextInput
            placeholder="Write a caption"
            multiline={true}
            placeholderTextColor={"gray"}
            className="text-lg || text-white || mr-2 || flex-1 || py-3 "
            maxLength={80}
            onChangeText={(e) => {
              setComment(e);
            }}
            value={comment}
          />
          <TouchableOpacity onPress={sendComm}>
            <Ionicons name="ios-send-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomMessage;
