import { collection, getDocs, addDoc, doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebase";
import CreatePet from "./CreatePet";
import VirtualPetHUD from "./VirtualPetHUD";
export default function VirtualPet(props) {
  const petCol = collection(db, `users/${props.userInfo.uid}/virtualPet`);
  const [petExists, setPetExists] = useState(false);
  const [petInfo, setPetInfo] = useState({});
  useEffect(() => {
    getDocs(petCol).then((snapshot) => {
      console.log(snapshot.docs);
      if (snapshot.docs.length > 0) {
        console.log("Pet Found");
        setPetExists(true);
      } else {
        console.log("Pet Not Found");
        setPetExists(false);
      }
    });
  }, []);
  useEffect(() => {
    getDocs(petCol).then((snapshot) => setPetInfo(snapshot.docs[0].data()));
  }, [petExists]);
  return (
    <div>
      {petExists == true ? (
        <VirtualPetHUD
          petCol={petCol}
          petInfo={petInfo}
          setPetInfo={setPetInfo}
          userInfo={props.userInfo}
          petRef={props.petRef}
        />
      ) : (
        <CreatePet petCol={petCol} setPetExists={setPetExists} />
      )}
    </div>
  );
}
