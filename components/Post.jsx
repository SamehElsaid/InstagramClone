import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  SafeAreaView,
} from "react-native";
import React, { useRef, useState } from "react";
import LinearPng from "../assets/Img/Store/LinearPng.png";
import { AntDesign, Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Divider } from "react-native-elements";
import { useEffect } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { OPEN_LIKES } from "../Redux/likesSlice/likesSlice";

const Post = ({ item, isRefresh, openSend, setOpenSend }) => {
  const [showComment, setShowComment] = useState(false);
  const [dataUserPost, setDataUserPost] = useState(false);
  const [love, setLove] = useState(false);
  const [reload, setReload] = useState(1);
  const [newData, setNewData] = useState([]);
  const myUser = useSelector((me) => me.auth);
  useEffect(() => {
    getDoc(doc(db, "users", item.email)).then((res) => {
      setDataUserPost(res.data());
    });
  }, [isRefresh]);
  useEffect(() => {
    getDoc(doc(db, "post", item.id)).then((res) => {
      setNewData(res.data());
      const myEmailFound = res.data().like.find((e) => e === myUser.email);
      if (myEmailFound) {
        setLove(true);
      } else {
        setLove(false);
      }
    });
  }, [reload, isRefresh]);
  const sendMessage = () => {
    getDoc(doc(db, "message", `${dataUserPost.email}&&${myUser.email}`)).then(
      (res) => {
        if (!res.data()) {
          getDoc(
            doc(db, "message", `${myUser.email}&&${dataUserPost.email}`)
          ).then((res) => {
            if (!res.data()) {
              setDoc(
                doc(db, "message", `${myUser.email}&&${dataUserPost.email}`),
                {
                  name: [myUser.email, dataUserPost.email],
                  massages: [],
                  timestamp: serverTimestamp(),
                }
              );
            }
          });
        }
      }
    );
  };
  return (
    <View>
      <HeaderPost
        dataUserPost={dataUserPost}
        time={item.time}
        openSend={openSend}
        setOpenSend={setOpenSend}
      />
      {dataUserPost.email !== myUser.email && openSend && (
        <View className="w-[200px] || h-[120px] || top-[50px] || rounded-2xl || justify-center || items-center || absolute || bg-black  || border || border-neutral-600 || left-[30px] || z-20">
          <TouchableOpacity onPress={sendMessage}>
            <Image
              source={{ uri: dataUserPost.urlImg }}
              className="w-[50px] || h-[50px] || rounded-full || mx-auto || mb-2"
              resizeMode="cover"
            />
            <Text className="text-white || text-lg">Send Message</Text>
          </TouchableOpacity>
        </View>
      )}
      <ContentPostImage itemImg={item.imgPost} />
      <ContentPostInfo
        love={love}
        setLove={setLove}
        item={item}
        reload={reload}
        setReload={setReload}
      />
      <ContentCaption
        newData={newData}
        itemText={item.textPost}
        commentLength={item.commentLength}
        setShowComment={setShowComment}
        showComment={showComment}
        item={item}
        reload={reload}
        setReload={setReload}
      />
    </View>
  );
};
const HeaderPost = ({ dataUserPost, time, openSend, setOpenSend }) => {
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
    <View className="relative">
      <View className="flex-row || items-center || justify-between || w-full || px-5 || mb-2">
        <TouchableOpacity
          className="flex-row || items-center"
          onPress={() => {
            setOpenSend(!openSend);
          }}
        >
          <View className="relative || w-[42px] || h-[42px] || justify-center || items-center">
            <Image
              className="w-[42px] || h-[42px] || rounded-full || absolute"
              resizeMode="cover"
              source={LinearPng}
            />
            <Image
              className="w-[40px] || h-[40px] || rounded-full || relative"
              resizeMode="cover"
              source={{ uri: dataUserPost.urlImg }}
            />
          </View>
          <View className="">
            <Text className="text-white || capitalize  || ml-3 || font-semibold || text-base">
              {dataUserPost.userName}
            </Text>
            <Text className="text-white  || ml-3 || font-semibold || text-xs">
              {time.year === year ? (
                time.mon === mon ? (
                  time.day == day ? (
                    <Text className="text-white  || ml-3 || font-semibold || text-xs">
                      {hours - time.hours === 0
                        ? `${min - time.min === 0 ? "1" : min - time.min}M`
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
        </TouchableOpacity>
        <View className="flex-1 || text-right || flex || justify-end">
          <Feather
            style={{ marginLeft: "auto" }}
            name="more-vertical"
            size={25}
            color="white"
          />
        </View>
      </View>
    </View>
  );
};
const ContentPostImage = ({ itemImg }) => {
  return (
    <>
      <View className="h-[450px] || mb-0.5">
        <Image
          className="h-full w-full || relative || z-10"
          resizeMode="cover"
          source={{ uri: itemImg }}
        />
      </View>
    </>
  );
};
const ContentPostInfo = ({ love, setLove, item, reload, setReload }) => {
  const myUser = useSelector((me) => me.auth);

  return (
    <View className="flex-row || items-center || justify-between || px-5">
      <View className="flex-row || items-center || gap-x-4">
        <TouchableOpacity
          onPress={() => {
            getDoc(doc(db, "post", item.id)).then((res) => {
              if (love) {
                const removeMyLike = res
                  .data()
                  .like.filter((ele) => ele !== myUser.email);
                updateDoc(doc(db, "post", item.id), {
                  likeLength: res.data().likeLength - 1,
                  like: removeMyLike,
                }).then((_) => {
                  setReload(reload + 1);
                  setLove(false);
                });
              } else {
                updateDoc(doc(db, "post", item.id), {
                  likeLength: res.data().likeLength + 1,
                  like: [...res.data().like, myUser.email],
                }).then((_) => {
                  setReload(reload + 1);
                  setLove(true);
                });
              }
            });
          }}
        >
          {love ? (
            <AntDesign name="heart" size={30} color="red" />
          ) : (
            <AntDesign name="hearto" size={30} color="white" />
          )}
        </TouchableOpacity>
        <FontAwesome5 name="comment" size={30} color="white" />
        <Feather name="send" size={30} color="white" />
      </View>
      <View>
        <Feather name="bookmark" size={30} color="white" />
      </View>
    </View>
  );
};
const ContentCaption = ({
  showComment,
  setShowComment,
  itemText,
  newData,
  item,
  reload,
  setReload,
}) => {
  const myUser = useSelector((me) => me.auth);
  const dispatch = useDispatch();
  return (
    <View className="my-2">
      {newData.likeLength === 0 ? (
        <Text className="text-white || px-5">No Likes</Text>
      ) : (
        <TouchableOpacity
          onPress={() => {
            dispatch(
              OPEN_LIKES({
                like: newData.like,
                likeLength: newData.likeLength,
              })
            );
          }}
        >
          <Text className="text-white || px-5">{newData.likeLength}Likes</Text>
        </TouchableOpacity>
      )}

      <Text className="text-white || mt-2 || px-5">{itemText}</Text>

      {newData.commentLength === 0 ? (
        <Text className="text-neutral-500 mt-0.5 || mb-1 || px-5">
          No Comment Now
        </Text>
      ) : (
        <TouchableOpacity onPress={() => setShowComment(!showComment)}>
          <Text className="text-neutral-500 mt-0.5 || mb-1 || px-5">
            View all {newData.commentLength} comments
          </Text>
        </TouchableOpacity>
      )}
      {showComment &&
        newData.comment.map((ele, i) => (
          <Comments
            length={i === newData.comment.length - 1 ? true : false}
            comment={ele}
            key={`${ele.commentText} ${i}`}
          />
        ))}
      <View className="">
        <Divider width={1} className="opacity-50 mt-5" orientation="vertical" />
      </View>
      <Formik
        initialValues={{ comment: "" }}
        onSubmit={(values, { resetForm }) =>
          getDoc(doc(db, "post", item.id)).then((res) => {
            updateDoc(doc(db, "post", item.id), {
              comment: [
                ...res.data().comment,
                { commentText: values.comment, email: myUser.email },
              ],
              commentLength: res.data().commentLength + 1,
            })
              .then((res) => {
                Keyboard.dismiss();
                resetForm();
              })
              .then((_) => {
                setReload(reload + 1);
              });
          })
        }
      >
        {({ handleSubmit, values, handleChange }) => (
          <View className="px-5 || flex-row || items-center || mt-5 ">
            <View className="relative || w-[35px] || h-[35px] || justify-center || items-center">
              <Image
                className="w-[35px] || h-[35px] || rounded-full || relative"
                resizeMode="cover"
                source={{ uri: myUser.img }}
              />
            </View>
            <TextInput
              placeholder="Write a caption"
              multiline={true}
              placeholderTextColor={"gray"}
              className="text-lg || text-white || ml-3 || flex-1"
              value={values.comment}
              onChangeText={handleChange("comment")}
            />
            <TouchableOpacity onPress={handleSubmit}>
              <Ionicons name="ios-send-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};
const Comments = ({ comment, length }) => {
  const [commentInfo, setCommentInfo] = useState([]);
  useEffect(() => {
    getDoc(doc(db, "users", comment.email)).then((res) => {
      setCommentInfo(res.data());
    });
  }, [comment]);
  return (
    <>
      <View className="flex-row || px-5 || items-center">
        <View>
          <View className="relative || w-[37px] || h-[37px] || justify-center || items-center">
            <Image
              className="w-[37px] || h-[37px] || rounded-full || absolute"
              resizeMode="cover"
              source={LinearPng}
            />
            <Image
              className="w-[35px] || h-[35px] || rounded-full || relative"
              resizeMode="cover"
              source={{ uri: commentInfo.urlImg }}
            />
          </View>
        </View>
        <View className="flex-1 || ml-3">
          <Text className="text-white || font-semibold || text-base">
            {commentInfo.userName}
          </Text>
          <Text className="text-white">{comment.commentText}</Text>
        </View>
      </View>
      {!length && (
        <View className="px-11">
          <Divider
            width={1}
            className="opacity-50 my-3"
            orientation="vertical"
          />
        </View>
      )}
    </>
  );
};
export default Post;
