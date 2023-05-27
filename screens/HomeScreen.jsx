import {
  Animated,
  BackHandler,
  FlatList,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Store from "../components/Store";
import { Divider } from "react-native-elements";
import Post from "../components/Post";
import Footer from "../components/Footer";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { CLOSE_LIKES } from "../Redux/likesSlice/likesSlice";
import ListOfLike from "../components/ListOfLike";
import { ScrollView } from "react-native";
import { Dimensions } from "react-native";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import StoreView from "../components/StoreView";
// import Swiper from "react-native-swiper";
// import { Image } from "react-native";
const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [dataStore, setDataStore] = useState([]);
  const [openSend, setOpenSend] = useState(false);

  // const [lengthSwiper, setLengthSwiper] = useState(0);
  // const [openStore, setOpenStore] = useState(true);
  const openLikes = useSelector((e) => e.likes);
  const openStory = useSelector((e) => e.story);
  const navigation = useNavigation();
  const previousRouteName =
    navigation.getState().routes[navigation.getState().index - 1]?.name;
  const route = useRoute();

  // const swiperRef = useRef();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const openLikesAnimation = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;
  const storeTime = useRef(
    new Animated.Value(-Dimensions.get("window").width)
  ).current;
  // const startAnimation = () => {
  //   Animated.timing(storeTime, {
  //     toValue: 0,
  //     duration: 5000,
  //     useNativeDriver: true,
  //   }).start(() => {
  //     Animated.timing(storeTime, {
  //       toValue: -Dimensions.get("window").width,
  //       duration: 0,
  //       useNativeDriver: true,
  //     }).start()
  //   });
  // };
  const handleData = () => {
    setIsRefresh(true);
    getDocs(query(collection(db, "post"), orderBy("timestamp", "desc"))).then(
      (snapshot) => {
        let fetch = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setIsRefresh(false);
        setData(fetch);
      }
    );
  };
  const getDataOfStore = () => {
    let sub = onSnapshot(
      query(collection(db, "store"), orderBy("timestamp", "desc")),
      (snapshot) => {
        let fetch = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setDataStore(fetch);
      }
    );
  };
  useEffect(() => {
    handleData();
  }, [storeTime]);
  const openNowWithAnimation = () => {
    Animated.spring(openLikesAnimation, {
      toValue: 0,
      friction: 5,
      tension: 20,
      useNativeDriver: true,
    }).start();
  };
  const closeNowWithAnimation = () => {
    Animated.spring(openLikesAnimation, {
      toValue: Dimensions.get("window").height,
      friction: 5,
      tension: 20,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    if (openLikes.open) {
      openNowWithAnimation();
    } else {
      closeNowWithAnimation();
    }
  }, [openLikes.open]);
  useEffect(() => {
    if (openLikes.open) {
      const backAction = () => {
        closeNowWithAnimation();
        dispatch(CLOSE_LIKES());
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    } else {
      const backAction = () => {
        if (previousRouteName === "Login") {
          BackHandler.exitApp();
          return true;
        } else {
          return false;
        }
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }
  }, [openLikes.open, isFocused, navigation, previousRouteName, route.name]);
  useEffect(() => {
    getDataOfStore();
  }, []);
  const handleClose = () => {
    setOpenSend(false);
  };
  return (
    <TouchableWithoutFeedback onPress={handleClose}>
      <SafeAreaView className="bg-black flex-1">
        <Header />
        {openStory.open && <StoreView />}
        <Animated.View
          style={{
            transform: [{ translateY: openLikesAnimation }],
          }}
          className={`${
            openLikes.open ? `bg-black/60` : ``
          } absolute || w-full || h-full || top-0 || left-0 || z-10 || flex-col || justify-center || items-center`}
        >
          <View className="bg-black || relative || z-10 || p-5 || w-[90%] || h-[80%] || rounded-3xl">
            <Text className=" text-white || text-lg || font-semibold || text-center">
              {openLikes.open &&
                openLikes.data.likeLength &&
                openLikes.open &&
                openLikes.data.likeLength}{" "}
              Likes
            </Text>
            <ScrollView>
              {openLikes.open &&
                openLikes.data.like.length !== 0 &&
                openLikes.data.like.map((e, i) => (
                  <ListOfLike item={e} key={i} />
                ))}
            </ScrollView>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              dispatch(CLOSE_LIKES());
            }}
          >
            <View className="absolute || w-full || h-full"></View>
          </TouchableWithoutFeedback>
        </Animated.View>
        <FlatList
          keyboardShouldPersistTaps="always"
          data={data}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => <Store dataStore={dataStore} />}
          renderItem={({ item }) => (
            <Post
              openSend={openSend}
              setOpenSend={setOpenSend}
              isRefresh={isRefresh}
              item={item}
            />
          )}
          ItemSeparatorComponent={() => (
            <Divider
              width={1}
              className="opacity-50 my-3"
              orientation="vertical"
            />
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 || pt-8">
              <Text className="text-white || text-center || text-3xl">
                There is No Post
              </Text>
            </View>
          )}
          refreshing={isRefresh}
          onRefresh={handleData}
          ListFooterComponent={() => {
            data.length !== 0 && (
              <Divider
                width={1}
                className="opacity-50 my-3"
                orientation="vertical"
              />
            );
          }}
        />
        <Footer />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;
