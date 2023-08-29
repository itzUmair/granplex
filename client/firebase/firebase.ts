import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBO5im9zMmis05IE733dxf1CY27Lt_4JOc",
  authDomain: "granplex-36e63.firebaseapp.com",
  projectId: "granplex-36e63",
  storageBucket: "granplex-36e63.appspot.com",
  messagingSenderId: "271092156004",
  appId: "1:271092156004:web:179c7f5cdbae0d033d4171",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export const storageRef = ref(storage);
