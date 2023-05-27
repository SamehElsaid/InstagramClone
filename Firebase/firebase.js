import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebase from "firebase/compat/app";
const firebaseConfig = {
  apiKey: "AIzaSyCKfaV2eLGTimXYt9BRgeAJ9pQqUxh_O14",
  authDomain: "insta-clone-a69a5.firebaseapp.com",
  projectId: "insta-clone-a69a5",
  storageBucket: "insta-clone-a69a5.appspot.com",
  messagingSenderId: "74675435689",
  appId: "1:74675435689:web:e5bcac3c398b4a5fe911b8",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { firebase };
