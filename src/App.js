import logo from "./logo.svg";
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { db, authentication } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  orderBy,
  onSnapshot,
  updateDoc,
  addDoc,
  where,
} from "firebase/firestore";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  setPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  update,
} from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";

import SignIn from "./components/SignIn";
import Warning from "./components/Warning";
import HabitSection from "./components/HabitSection";
import MoodTrackingSection from "./components/MoodTracking/MoodTrackingSection";
import VirtualPet from "./components/VirtualPet/VirtualPet";
import AddItem from "./components/AddItem";
import { Card } from "@mui/material";
import AnalysisTest from "./components/AnalysisTest";
import Header from "./components/Header";

function App() {
  //const [user, setUser] = useState({});
  const [userInfo, setUserInfo] = useState({});
  //const todosRef = firestore.collection(`users/${auth.currentUser.uid}/todos`);
  let userItemRef = collection(db, `users/${userInfo.uid}/todos`);
  const [userItems, setUserItems] = useState([]);
  const [standHabits, setStandHabits] = useState([]);
  const [userExists, setUserExists] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  let localItemArray = [];
  let testArr = [];
  const getUserData = () => {
    //console.log("Ran getUserData()");
    //console.log(userInfo);
    userItemRef = collection(db, `users/${userInfo.uid}/todos`);
    const sortedItemsQuery = query(
      userItemRef,
      orderBy("index"),
      where("completed", "==", false)
    );
    /*onSnapshot(qu, (snapshot) => {
      let books = [];
      snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id });
      });
      console.log(books);
    });*/
    getDocs(sortedItemsQuery)
      .then((snapshot) => {
        //const q = query(citiesRef, orderBy("name", "desc"), limit(3));
        //const qu = query(userItemRef, orderBy("id", "desc"), limit(10));
        //console.log(qu);
        localItemArray = [];
        //console.log({ userInfo });
        //console.log(snapshot.docs);
        snapshot.docs.forEach((doc) => {
          localItemArray.push({ ...doc.data(), id: doc.id });
        });
        setUserItems(localItemArray);
        //console.log({ bookArr });
      })
      .catch((error) => console.log(error.message));
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(authentication, provider)
      .then((re) => {
        // console.log("re");
        /*console.log(re.user);
        console.log(userItems.length);
        console.log(re.user.metadata.creationTime);
        console.log(re.user.metadata.lastSignInTime);*/
        if (re.user.metadata.creationTime === re.user.metadata.lastSignInTime) {
          console.log("New User");
          setUserExists(true);
          addDoc(collection(db, `users/${re.user.uid}/todos`), {
            title: "Email Lecturer",
            createdAt: new Date(),
            completed: false,
            index: 0,
          });
        }
        // console.log(re.user.uid);
        // console.log(`users/${re.user.uid}/todos`);
        // console.log({ userInfo });
        setUserInfo(re.user);
        // console.log({ userInfo });
        getUserData();
        console.log(userItems.length);
      })
      .then(getUserData)
      .catch((err) => console.log(err));
    getUserData();
  };
  const handleDelete = async (id) => {
    console.log("delete func");
    await deleteDoc(doc(db, `users/${userInfo.uid}/todos`, id));
  };

  const handleCheckIn = async (id, currentCount) => {
    console.log("base func ran");
    const docRef = doc(db, `users/${userInfo.uid}/todos`, id);

    await updateDoc(docRef, {
      checkInCounter: currentCount + 1,
      lastCheckInDate: new Date().toDateString(),
    });
  };

  const signUserOut = () => {
    signOut(authentication)
      .then(() => {
        // Sign-out successful.
        console.log("Signed Out");
        console.log(userInfo.displayName);
        setUserInfo("");
      })
      .catch((error) => {
        // An error happened.
        console.error(error);
      });
    console.log("Test");
  };

  const getStandardHabits = () => {
    let localArr = [];
    let standHabitsCol = collection(db, "standardHabits");
    getDocs(standHabitsCol)
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const habit = doc.data().habitTitle;
          localArr.push(habit);
        });
        setStandHabits(localArr);
      })
      .catch((error) => console.log(error.message));
  };

  /*getDocs(userItemRef)
    .then((snapshot) => {
      //console.log(snapshot.docs);
      snapshot.docs.forEach((doc) => {
        bookArr.push({ ...doc.data(), id: doc.id });
      });
      setBooks(bookArr);
      // console.log({ bookArr });
    })
    .catch((error) => console.log(error.message));*/
  useEffect(() => getUserData(), [userInfo, handleDelete]);

  useEffect(() => getStandardHabits(), []);

  const petRef = useRef(null);
  const accessEXP = () => {
    petRef.current();
  };

  return (
    <div className="App">
      {userInfo.uid ? (
        <div style={{ color: "black" }}>
          {/*<p> User: {userInfo.displayName}</p>
          <p> ID: {userInfo.uid}</p> */}
          <Header />
          <div className="main-section">
            <button onClick={open} id="add-button">
              Add Project
            </button>
            {modalOpen && (
              <div>
                <AddItem
                  user={userInfo}
                  getUserData={getUserData}
                  userItems={userItems}
                  modalOpen={modalOpen}
                  handleClose={close}
                  standHabits={standHabits}
                />
              </div>
            )}
            <HabitSection
              userInfo={userInfo}
              userItems={userItems}
              getUserData={getUserData}
              handleDelete={handleDelete}
              handleCheckIn={handleCheckIn}
              signUserOut={signUserOut}
              standHabits={standHabits}
              xpUp={petRef.current}
              id="Habit-Section"
            />
          </div>
        </div>
      ) : (
        <SignIn signInWithGoogle={signInWithGoogle} />
      )}
    </div>
  );
}

export default App;
